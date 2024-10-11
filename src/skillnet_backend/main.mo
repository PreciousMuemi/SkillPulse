import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor SkillNet {

    // Types
    type UserId = Principal;
    type CourseId = Nat;
    type NFTId = Nat;
    type Level = Nat;
    type Rank = Text;
    type Difficulty = { #beginner; #intermediate; #advanced };
    type Category = { #softSkills; #computing; #dataScience; #design; #business; #languages };

    type User = {
        id: UserId;
        username: Text;
        skills: [Text];
        completedCourses: [CourseId];
        enrolledCourses: [CourseId];
        tokens: Nat;
        nfts: [NFTId];
        level: Level;
        rank: Rank;
        isMentor: Bool;
        menteeId: ?UserId;
        mentorId: ?UserId;
        achievements: [Achievement];
    };

    type Course = {
        id: CourseId;
        title: Text;
        description: Text;
        tokenReward: Nat;
        nftReward: ?NFTId;
        category: Category;
        difficulty: Difficulty;
        modules: [Module];
        projects: [Project];
    };

    type Module = {
        id: Nat;
        title: Text;
        content: Text;
        quizQuestions: [QuizQuestion];
    };

    type Project = {
        id: Nat;
        description: Text;
        feedback: [Feedback];
        isComplete: Bool;
    };

    type Feedback = {
        reviewerId: UserId;
        comments: Text;
        rating: Nat;
    };

    type QuizQuestion = {
        question: Text;
        options: [Text];
        correctAnswerIndex: Nat;
    };

    type NFT = {
        id: NFTId;
        name: Text;
        description: Text;
        courseId: CourseId;
        rarity: Text;
    };

    type Achievement = {
        courseId: CourseId;
        certAwarded: Bool;
        badges: [Text];
        tokenAwarded: Nat;
    };

    type UserProgress = {
        userId: UserId;
        courseId: CourseId;
        completedModules: [Nat];
        completedProjects: [Nat];
        quizScores: [(Nat, Nat)];
    };

// Helper functions
    private func equal(a: (UserId, CourseId), b: (UserId, CourseId)) : Bool {
        Principal.equal(a.0, b.0) and a.1 == b.1
    };
 private func hashUserIdCourseId(key: (UserId, CourseId)) : Hash.Hash {
        let principalHash = Principal.hash(key.0);
        let courseIdHash = Hash.hash(key.1);
        principalHash ^ courseIdHash
    };

    // State
    private stable var nextCourseId : Nat = 0;
    private stable var nextNFTId : Nat = 0;
    private let users = HashMap.HashMap<UserId, User>(0, Principal.equal, Principal.hash);
    private let courses = HashMap.HashMap<CourseId, Course>(0, Nat.equal, Hash.hash);
    private let nfts = HashMap.HashMap<NFTId, NFT>(0, Nat.equal, Hash.hash);
    private let userProgress = HashMap.HashMap<(UserId, CourseId), UserProgress>(0, equal, hashUserIdCourseId);

    // Mentor Applications
    private let mentorApplications = HashMap.HashMap<UserId, Bool>(0, Principal.equal, Principal.hash); 

    // Course Creation
    public shared(msg) func createCourse(
        title: Text, 
        description: Text, 
        category: Category, 
        difficulty: Difficulty, 
        tokenReward: Nat, 
        modules: [Module], 
        projectDescriptions: [(Nat, Text)]
    ) : async Result.Result<CourseId, Text> {
        let projects : [Project] = Array.map(projectDescriptions, func (p : (Nat, Text)) : Project {
            {
                id = p.0;
                description = p.1;
                feedback = [];
                isComplete = false;
            }
        });

        let course : Course = {
            id = nextCourseId;
            title = title;
            description = description;
            tokenReward = tokenReward;
            nftReward = ?nextNFTId;
            category = category;
            difficulty = difficulty;
            modules = modules;
            projects = projects;
        };
        courses.put(nextCourseId, course);

        // Create NFT for course completion
        let nft : NFT = {
            id = nextNFTId;
            name = "Course Completion: " # title;
            description = "Awarded for completing " # title;
            courseId = nextCourseId;
            rarity = "Common";
        };
        nfts.put(nextNFTId, nft);

        let createdCourseId = nextCourseId;
        nextCourseId += 1;
        nextNFTId += 1;
        #ok(createdCourseId)
    };

    // Course Enrollment with Difficulty Restriction
    public shared(msg) func enrollInCourse(courseId: CourseId) : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (users.get(userId), courses.get(courseId)) {
            case (?user, ?course) {
                // Check if the user has completed the previous difficulty
                let difficultyPassed = switch (course.difficulty) {
                    case (#beginner) { true };
                    case (#intermediate) { 
                        Array.foldLeft<CourseId, Bool>(user.completedCourses, false, func(acc, id) {
                            acc or Option.get(Option.map(courses.get(id), func (c: Course) : Bool { 
                                c.difficulty == #beginner 
                            }), false)
                        })
                    };
                    case (#advanced) { 
                        Array.foldLeft<CourseId, Bool>(user.completedCourses, false, func(acc, id) {
                            acc or Option.get(Option.map(courses.get(id), func (c: Course) : Bool { 
                                c.difficulty == #intermediate 
                            }), false)
                        })
                    };
                };
                
                if (not difficultyPassed) {
                    return #err("Complete the previous difficulty before enrolling.");
                };

                let updatedUser : User = {
                    user with
                    enrolledCourses = Array.append<CourseId>(user.enrolledCourses, [courseId])
                };
                users.put(userId, updatedUser);

                // Initialize user progress for the course
                let newProgress : UserProgress = {
                    userId = userId;
                    courseId = courseId;
                    completedModules = [];
                    completedProjects = [];
                    quizScores = [];
                };
                userProgress.put((userId, courseId), newProgress);

                #ok()
            };
            case (null, _) { #err("User not found") };
            case (_, null) { #err("Course not found") };
        }
    };

    // Submit Project for Review
    public shared(msg) func submitProject(courseId: CourseId, projectId: Nat) : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (userProgress.get((userId, courseId)), courses.get(courseId)) {
            case (?progress, ?course) {
                let projectOpt = Array.find<Project>(course.projects, func(proj) { proj.id == projectId });
                switch (projectOpt) {
                    case (?project) {
                        if (project.isComplete) {
                            return #err("Project already completed.");
                        };
                        let updatedProjects = Array.map<Project, Project>(course.projects, func (p) {
                            if (p.id == projectId) { { p with isComplete = true } } else { p }
                        });
                        let updatedCourse = { course with projects = updatedProjects };
                        courses.put(courseId, updatedCourse);
                        
                        let updatedProgress = {
                            progress with
                            completedProjects = Array.append<Nat>(progress.completedProjects, [projectId])
                        };
                        userProgress.put((userId, courseId), updatedProgress);

                        #ok()
                    };
                    case null { #err("Project not found.") };
                };
            };
            case (_, _) { #err("User progress or course not found.") };
        }
    };

    // Add Feedback to Project
    public shared(msg) func addProjectFeedback(courseId: CourseId, projectId: Nat, feedback: Feedback) : async Result.Result<(), Text> {
        let reviewerId = msg.caller;
        switch (courses.get(courseId)) {
            case (?course) {
                let updatedProjects = Array.map<Project, Project>(course.projects, func (p) {
                    if (p.id == projectId) {
                        { p with feedback = Array.append<Feedback>(p.feedback, [feedback]) }
                    } else { p }
                });
                let updatedCourse = { course with projects = updatedProjects };
                courses.put(courseId, updatedCourse);
                #ok()
            };
            case null { #err("Course not found.") };
        }
    };

    // Mentor Applications and Approval
    public shared(msg) func applyForMentor() : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (users.get(userId)) {
            case (?user) {
                let hasAdvancedCourse = Array.foldLeft<CourseId, Bool>(user.completedCourses, false, func(acc, courseId) {
                    acc or Option.get(Option.map(courses.get(courseId), func (c: Course) : Bool { 
                        c.difficulty == #advanced 
                    }), false)
                });
                
                if (hasAdvancedCourse) {
                    mentorApplications.put(userId, true);
                    #ok()
                } else {
                    #err("Complete an advanced-level course to qualify for mentor status.")
                }
            };
            case null { #err("User not found.") };
        }
    };

    public shared(msg) func approveMentor(userId: UserId) : async Result.Result<(), Text> {
        switch (users.get(userId)) {
            case (?user) {
                let updatedUser = { user with isMentor = true };
                users.put(userId, updatedUser);
                ignore mentorApplications.remove(userId);
                #ok()
            };
            case null { #err("User not found.") };
        }
    };

    // Mentor-Mentee Matching
    public shared(msg) func matchMentor(menteeId: UserId) : async Result.Result<(), Text> {
        switch (users.get(menteeId)) {
            case (?mentee) {
                // Find available mentor
                for ((mentorId, mentor) in users.entries()) {
                    if (mentor.isMentor and Option.isNull(mentor.menteeId)) {
                        // Update mentee and mentor with each other's IDs
                        let updatedMentee = { mentee with mentorId = ?mentorId };
                        users.put(menteeId, updatedMentee);

                        let updatedMentor = { mentor with menteeId = ?menteeId };
                        users.put(mentorId, updatedMentor);

                        return #ok();
                    };
                };
                #err("No available mentors found.")
            };
            case null { #err("Mentee not found.") };
        }
    };
};