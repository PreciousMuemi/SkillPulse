import Nat "mo:base/Nat";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Array "mo:base/Array";

actor MentorMenteeSystem {
    // UserProfile structure
    public type UserProfile = {
        id: Nat;
        name: Text;
        role: Text;  // "mentor" or "mentee"
        skills: [Text];
        industry: Text;
        experience: Nat;
        mentorshipExperience: Nat;
        communicationStyle: Text;
        availability: Text;
        feedback: [Feedback]; 
        courses: [Course]; 
    };

    // Feedback structure
    type Feedback = {
        sessionId: Nat;
        mentorId: Nat;
        menteeId: Nat;
        rating: Nat;
        comments: Text;
    };

    // Course structure
    public type Course = {
        id: Nat;
        name: Text;
        progress: Nat;
    };

    // HashMap to store profiles
    var profiles = HashMap.HashMap<Nat, UserProfile>(1, Nat.equal, Hash.hash);

    // Create a new user profile
    public func createUserProfile(id: Nat, name: Text, role: Text, skills: [Text], industry: Text, experience: Nat, communicationStyle: Text, availability: Text) : async Bool {
        let newProfile: UserProfile = {
            id = id;
            name = name;
            role = role;
            skills = skills;
            industry = industry;
            experience = experience;
            mentorshipExperience = 0;  
            communicationStyle = communicationStyle;
            availability = availability;
            feedback = [];
            courses = [];  
        };

        profiles.put(id, newProfile);
        true
    };

    // Retrieve user profile by ID
    public query func getUserProfile(userId: Nat) : async ?UserProfile {
        profiles.get(userId)  
    };

    // Update an existing user profile
    public func updateUserProfile(id: Nat, name: ?Text, role: ?Text, skills: ?[Text], industry: ?Text, experience: ?Nat, communicationStyle: ?Text, availability: ?Text) : async Bool {
        switch (profiles.get(id)) {
            case (?profile) {
                let updatedProfile : UserProfile = {
                    id = id;
                    name = switch (name) { case (?newName) newName; case null profile.name };
                    role = switch (role) { case (?newRole) newRole; case null profile.role };
                    skills = switch (skills) { case (?newSkills) newSkills; case null profile.skills };
                    industry = switch (industry) { case (?newIndustry) newIndustry; case null profile.industry };
                    experience = switch (experience) { case (?newExperience) newExperience; case null profile.experience };
                    mentorshipExperience = profile.mentorshipExperience;
                    communicationStyle = switch (communicationStyle) { case (?newStyle) newStyle; case null profile.communicationStyle };
                    availability = switch (availability) { case (?newAvailability) newAvailability; case null profile.availability };
                    feedback = profile.feedback;
                    courses = profile.courses; 
                };
                profiles.put(id, updatedProfile); 
                true
            };
            case null {
                false  
            };
        };
    };

    // Delete a user profile
    public func deleteUserProfile(userId: Nat) : async Bool {
        switch (profiles.remove(userId)) {
            case (?_) { true };
            case null { false };
        }
    };

    // List all user profiles
    public query func listAllProfiles() : async [UserProfile] {
        Array.fromIter(profiles.entries())
    };
    
    // Enroll a user in a course
    public func enrollInCourse(userId: Nat, courseId: Nat, courseName: Text) : async Bool {
        switch (profiles.get(userId)) {
            case (?profile) {
                let alreadyEnrolled = Array.find<Course>(profile.courses, func(course) { course.id == courseId });
                switch (alreadyEnrolled) {
                    case (?_) { false };
                    case null {
                        let newCourse: Course = {
                            id = courseId;
                            name = courseName;
                            progress = 0; 
                        };
                        profile.courses := Array.append(profile.courses, [newCourse]);
                        profiles.put(userId, profile); 
                        true
                    };
                }
            };
            case null { false };
        };
    };

    // Update course progress
    public func updateCourseProgress(userId: Nat, courseId: Nat, newProgress: Nat) : async Bool {
        switch (profiles.get(userId)) {
            case (?profile) {
                let courseIndex = Array.indexOf<Course>({ id = courseId; name = ""; progress = 0 }, profile.courses, func(a, b) { a.id == b.id });
                switch (courseIndex) {
                    case (?index) {
                        let updatedCourses = Array.tabulate<Course>(
                            profile.courses.size(),
                            func (i) {
                                if (i == index) {
                                    { id = courseId; name = profile.courses[i].name; progress = newProgress }
                                } else {
                                    profile.courses[i]
                                }
                            }
                        );
                        profile.courses := updatedCourses;
                        profiles.put(userId, profile);
                        true
                    };
                    case null { false };
                }
            };
            case null { false };
        }
    };

    // List available mentors
    public query func listAvailableMentors() : async [UserProfile] {
        Array.filter<UserProfile>(
            Array.fromIter(profiles.entries()),
            func (profile) : Bool { profile.role == "mentor" and profile.availability == "true" }
        )
    };

    // Pick a mentor
    public func pickMentor(menteeId: Nat, mentorId: Nat) : async Bool {
        switch (profiles.get(menteeId), profiles.get(mentorId)) {
            case (?mentee, ?mentor) {
                if (mentor.role == "mentor" and mentor.availability == "true") {
                    let updatedMentor = {
                        mentor with
                        availability = "false"
                    };
                    profiles.put(mentorId, updatedMentor);
                    true
                } else {
                    false  
                }
            };
            case _ { false };
        }
    };

    // Submit feedback
    public func submitFeedback(sessionId: Nat, mentorId: Nat, menteeId: Nat, rating: Nat, comments: Text) : async Bool {
        let feedback = { sessionId; mentorId; menteeId; rating; comments };

        switch (profiles.get(mentorId), profiles.get(menteeId)) {
            case (?mentor, ?mentee) {
                let updatedMentor = {
                    mentor with
                    feedback = Array.append(mentor.feedback, [feedback])
                };
                let updatedMentee = {
                    mentee with
                    feedback = Array.append(mentee.feedback, [feedback])
                };

                profiles.put(mentorId, updatedMentor);  
                profiles.put(menteeId, updatedMentee);  
                true
            };
            case _ { false };
        }
    };

    // Get a mentor's average rating
    public func getMentorRating(mentorId: Nat) : async Nat {
        switch (profiles.get(mentorId)) {
            case (?mentor) {
                let totalRating = Array.foldLeft<Feedback, Nat>(
                    mentor.feedback,
                    0,
                    func (acc, fb) { acc + fb.rating }
                );
                let feedbackCount = mentor.feedback.size();

                if (feedbackCount == 0) {
                    0
                } else {
                    totalRating / feedbackCount
                }
            };
            case null { 0 };
        }
    };
}
