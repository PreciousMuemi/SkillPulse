import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor SkillNet {
    // Type definitions
    type User = {
        username: Text;
        skills: [Text];
        completedCourses: [Text];
        tokens: Nat;
        nfts: [Text];
        mentor: Bool;
    };

    type Course = {
        courseId: Text;
        title: Text;
        description: Text;
        difficulty: Text;
        tokenReward: Nat;
        nftReward: Text;
        modules: [Text];
    };

    type Project = {
        projectId: Text;
        courseId: Text;
        userId: Principal;
        feedback: ?Text;
        rating: ?Nat;
    };

    // Storage
    private var users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
    private var courses = HashMap.HashMap<Text, Course>(0, Text.equal, Text.hash);
    private var projects = HashMap.HashMap<Text, Project>(0, Text.equal, Text.hash);
    private var mentorApplications : [Principal] = [];
    private var mentorMenteePairs : [(Principal, Principal)] = [];

    // Helper functions
    private func getUserOrFail(userId: Principal) : Result.Result<User, Text> {
        switch (users.get(userId)) {
            case (?user) { #ok(user) };
            case null { #err("User not found") };
        };
    };

    private func getCourseOrFail(courseId: Text) : Result.Result<Course, Text> {
        switch (courses.get(courseId)) {
            case (?course) { #ok(course) };
            case null { #err("Course not found") };
        };
    };

    // User Management
    public shared(msg) func createUser(username: Text) : async Result.Result<Text, Text> {
        switch (users.get(msg.caller)) {
            case (?_) { #err("User already exists") };
            case null {
                let newUser : User = {
                    username = username;
                    skills = [];
                    completedCourses = [];
                    tokens = 0;
                    nfts = [];
                    mentor = false;
                };
                users.put(msg.caller, newUser);
                #ok("User created successfully")
            };
        };
    };

    public shared(msg) func getUser() : async Result.Result<User, Text> {
        getUserOrFail(msg.caller)
    };

    // Course Management
    public shared(msg) func createCourse(courseId: Text, title: Text, description: Text, difficulty: Text, tokenReward: Nat, nftReward: Text, modules: [Text]) : async Result.Result<Text, Text> {
        switch (courses.get(courseId)) {
            case (?_) { #err("Course already exists") };
            case null {
                let newCourse : Course = {
                    courseId = courseId;
                    title = title;
                    description = description;
                    difficulty = difficulty;
                    tokenReward = tokenReward;
                    nftReward = nftReward;
                    modules = modules;
                };
                courses.put(courseId, newCourse);
                #ok("Course created successfully")
            };
        };
    };

    public shared(msg) func enrollInCourse(courseId: Text) : async Result.Result<Text, Text> {
        switch (getUserOrFail(msg.caller), getCourseOrFail(courseId)) {
            case (#ok(user), #ok(course)) {
                if (course.difficulty == "Advanced" and user.completedCourses.size() < 3) {
                    return #err("User needs to complete more courses before enrolling in advanced courses");
                };
                let updatedUser = {
                    user with completedCourses = Array.append(user.completedCourses, [courseId])
                };
                users.put(msg.caller, updatedUser);
                #ok("Enrolled in course successfully")
            };
            case (#err(e), _) { #err(e) };
            case (_, #err(e)) { #err(e) };
        };
    };

    // Project Submission and Feedback
    public shared(msg) func submitProject(courseId: Text, projectId: Text) : async Result.Result<Text, Text> {
        switch (getUserOrFail(msg.caller), getCourseOrFail(courseId)) {
            case (#ok(_), #ok(_)) {
                let newProject : Project = {
                    projectId = projectId;
                    courseId = courseId;
                    userId = msg.caller;
                    feedback = null;
                    rating = null;
                };
                projects.put(projectId, newProject);
                #ok("Project submitted successfully")
            };
            case (#err(e), _) { #err(e) };
            case (_, #err(e)) { #err(e) };
        };
    };

    public shared(msg) func addProjectFeedback(projectId: Text, feedback: Text, rating: Nat) : async Result.Result<Text, Text> {
        switch (projects.get(projectId)) {
            case (?project) {
                let updatedProject = {
                    project with
                    feedback = ?feedback;
                    rating = ?rating;
                };
                projects.put(projectId, updatedProject);
                #ok("Feedback added successfully")
            };
            case null { #err("Project not found") };
        };
    };

    // Mentorship
    public shared(msg) func applyForMentor() : async Result.Result<Text, Text> {
        switch (getUserOrFail(msg.caller)) {
            case (#ok(user)) {
                if (user.completedCourses.size() < 3) {
                    return #err("User must complete at least 3 courses before applying for mentorship");
                };
                mentorApplications := Array.append(mentorApplications, [msg.caller]);
                #ok("Mentor application submitted successfully")
            };
            case (#err(e)) { #err(e) };
        };
    };

    public shared(msg) func approveMentor(userId: Principal) : async Result.Result<Text, Text> {
        switch (getUserOrFail(userId)) {
            case (#ok(user)) {
                let updatedUser = { user with mentor = true };
                users.put(userId, updatedUser);
                #ok("Mentor approved successfully")
            };
            case (#err(e)) { #err(e) };
        };
    };

    public shared(msg) func matchMentor(menteeId: Principal) : async Result.Result<Text, Text> {
        switch (getUserOrFail(msg.caller), getUserOrFail(menteeId)) {
            case (#ok(mentor), #ok(_)) {
                if (not mentor.mentor) {
                    return #err("Only approved mentors can be matched");
                };
                mentorMenteePairs := Array.append(mentorMenteePairs, [(msg.caller, menteeId)]);
                #ok("Mentor matched with mentee successfully")
            };
            case (#err(e), _) { #err(e) };
            case (_, #err(e)) { #err(e) };
        };
    };

    // Course Completion
    public shared(msg) func completeModule(courseId: Text, moduleId: Text) : async Result.Result<Text, Text> {
        switch (getUserOrFail(msg.caller), getCourseOrFail(courseId)) {
            case (#ok(user), #ok(course)) {
                let moduleExists = Array.find<Text>(course.modules, func (m: Text) : Bool { m == moduleId });
                
                switch (moduleExists) {
                    case (null) { return #err("Module not found in the course") };
                    case (?_) {
                        // Check if this was the last module
                        if (Array.size(course.modules) == 1 and course.modules[0] == moduleId) {
                            let updatedUser = {
                                user with
                                tokens = user.tokens + course.tokenReward;
                                nfts = Array.append(user.nfts, [course.nftReward]);
                                completedCourses = Array.append(user.completedCourses, [courseId]);
                            };
                            users.put(msg.caller, updatedUser);
                            #ok("Course completed. NFT and tokens awarded")
                        } else {
                            // Here you might want to update the user's progress for this specific course
                            // For simplicity, we're just acknowledging the module completion
                            #ok("Module completed successfully")
                        }
                    };
                };
            };
            case (#err(e), _) { #err(e) };
            case (_, #err(e)) { #err(e) };
        };
    };
}