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

    type User = {
        id: UserId;
        username: Text;
        skills: [Text];
        completedCourses: [CourseId];
        tokens: Nat;
        nfts: [NFTId];
    };

    type Course = {
        id: CourseId;
        title: Text;
        description: Text;
        tokenReward: Nat;
    };

    type NFT = {
        id: NFTId;
        name: Text;
        courseId: CourseId;
    };

    // State
    private stable var nextCourseId : Nat = 0;
    private stable var nextNFTId : Nat = 0;
    private let users = HashMap.HashMap<UserId, User>(0, Principal.equal, Principal.hash);
    private let courses = HashMap.HashMap<CourseId, Course>(0, Nat.equal, Hash.hash);
    private let nfts = HashMap.HashMap<NFTId, NFT>(0, Nat.equal, Hash.hash);

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
                    tokens = 0;
                    nfts = [];
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
    public shared(msg) func createCourse(title : Text, description : Text, tokenReward : Nat) : async Result.Result<CourseId, Text> {
        let course : Course = {
            id = nextCourseId;
            title = title;
            description = description;
            tokenReward = tokenReward;
        };
        courses.put(nextCourseId, course);
        nextCourseId += 1;
        #ok(nextCourseId - 1)
    };

    public query func getCourse(courseId : CourseId) : async Result.Result<Course, Text> {
        switch (courses.get(courseId)) {
            case (?course) { #ok(course) };
            case null { #err("Course not found") };
        }
    };

    // Course Completion and Rewards
    public shared(msg) func completeCourse(courseId : CourseId) : async Result.Result<(), Text> {
        let userId = msg.caller;
        switch (users.get(userId), courses.get(courseId)) {
            case (?user, ?course) {
                if (Array.find<CourseId>(user.completedCourses, func(id) { id == courseId }) != null) {
                    return #err("Course already completed");
                };

                let updatedUser : User = {
                    id = user.id;
                    username = user.username;
                    skills = user.skills;
                    completedCourses = Array.append<CourseId>(user.completedCourses, [courseId]);
                    tokens = user.tokens + course.tokenReward;
                    nfts = user.nfts;
                };
                users.put(userId, updatedUser);

                // Issue NFT
                let nft : NFT = {
                    id = nextNFTId;
                    name = "Completion: " # course.title;
                    courseId = courseId;
                };
                nfts.put(nextNFTId, nft);
                nextNFTId += 1;

                #ok()
            };
            case (null, _) { #err("User not found") };
            case (_, null) { #err("Course not found") };
        }
    };

    // Token Management
    public query func getTokenBalance(userId : UserId) : async Result.Result<Nat, Text> {
        switch (users.get(userId)) {
            case (?user) { #ok(user.tokens) };
            case null { #err("User not found") };
        }
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
}