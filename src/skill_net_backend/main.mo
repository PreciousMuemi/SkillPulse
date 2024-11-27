import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Array "mo:base/Array";

actor SkillNet {
    // Enhanced User type
type User = {
    userId: Principal;
    skills: [Text];
    completedCourses: [Text];
    tokens: Nat;
    nfts: [Text];
    mentor: Bool;
    experience_years: Nat;
    rating: Float;
    availability: [Text];
    timezone: Text;
    profile: UserProfile;
    verificationStatus: Text;
    lastActive: Time.Time;
};
type UserProfile = {
    bio: Text;
    education: [Text];
    certifications: [Text];
    socialLinks: [Text];
    preferredLanguages: [Text];
};
type MentorApplication = {
    userId: Principal;
    submissionDate: Time.Time;
    qualifications: [Text];
    specializations: [Text];
    testScores: [(Text, Nat)];
    status: Text; // "pending", "approved", "rejected"
};
    type MentorMatch = {
        mentor_id: Text;
        similarity: Float;
        experience_years: Nat;
        rating: Float;
        availability: [Text];
        timezone: Text;
        match_score: Float;
        skill_overlap: [Text];
    };

    type MatchMetrics = {
        total_matches: Nat;
        success_rate: Float;
        average_rating: Float;
        last_updated: Time.Time;
    };

    type Community = {
        communityId: Text;
        name: Text;
        description: Text;
        members: [Principal];
        courses: [Text];
        mentorSessions: [Text];
        approvedMembers: [Principal];
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

    private stable var mentorApplications : [Principal] = [];
    private stable var mentorMenteePairs : [(Principal, Principal)] = [];
    private stable var usersEntries : [(Principal, User)] = [];
    private stable var communitiesEntries : [(Text, Community)] = [];
    private stable var coursesEntries : [(Text, Course)] = [];
    private stable var projectsEntries : [(Text, Project)] = [];
    private stable var matchMetricsEntries : [(Text, MatchMetrics)] = [];

    private var users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
    private var communities = HashMap.HashMap<Text, Community>(0, Text.equal, Text.hash);
    private var courses = HashMap.HashMap<Text, Course>(0, Text.equal, Text.hash);
    private var projects = HashMap.HashMap<Text, Project>(0, Text.equal, Text.hash);
    private let rateLimit = HashMap.HashMap<Text, Time.Time>(100, Text.equal, Text.hash);
    private var matchMetrics = HashMap.HashMap<Text, MatchMetrics>(0, Text.equal, Text.hash);

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
  public shared(msg) func createUser(profile: UserProfile) : async Result.Result<Text, Text> {
    switch (users.get(msg.caller)) {
        case (?_) { #err("User already exists") };
        case null {
            let newUser : User = {
                userId = msg.caller;
                skills = [];
                completedCourses = [];
                tokens = 0;
                nfts = [];
                mentor = false;
                experience_years = 0;
                rating = 0.0;
                availability = [];
                timezone = "UTC";
                profile = profile;
                verificationStatus = "pending";
                lastActive = Time.now();
            };
            users.put(msg.caller, newUser);
            #ok("User created successfully")
        };
    };
};


    public shared(msg) func getUser() : async Result.Result<User, Text> {
        getUserOrFail(msg.caller)
    };

    public shared(msg) func whoami() : async Principal {
        msg.caller
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

    public shared(msg) func applyForMentor(application: MentorApplication) : async Result.Result<Text, Text> {
    switch (getUserOrFail(msg.caller)) {
        case (#ok(user)) {
            if (user.completedCourses.size() < 3) {
                return #err("User must complete at least 3 courses before applying for mentorship");
            };
            
            // Validate qualifications
            if (application.qualifications.size() < 2) {
                return #err("Insufficient qualifications");
            };

            // Check test scores
            let minRequiredScore = 80;
            for ((_, score) in application.testScores.vals()) {
                if (score < minRequiredScore) {
                    return #err("Did not meet minimum test score requirements");
                };
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
public shared func matchMentor(request: MentorRequest) : async Result.Result<MentorMatch, Text> {
        let mentors = await getAllMentors();
        
        // Filter mentors based on subject expertise
        let potentialMentors = Array.filter(mentors, func(mentor: Mentor) : Bool {
            mentor.expertise.contains(request.subject)
        });
        
        // Score each mentor based on multiple criteria
        let scoredMentors = Array.map(potentialMentors, func(mentor: Mentor) : (Mentor, Float) {
            var score : Float = 0;
            
            // Match availability
            let availabilityMatch = countMatchingAvailability(mentor.availability, request.availability);
            score += Float.fromInt(availabilityMatch) * 0.3;
            
            // Match timezone
            if (mentor.timezone == request.timezone) {
                score += 0.2;
            };
            
            // Match language preferences
            if (mentor.preferredLanguage == request.preferredLanguage) {
                score += 0.2;
            };
            
            // Consider mentor rating
            score += mentor.rating * 0.3;
            
            return (mentor, score);
        });
        
        // Sort mentors by score
        let sortedMentors = Array.sort(scoredMentors, func(a: (Mentor, Float), b: (Mentor, Float)) : Bool {
            a.1 > b.1
        });
        
        switch (Array.get(sortedMentors, 0)) {
            case (?(bestMatch, score)) {
                let mentorMatch : MentorMatch = {
                    mentorId = debug_show(bestMatch.id);
                    matchScore = score;
                    requestId = generateRequestId();
                    timestamp = Time.now();
                };
                return #ok(mentorMatch);
            };
            case null {
                return #err("No suitable mentor found");
            };
        };
    };
    // public shared func matchMentor(request: MentorRequest) : async Result.Result<MentorMatch, Text> {
    //     let mentors = await getAllMentors();
        
    //     // Filter mentors based on subject expertise
    //     let potentialMentors = Array.filter(mentors, func(mentor: Mentor) : Bool {
    //         return mentor.expertise.contains(request.subject);
    //     });
        
    //     // Score each mentor based on multiple criteria
    //     let scoredMentors = Array.map(potentialMentors, func(mentor: Mentor) : (Mentor, Float) {
    //         var score : Float = 0;
            
    //         // Match availability
    //         let availabilityMatch = countMatchingAvailability(mentor.availability, request.availability);
    //         score += Float.fromInt(availabilityMatch) * 0.3;
            
    //         // Match timezone
    //         if (mentor.timezone == request.timezone) {
    //             score += 0.2;
    //         };
            
    //         // Match language preferences
    //         if (mentor.preferredLanguage == request.preferredLanguage) {
    //             score += 0.2;
    //         };
            
    //         // Consider mentor rating
    //         score += mentor.rating * 0.3;
            
    //         return (mentor, score);
    //     });
        
    //     // Sort mentors by score
    //     let sortedMentors = Array.sort(scoredMentors, func(a: (Mentor, Float), b: (Mentor, Float)) : Bool {
    //         return a.1 > b.1;
    //     });
        
    //     switch (Array.get(sortedMentors, 0)) {
    //         case (?bestMatch) {
    //             let mentorMatch : MentorMatch = {
    //                 mentorId = bestMatch.0.id;
    //                 matchScore = bestMatch.1;
    //                 requestId = generateRequestId();
    //                 timestamp = Time.now();
    //             };
    //             return #ok(mentorMatch);
    //         };
    //         case null {
    //             return #err("No suitable mentor found");
    //         };
    //     };
    // };

public shared(msg) func verifyUserIdentity(documents: [Text]) : async Result.Result<Text, Text> {
    switch (getUserOrFail(msg.caller)) {
        case (#ok(user)) {
            let updatedUser = {
                user with
                verificationStatus = "verified";
                lastActive = Time.now();
            };
            users.put(msg.caller, updatedUser);
            #ok("User verification completed")
        };
        case (#err(e)) { #err(e) };
    };
};
    public shared(msg) func completeModule(courseId: Text, moduleId: Text) : async Result.Result<Text, Text> {
        switch (getUserOrFail(msg.caller), getCourseOrFail(courseId)) {
            case (#ok(user), #ok(course)) {
                let moduleExists = Array.find<Text>(course.modules, func (m: Text) : Bool { m == moduleId });
                
                switch (moduleExists) {
                    case (null) { return #err("Module not found in the course") };
                    case (?_) {
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
                            #ok("Module completed successfully")
                        }
                    };
                };
            };
            case (#err(e), _) { #err(e) };
            case (_, #err(e)) { #err(e) };
        };
    };

    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
        communitiesEntries := Iter.toArray(communities.entries());
        coursesEntries := Iter.toArray(courses.entries());
        projectsEntries := Iter.toArray(projects.entries());
        matchMetricsEntries := Iter.toArray(matchMetrics.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter<Principal, User>(usersEntries.vals(), 1, Principal.equal, Principal.hash);
        communities := HashMap.fromIter<Text, Community>(communitiesEntries.vals(), 1, Text.equal, Text.hash);
        courses := HashMap.fromIter<Text, Course>(coursesEntries.vals(), 1, Text.equal, Text.hash);
        projects := HashMap.fromIter<Text, Project>(projectsEntries.vals(), 1, Text.equal, Text.hash);
        matchMetrics := HashMap.fromIter<Text, MatchMetrics>(matchMetricsEntries.vals(), 1, Text.equal, Text.hash);
    };
}