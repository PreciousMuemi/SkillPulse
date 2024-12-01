import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Blob "mo:base/Blob";

import Learning "./modules/Learning";
import Social "./modules/Social";
import Mentorship "./modules/Mentorship";

actor SkillNet {
    type User = {
        userId: Principal;
        skills: [Text];
        completedCourses: [(Text, Nat)];
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
        achievements: [Text];
        xp: Nat;
        skillLevel: SkillLevel;
        vibeStatus: VibeStatus;
        contentScore: Nat;
        tribe: [Principal];
    };

    type UserProfile = {
        bio: Text;
        education: [Text];
        certifications: [Text];
        socialLinks: [Text];
        preferredLanguages: [Text];
    };

    type UserVibe = {
        mood: Text;
        streak: Nat;
        tribe: [Principal];
        lastVibeUpdate: Time.Time;
    };

    type MentorRequest = {
        subject: Text;
        availability: [Text];
        timezone: Text;
        preferredLanguage: Text;
    };

    type Mentor = {
        id: Principal;
        expertise: [Text];
        availability: [Text];
        timezone: Text;
        preferredLanguage: Text;
        rating: Float;
    };

    type MentorApplication = {
        userId: Principal;
        submissionDate: Time.Time;
        qualifications: [Text];
        specializations: [Text];
        testScores: [(Text, Nat)];
        status: Text;
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

    type MentorProfile = {
        userId: Principal;
        expertiseAreas: [Text];
        mentorshipStyle: MentorshipStyle;
        availabilitySlots: [TimeSlot];
        menteeCapacity: Nat;
        currentMentees: [Principal];
        rating: Float;
    };

    type MentorshipStyle = {
        #HandsOn;
        #Guided;
        #Strategic;
        #Technical;
    };

    type TimeSlot = {
        dayOfWeek: Text;
        startTime: Text;
        endTime: Text;
    };

    type MentorshipMatch = {
        mentorId: Principal;
        menteeId: Principal;
        matchScore: Float;
        recommendedInteractionStyle: MentorshipStyle;
        suggestedTopics: [Text];
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

    type SkillLevel = {
        level: Nat;
        title: Text;
    };

    type ContentUpload = {
        id: Text;
        userId: Principal;
        courseId: Text;
        contentType: Text;
        fileMetadata: FileMetadata;
        uploadTime: Time.Time;
        status: Text;
    };

    type FileMetadata = {
        id: Text;
        fileName: Text;
        fileSize: Nat;
        uploadTime: Time.Time;
        fileType: Text;
        ipfsHash: ?Text;
        storageLocation: Text;
    };

    type CreatorStatus = {
        vibeLevel: Text;
        streakCount: Nat;
        totalUploads: Nat;
        lastUploadTimestamp: Time.Time;
        tribe: [Principal];
        lastActive: Time.Time;
        contentScore: Nat;
    };

    type UserRole = {
        #Learner;
        #PeerTeacher;
        #Mentor;
    };

    type RolePrivileges = {
        role: UserRole;
        level: Nat;
        rights: [Text];
        maxDailyPosts: Nat;
        sknsEarned: Nat;
    };

    type Achievement = {
        id: Text;
        name: Text;
        description: Text;
        icon: Text;
        xpThreshold: Nat;
        tokenReward: Nat;
        badgeType: Text;
        nftReward: ?Text;
        unlocked: Bool;
        unlockedTimestamp: ?Time.Time;
        roleUpgrade: ?UserRole;
    };

    type AchievementShare = {
        id: Text;
        userId: Principal;
        achievementId: Text;
        sharedTimestamp: Time.Time;
        publicMessage: ?Text;
        likes: Nat;
        comments: [AchievementComment];
    };

    type AchievementComment = {
        commentId: Text;
        userId: Principal;
        content: Text;
        timestamp: Time.Time;
    };

    type ContentEligibility = {
        canPost: Bool;
        maxPostsPerDay: Nat;
        requiredLevel: Nat;
        features: [Text];
    };

    type Recommendation = {
        id: Text;
        userId: Principal;
        recommendationType: RecommendationType;
        score: Float;
        content: Text;
        timestamp: Time.Time;
    };

    type RecommendationType = {
        #Course;
        #Mentor;
        #Content;
        #Skill;
    };

    type SkillVisualization = {
        userId: Principal;
        overallLevel: Nat;
        skillRadar: [SkillRadarPoint];
        progressTrend: [SkillProgressPoint];
    };

    type SkillRadarPoint = {
        skill: Text;
        proficiencyLevel: Text;
        xpPercentage: Float;
    };

    type SkillProgressPoint = {
        timestamp: Time.Time;
        totalXP: Nat;
        level: Nat;
    };

    type Tribe = {
        id: Text;
        name: Text;
        description: Text;
        members: [Principal];
        achievements: [Achievement];
        vibeScore: Nat;
        createdAt: Time.Time;
        lastActive: Time.Time;
    };

    type ShareEvent = {
        id: Text;
        achievement: Achievement;
        sharedBy: Principal;
        message: Text;
        reactions: [Reaction];
        timestamp: Time.Time;
    };

    type Reaction = {
        user: Principal;
        reactionType: Text;
        timestamp: Time.Time;
    };

    type Community = {
        id: Text;
        name: Text;
        description: Text;
        focus: [Text];
        members: [Principal];
        content: [Text];
        metrics: CommunityMetrics;
        mentorSessions: [Text];
        approvedMembers: [Principal];
        createdAt: Time.Time;
    };

    type CommunityMetrics = {
        totalMembers: Nat;
        activeMembers: Nat;
        contentCount: Nat;
        engagementRate: Float;
        totalActions: Nat;
        lastUpdated: Time.Time;
    };

    type StudyJam = {
        id: Text;
        name: Text;
        description: Text;
        participants: [Principal];
        startTime: Time.Time;
        endTime: Time.Time;
        status: Text;
        learningGoals: [Text];
    };

    type ContentMood = {
        id: Text;
        mood: Text;
        intensity: Nat;
        timestamp: Time.Time;
        tags: [Text];
    };

    type VibeStatus = {
        currentMood: Text;
        energyLevel: Nat;
        focusScore: Nat;
        lastUpdate: Time.Time;
        streakDays: Nat;
    };

    type NFTData = {
        id: Text;
        owner: Principal;
        metadata: {
            name: Text;
            description: Text;
            image: Text;
            attributes: [(Text, Text)];
        };
        mintTime: Time.Time;
        transferHistory: [(Principal, Time.Time)];
    };

    private stable var usersEntries : [(Principal, User)] = [];
    private stable var communitiesEntries : [(Text, Community)] = [];
    private stable var coursesEntries : [(Text, Course)] = [];
    private stable var projectsEntries : [(Text, Project)] = [];
    private stable var matchMetricsEntries : [(Text, MatchMetrics)] = [];

    private let users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
    private let communities = HashMap.HashMap<Text, Community>(0, Text.equal, Text.hash);
    private let courses = HashMap.HashMap<Text, Course>(0, Text.equal, Text.hash);
    private let projects = HashMap.HashMap<Text, Project>(0, Text.equal, Text.hash);
    private let rateLimit = HashMap.HashMap<Text, Time.Time>(100, Text.equal, Text.hash);
    private let matchMetrics = HashMap.HashMap<Text, MatchMetrics>(0, Text.equal, Text.hash);
    private let achievements = HashMap.HashMap<Text, Achievement>(0, Text.equal, Text.hash);
    private let contentUploads = HashMap.HashMap<Text, ContentUpload>(0, Text.equal, Text.hash);
    private let fileMetadata = HashMap.HashMap<Text, FileMetadata>(0, Text.equal, Text.hash);
    private let mentorApplications = HashMap.HashMap<Principal, MentorApplication>(0, Principal.equal, Principal.hash);
    private let mentorMenteePairs = HashMap.HashMap<(Principal, Principal), Bool>(0, tupleEqual, tupleHash);
    private let studyJams = HashMap.HashMap<Text, StudyJam>(0, Text.equal, Text.hash);
    private let contentMoods = HashMap.HashMap<Text, ContentMood>(0, Text.equal, Text.hash);
    private let jamRewards = HashMap.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);
    private let userVibes = HashMap.HashMap<Principal, UserVibe>(0, Principal.equal, Principal.hash);
    private let userStreaks = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
    private let recommendations = HashMap.HashMap<Text, Recommendation>(0, Text.equal, Text.hash);

    private func tupleEqual((p1, p2): (Principal, Principal), (p3, p4): (Principal, Principal)) : Bool {
        Principal.equal(p1, p3) and Principal.equal(p2, p4)
    };

    private func tupleHash((p1, p2): (Principal, Principal)) : Nat {
        Principal.hash(p1) + Principal.hash(p2)
    };

    private func getUserOrFail(userId: Principal) : Result.Result<User, Text> {
        switch (users.get(userId)) {
            case (?user) { #ok(user) };
            case null { #err("User not found") };
        }
    };

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
                    achievements = [];
                    xp = 0;
                    skillLevel = { level = 1; title = "Beginner" };
                    vibeStatus = {
                        currentMood = "Neutral";
                        energyLevel = 0;
                        focusScore = 0;
                        lastUpdate = Time.now();
                                                streakDays = 0;
                    };
                    contentScore = 0;
                    tribe = [];
                };
                users.put(msg.caller, newUser);
                #ok("User created successfully");
            };
        };
    };

    public shared(msg) func getUser() : async Result.Result<User, Text> {
        getUserOrFail(msg.caller);
    };

    public shared(msg) func whoami() : async Principal {
        msg.caller;
    };

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

    public shared(msg) func createNewCourse(courseId: Text, title: Text, description: Text, difficulty: Text, tokenReward: Nat, nftReward: Text, modules: [Text]) : async Result.Result<Text, Text> {
        await Learning.createCourse(courseId, title, description, difficulty, tokenReward, nftReward, modules)
    };

    public shared(msg) func startCourseEnrollment(courseId: Text) : async Result.Result<Text, Text> {
        await Learning.enrollInCourse(courseId)
    };

    public shared(msg) func createTribe(name: Text, description: Text, initialMembers: [Principal]) : async Result.Result<Text, Text> {
        await Social.createTribe(name, description, initialMembers)
    };

    public shared(msg) func shareAchievement(achievementId: Text, message: Text) : async Result.Result<Text, Text> {
        await Social.shareAchievement(achievementId, message)
    };

    public shared(msg) func findMentor() : async Result.Result<MentorshipMatch, Text> {
        await Mentorship.findBestMentorMatch()
    };

    public shared(msg) func getPersonalizedRecommendations() : async [Recommendation] {
        await Mentorship.generatePersonalizedRecommendations()
    };

    public shared(msg) func updateUserVibe(vibe: UserVibe) : async Result.Result<Text, Text> {
        userVibes.put(msg.caller, vibe);
        #ok("Vibe updated successfully ✨")
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

                       
