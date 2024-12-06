import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Nat "mo:base/Nat";

// Separate models into their own module for better organization
module {
    // Define user-related types
    public type UserId = Principal;

    public type UserType = {
        #Normal;
        #Admin;
        #Mentor;
    };

    public type Mentortype = {
        #Professional;
        #NextGen;
        #Peer;
        #Life;
    };
    
    // Enhanced mentorship style with more nuanced categorization
    public type MentorshipStyle = {
        #HandsOn: HandsOnStyle;
        #Guided: GuidedStyle;
        #Strategic: StrategicStyle;
        #Technical: TechnicalStyle;
        #Other: OtherStyle;
    };

    // Subtypes for more granular style matching
    public type HandsOnStyle = {
        #PracticalProjects;
        #CodeReviews;
        #PairProgramming;
    };

    public type GuidedStyle = {
        #StructuredLearning;
        #FlexibleMentoring;
        #GoalOriented;
    };

    public type StrategicStyle = {
        #CareerDevelopment;
        #LongTermPlanning;
        #NetworkBuilding;
    };

    public type TechnicalStyle = {
        #DeepTechnicalDiving;
        #ArchitecturalGuidance;
        #EmergingTechnologies;
    };

    public type OtherStyle = {
        #Soft;
        #Inspirational;
        #Personal;
    };

    // Detailed user profile with privacy settings
    public type UserProfile = {
        id: UserId;
        name: Text;
        bio: Text;
        email: Text;
        avatar: Text;
        location: Text;
        userType: UserType;
        xp: Nat;
        token_balance: Nat;
        
        // Privacy-controlled fields
        privacySettings: PrivacySettings;
        
        // Enhanced attributes with more context
        badges: [Badge];
        certifications: [Certification];
        skills: [Skill];
        
        preferredMentorshipStyle: MentorshipStyle;
        expertise: [Expertise];
        
        // More nuanced activity and experience tracking
        activityLevel: ActivityLevel;
        experienceYears: Float;
        learningPreferences: [LearningPreference];
        
        // User goals and objectives
        careerGoals: [Text];
        industrialSectors: [Text];
    };

    public type MentorProfile = {
        id: UserId;
        name: Text;
        bio: Text;
        email: Text;
        avatar: Text;

        location: Text;
        mentorType: Mentortype;
        privacySettings: PrivacySettings;

        badges: [Badge];
        certifications: [Certification];
        skills: [Skill];
        rating: Float;

    };

    // Privacy control for profile fields
    public type PrivacySettings = {
        showBadges: Bool;
        showCertifications: Bool;
        showSkills: Bool;
        showExpertise: Bool;
    };

    // Structured badges with more metadata
    public type Badge = {
        name: Text;
        description: Text;
        earnedDate: Time.Time;
        category: Text;
    };

    // Detailed certification type
    public type Certification = {
        name: Text;
        issuingBody: Text;
        validUntil: ?Time.Time;
        verificationLink: ?Text;
    };

    // Skill with proficiency level
  
public type Skill = {
    name: Text;                          // The name of the skill (e.g., "JavaScript").
    proficiencyLevel: SkillLevel;        // The proficiency level of the skill.
    lastUsed: Time.Time;                 // The last time this skill was used.
    category: ?SkillCategory;            // Optional category for the skill (e.g., Technical, Soft).
    endorsements: Nat;                    // Number of endorsements for this skill.
    certifications: [Certification];      // List of certifications related to this skill.
};

// Skill Level Definition
public type SkillLevel = {
    #Beginner;                           // Represents a beginner level of proficiency.
    #Intermediate;                       // Represents an intermediate level of proficiency.
    #Advanced;                           // Represents an advanced level of proficiency.
    #Expert;                             // Represents an expert level of proficiency.
};

// Skill Category Definition
public type SkillCategory = {
    #Technical;                          // Technical skills (e.g., programming languages).
    #Soft;                               // Soft skills (e.g., communication, teamwork).
    #Leadership;                         // Leadership skills (e.g., project management).
    #Creative;                           // Creative skills (e.g., design, writing).
};




    // More detailed expertise tracking
    public type Expertise = {
        domain: Text;
        specialization: ?Text;
        yearsOfExperience: Float;
    };

    // Granular activity level tracking
    public type ActivityLevel = {
        communityEngagement: Float; // 0-1
        professionalContributions: Float; // 0-1
        learningInitiatives: Float; // 0-1
    };

    // Learning preference with more details
    public type LearningPreference = {
        method: LearningMethod;
        intensity: LearningIntensity;
    };

    public type LearningMethod = {
        #VideoTutorials;
        #Mentorship;
        #Courses;
        #Readings;
        #Workshops;
        #Podcasts;
    };

    public type LearningIntensity = {
        #Low;
        #Medium;
        #High;
        #Intensive;
    };

    // Enhanced mentorship match with more tracking
    public type MentorshipMatch = {
        mentorId: Principal;
        menteeId: Principal;
        matchScore: MatchScore;
        matchedAt: Time.Time;
        status: MatchStatus;
        interactionHistory: [Interaction];
    };

    public type MatchScore = {
        overall: Float;
        styleSimilarity: Float;
        expertiseSimilarity: Float;
        activityAlignment: Float;
        experienceComplementarity: Float;
    };

    public type MatchStatus = {
        #Pending;
        #Active;
        #Completed;
        #Terminated;
    };

    public type Interaction = {
        timestamp: Time.Time;
        notes: Text;
        rating: ?Float; // Optional user feedback
    };

    // User type encompassing profile and additional metadata
    public type User = {
        userId: Principal;
        profile: UserProfile;
        registeredAt: Time.Time;
        lastUpdated: Time.Time;
    };

    public type Mentor = {
        userId: Principal;
        profile: MentorProfile;
        registeredAt: Time.Time;
        lastUpdated: Time.Time;
    };

    // Enhanced error type for more descriptive error handling
    public type ServiceError = {
        #UserNotFound : { userId : Principal };
        #InvalidInput : { message : Text };
        #MatchingError : { reason : Text };
        #AuthorizationError : { message : Text };
        #DatabaseError : { details : Text };
    };

    // Result type with more specific error handling
    public type Result<T, E> = {
        #ok : T;
        #err : E;
    };

    public type Course = {
        courseId: Text;
        title: Text;
        description: Text;
        difficulty: Text;
        tokenReward: Nat;
        nftReward: Text;
        modules: [Text];
    };

    public type Project = {
        projectId: Text;
        courseId: Text;
        userId: Principal;
        feedback: ?Text;
        rating: ?Nat;
    };

    public type MessageType = {
        #DirectMessage;
        #MentorshipInquiry;
        #ProjectCollaboration;
        #CourseDiscussion;
        #NetworkRequest;
    };

    public type CommunicationStatus = {
        #Unread;
        #Read;
        #Responded;
        #Archived;
    };

    public type Message = {
        id: Text;
        senderId: Principal;
        receiverId: Principal;
        content: Text;
        timestamp: Time.Time;
        messageType: MessageType;
        status: CommunicationStatus;
        relatedEntityId: ?Text; // Optional ID for course, project, etc.
    };

    public type Notification = {
        id: Text;
        userId: Principal;
        content: Text;
        timestamp: Time.Time;
        notificationType: NotificationType;
        read: Bool;
    };

    public type NotificationType = {
        #MessageReceived;
        #MentorshipMatch;
        #ProjectInvite;
        #AchievementUnlocked;
        #SkillEndorsement;
    };

public type VibeStatus = {
        currentMood: Text;
        energyLevel: Nat;
        focusScore: Nat;
        lastUpdate: Time.Time;
        streakDays: Nat;
    };

    public type Tribe = {
        id: Text;
        name: Text;
        description: Text;
        members: [Principal];
        achievements: [Achievement];
        vibeScore: Nat;
        createdAt: Time.Time;
        lastActive: Time.Time;
    };

    public type ShareEvent = {
        id: Text;
        achievementId: Text;
        sharedBy: Principal;
        message: Text;
        reactions: [Reaction];
        timestamp: Time.Time;
    };

    public type Community = {
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

    public type CommunityMetrics = {
        totalMembers: Nat;
        activeMembers: Nat;
        contentCount: Nat;
        engagementRate: Float;
        totalActions: Nat;
        lastUpdated: Time.Time;
    };

    public type Achievement = {
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

    public type ContentUpload = {
        id: Text;
        userId: Principal;
        courseId: Text;
        contentType: Text;
        fileMetadata: FileMetadata;
        uploadTime: Time.Time;
        status: Text;
        quality: Nat;
    };

    public type StudyJam = {
        id: Text;
        name: Text;
        description: Text;
        date: Text;
        participants: [Principal];
    };
    
    public type FileMetadata = {
        id: Text;
        fileName: Text;
        fileSize: Nat;
        uploadTime: Time.Time;
        fileType: Text;
        ipfsHash: ?Text;
        storageLocation: Text;
    };

    public type UserRole = {
        #Learner;
        #PeerTeacher;
        #Mentor;
    };

    public type Reaction = {
        user: Principal;
        reactionType: Text;
        timestamp: Time.Time;
    };

    public type IPFSContent = {
        cid: Text;
        size: Nat;
        mimeType: Text;
        timestamp: Time.Time;
    };

    public type Post = {
        id : Text;
        author : Principal;
        content : Text;
        title : Text;
        timestamp : Int;
    };

    public type Forum = {
        id : Text;
        name : Text;
        description : Text;
        posts : [Post];
    };

}