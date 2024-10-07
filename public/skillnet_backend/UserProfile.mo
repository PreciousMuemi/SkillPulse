import Nat "mo:base/Nat";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";


actor {
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
        var feedback: [Feedback]; 
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

    //  create a new user profile
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
        return true;
    };

    //retrieve user profile by ID
    public shared query func getUserProfile(userId: Nat) : async ?UserProfile {
        return profiles.get(userId);  
    };

    // update an existing user profile
    public func updateUserProfile(id: Nat, name: ?Text, role: ?Text, skills: ?[Text], industry: ?Text, experience: ?Nat, communicationStyle: ?Text, availability: ?Text) : async Bool {
        let profileOpt = profiles.get(id);
        switch (profileOpt) {
            case (?profile) {
                let updatedProfile = {
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
                return true;
            };
            case null {
                return false;  
            };
        };
    };

    // delete a user profile
    public func deleteUserProfile(userId: Nat) : async Bool {
        return profiles.remove(userId) != null;  
    };

    // submit feedback
    public func submitFeedback(sessionId: Nat, mentorId: Nat, menteeId: Nat, rating: Nat, comments: Text): async Bool {
        let feedback = { sessionId = sessionId; mentorId = mentorId; menteeId = menteeId; rating = rating; comments = comments };

        let mentorOpt = profiles.get(mentorId);
        let menteeOpt = profiles.get(menteeId);

        switch (mentorOpt, menteeOpt) {
            case (null, _) {
                return false;  
            };
            case (_, null) {
                return false;  
            };
            case (?mentor, ?mentee) {
                // feedback to both mentor and mentee profiles
                let updatedMentor = { mentor with feedback = HashMap.append(mentor.feedback, [feedback]) };
                let updatedMentee = { mentee with feedback = HashMap.append(mentee.feedback, [feedback]) };

                profiles.put(mentorId, updatedMentor);  
                profiles.put(menteeId, updatedMentee);  
                return true;
            };
        }
    };

    // Function to get a mentor's average rating
    public func getMentorRating(mentorId: Nat): async Nat {
        let mentorOpt = profiles.get(mentorId);

        // Check if the mentor profile exists
        switch (mentorOpt) {
            case (?mentor) {
                var totalRating = 0;
                var feedbackCount = 0;

                // Loop through each feedback and calculate total rating
                for (fb: Feedback in mentor.feedback) { 
                    totalRating += fb.rating; 
                    feedbackCount += 1; 
                };

                if (feedbackCount == 0) {
                    return 0; 
                };

                // Return the average rating
                return totalRating / feedbackCount; 
            };
            case null {
                return 0; 
            };
        };
    };

    // Function to list all user profiles
    public shared query func listAllProfiles() : async [UserProfile] {
        // Convert HashMap to an array of UserProfiles
        let profileEntries = HashMap.entries(profiles);
        var allProfiles = [];
        for (entry in profileEntries) {
            allProfiles := Array.append(allProfiles, [entry.val]);
        };
        return allProfiles;  // Returns all profiles as an array
    };
    
    // Function to enroll a user in a course
    public func enrollInCourse(userId: Nat, courseId: Nat, courseName: Text) : async Bool {
        let profileOpt = profiles.get(userId);
        switch (profileOpt) {
            case (?profile) {
                // if the course is already enrolled
                for (course in profile.courses) {
                    if (course.id == courseId) {
                        return false; 
                    }
                };

                // Create a new course entry
                let newCourse: Course = {
                    id = courseId;
                    name = courseName;
                    progress = 0; 
                };

                // Add the course to the user's profile
                profile.courses := Array.append(profile.courses, [newCourse]);
                profiles.put(userId, profile); 
                return true;
            };
            case null {
                return false; 
            };
        };
    };

    // update course progress
    public func updateCourseProgress(userId: Principal, courseId: Nat, newProgress: Nat) : async Bool {
        let profileOpt = profiles.get(userId);
        switch (profileOpt) {
            case (?profile) {
                // Find the course and update progress
                var courseFound = false;
                var courseCompleted = false;
                
                Array.forEach(profile.courses, func(course) {
                    if (course.id == courseId) {
                        // Ensure newProgress is between 0 and 100
                        let clampedProgress = if (newProgress > 100) 100 else if (newProgress < 0) 0 else newProgress;
                        course.progress := clampedProgress; 
                        courseFound := true; 

                        // Check if the course is completed
                        if (clampedProgress == 100) {
                            courseCompleted := true;
                        }
                    }
                });

                if (courseFound) {
                    profiles.put(userId, profile);
                    // Trigger token update if course is completed
                    if (courseCompleted) {
                        // reference to the token canister instance
                        let tokensEarned : Nat = 5; // remember Adjust this
                        let tokenUpdateResult = await TokenCanister.updateBalance(userId, tokensEarned);
                        // Handle token update success/failure as needed
                    };
                    return true; // Progress updated
                } else {
                    return false; // Course not found
                }
            };
            case null {
                return false; // Profile not found
            };
        };
    };
}
