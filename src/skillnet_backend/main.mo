import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";

actor SkillNet {

    // Types
    type UserId = Principal;
    type CourseId = Nat;
    type NFTId = Nat;
    type Level = Nat;
    type Rank = Text;

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
    };

    type Course = {
        id: CourseId;
        title: Text;
        description: Text;
        tokenReward: Nat;
        nftReward: ?NFTId;
        modules: [Module];
    };

    type Module = {
        id: Nat;
        title: Text;
        content: Text;
        quizQuestions: [QuizQuestion];
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

    type UserProgress = {
        userId: UserId;
        courseId: CourseId;
        completedModules: [Nat];
        quizScores: [(Nat, Nat)]; // (moduleId, score)
    };

    // Custom hash function for (UserId, CourseId) pair
    private func hashUserIdCourseId(key: (UserId, CourseId)): Hash.Hash {
        let (userId, courseId) = key;
        let userIdHash = Principal.hash(userId);
        let courseIdHash = Hash.hash(courseId);
        // Combine the two hashes
        userIdHash ^ courseIdHash
    };

    // State
    private stable var nextCourseId : Nat = 0;
    private stable var nextNFTId : Nat = 0;
    private let users = HashMap.HashMap<UserId, User>(0, Principal.equal, Principal.hash);
    private let courses = HashMap.HashMap<CourseId, Course>(0, Nat.equal, Nat32.fromNat);
    private let nfts = HashMap.HashMap<NFTId, NFT>(0, Nat.equal, Nat32.fromNat);
    private let userProgress = HashMap.HashMap<(UserId, CourseId), UserProgress>(0, func((k1, k2)) = k1.0 == k2.0 and k1.1 == k2.1, hashUserIdCourseId);

    // Helper Functions
    private func calculateLevel(completedCourses: [CourseId]) : Level {
        completedCourses.size() + 1 // Simple level calculation
    };

    private func calculateRank(level: Level) : Rank {
        if (level < 5) "Novice"
        else if (level < 10) "Apprentice"
        else if (level < 20) "Adept"
        else if (level < 30) "Expert"
        else "Master"
    };

    // User Management
    public shared(msg) func createUser(username : Text) : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (users.get(userId)) {
            case (?_) { #err("User already exists") };
            case null {
                let newUser : User = {
                    id = userId;
                    username = username;
                    skills = [];
                    completedCourses = [];
                    enrolledCourses = [];
                    tokens = 100; // Starting tokens
                    nfts = [];
                    level = 1;
                    rank = "Novice";
                    isMentor = false;
                    menteeId = null;
                    mentorId = null;
                };
                users.put(userId, newUser);
                #ok()
            };
        }
    };

    public query func getUser(userId : UserId) : async Result.Result<User, Text> {
        switch (users.get(userId)) {
            case (?user) { #ok(user) };
            case null { #err("User not found") };
        }
    };

    // Course Management
    public shared(msg) func createCourse(title : Text, description : Text, tokenReward : Nat, modules : [Module]) : async Result.Result<CourseId, Text> {
        let course : Course = {
            id = nextCourseId;
            title = title;
            description = description;
            tokenReward = tokenReward;
            nftReward = ?nextNFTId;
            modules = modules;
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

        nextCourseId += 1;
        nextNFTId += 1;
        #ok(nextCourseId - 1)
    };

    public query func getCourse(courseId : CourseId) : async Result.Result<Course, Text> {
        switch (courses.get(courseId)) {
            case (?course) { #ok(course) };
            case null { #err("Course not found") };
        }
    };

    public shared(msg) func enrollInCourse(courseId : CourseId) : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (users.get(userId), courses.get(courseId)) {
            case (?user, ?course) {
                if (Array.find<CourseId>(user.enrolledCourses, func(id) { id == courseId }) != null) {
                    return #err("Already enrolled in this course");
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
                    quizScores = [];
                };
                userProgress.put((userId, courseId), newProgress);

                #ok()
            };
            case (null, _) { #err("User not found") };
            case (_, null) { #err("Course not found") };
        }
    };

    // Course Progress and Completion
    public shared(msg) func completeModule(courseId : CourseId, moduleId : Nat, quizScore : Nat) : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (userProgress.get((userId, courseId))) {
            case (?progress) {
                let updatedCompletedModules = Array.append<Nat>(progress.completedModules, [moduleId]);
                let updatedQuizScores = Array.append<(Nat, Nat)>(progress.quizScores, [(moduleId, quizScore)]);
                
                let updatedProgress : UserProgress = {
                    progress with
                    completedModules = updatedCompletedModules;
                    quizScores = updatedQuizScores;
                };
                userProgress.put((userId, courseId), updatedProgress);

                // Check if all modules are completed
                switch (courses.get(courseId)) {
                    case (?course) {
                        if (updatedCompletedModules.size() == course.modules.size()) {
                            await completeCourse(userId, courseId);
                        };
                    };
                    case null { return #err("Course not found") };
                };

                #ok()
            };
            case null { #err("User progress not found") };
        }
    };

    private func completeCourse(userId : UserId, courseId : CourseId) : async () {
        switch (users.get(userId), courses.get(courseId)) {
            case (?user, ?course) {
                let updatedUser : User = {
                    user with
                    completedCourses = Array.append<CourseId>(user.completedCourses, [courseId]);
                    tokens = user.tokens + course.tokenReward;
                    level = calculateLevel(Array.append<CourseId>(user.completedCourses, [courseId]));
                    rank = calculateRank(calculateLevel(Array.append<CourseId>(user.completedCourses, [courseId])));
                    nfts = Array.append<NFTId>(user.nfts, [Option.get(course.nftReward, nextNFTId)]);
                };
                users.put(userId, updatedUser);
            };
            case _ { /* Handle errors */ };
        };
    };

    // NFT Management
    public query func getUserNFTs(userId : UserId) : async Result.Result<[NFT], Text> {
        switch (users.get(userId)) {
            case (?user) {
                let userNFTs = Array.mapFilter<NFTId, NFT>(user.nfts, func (id) {
                    nfts.get(id)
                });
                #ok(userNFTs)
            };
            case null { #err("User not found") };
        }
    };

    // Mentor-Mentee Matching
    public shared(msg) func becomeMentor() : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (users.get(userId)) {
            case (?user) {
                if (user.isMentor) {
                    return #err("User is already a mentor");
                };
                let updatedUser : User = {
                    user with
                    isMentor = true;
                };
                users.put(userId, updatedUser);
                #ok()
            };
            case null { #err("User not found") };
        }
    };

    public shared(msg) func requestMentor() : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (users.get(userId)) {
            case (?user) {
                if (user.mentorId != null) {
                    return #err("User already has a mentor");
                };
                // Find an available mentor (simple implementation)
                for ((_, potentialMentor) in users.entries()) {
                    if (potentialMentor.isMentor and potentialMentor.menteeId == null) {
                        let updatedMentee : User = {
                            user with
                            mentorId = ?potentialMentor.id;
                        };
                        let updatedMentor : User = {
                            potentialMentor with
                            menteeId = ?userId;
                        };
                        users.put(userId, updatedMentee);
                        users.put(potentialMentor.id, updatedMentor);
                        return #ok();
                    };
                };
                #err("No available mentors")
            };
            case null { #err("User not found") };
        }
    };

    // Additional query functions for user progress, course listings, etc.
    public query func getUserProgress(userId : UserId, courseId : CourseId) : async Result.Result<UserProgress, Text> {
        switch (userProgress.get((userId, courseId))) {
            case (?progress) { #ok(progress) };
            case null { #err("Progress not found") };
        }
    };

    // Updated listCourses function
    public query func listCourses() : async [Course] {
        Iter.toArray(courses.vals())
    };

    public query func listMentors() : async [User] {
        Buffer.toArray(Buffer.mapFilter<User, User>(Buffer.fromIter(users.vals()), func (user) {
            if (user.isMentor) ?user else null
        }))
    };
}