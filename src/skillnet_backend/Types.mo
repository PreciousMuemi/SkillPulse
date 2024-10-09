// Types.mo - Core data types for SkillNet platform

import Time "mo:base/Time";

module {
    // User type representing a SkillNet user
    public type User = {
        id: Nat;
        username: Text;
        email: Text;
        profilePicture: ?Text;
        bio: ?Text;
        skills: [Text];
        enrolledCourses: [Nat];
        completedCourses: [Nat];
        nfts: [Nat];
        createdAt: Time.Time;
    };

    // Course type representing a learning course on SkillNet
    public type Course = {
        id: Nat;
        title: Text;
        description: Text;
        instructor: Text;
        duration: Nat; // in minutes
        category: Text;
        skillLevel: Text;
        price: Nat; // in tokens
        enrolledStudents: [Nat];
        rating: Float;
        createdAt: Time.Time;
    };

    // Mentor type representing a SkillNet mentor
    public type Mentor = {
        id: Nat;
        userId: Nat;
        expertise: [Text];
        experience: Nat; // in years
        availableHours: Nat;
        rating: Float;
        reviews: [Review];
        approvalStatus: Bool;
        createdAt: Time.Time;
    };

    // Review type for mentor reviews
    public type Review = {
        id: Nat;
        reviewerId: Nat;
        rating: Nat;
        comment: Text;
        createdAt: Time.Time;
    };

    // NFT type representing skill certificates and achievements
    public type NFT = {
        id: Nat;
        ownerId: Nat;
        title: Text;
        description: Text;
        imageUrl: Text;
        metadataUrl: Text;
        createdAt: Time.Time;
    };

    // Job type representing job listings in the marketplace
    public type Job = {
        id: Nat;
        title: Text;
        company: Text;
        description: Text;
        requirements: [Text];
        salary: ?Nat;
        location: Text;
        applicationDeadline: Time.Time;
        createdAt: Time.Time;
    };
}