import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

actor MainActor {
        

    // Define user profile structure with more attributes
    type UserProfile = {
        name: Text;
        bio: Text;
        avatar: Text;
        location: Text;
        badges: [Text]; // Badges that the user has earned
        certifications: [Text]; // List of certifications earned
        skills: [Text]; // List of skills the user has
        preferredMentorshipStyle: MentorshipStyle; // Preferred mentorship style
        expertise: [Text]; // Expertise areas (e.g., "AI", "Blockchain", etc.)
        activityLevel: Float; // 0 to 1 scale (higher activity = better match)
        experienceYears: Float; // Years of experience
        learningPreferences: [Text]; // Preferences for learning methods (e.g., "video", "reading")
    };

    // Define mentorship styles
    type MentorshipStyle = {
        #HandsOn;
        #Guided;
        #Strategic;
        #Technical;
        #Other;
    };

    // Define a User structure that contains the user profile
    type User = {
        userId: Principal;
        profile: UserProfile;
    };

    // Define mentorship match structure
    type MentorshipMatch = {
        mentorId: Principal;
        menteeId: Principal;
        matchScore: Float;
    };
    type Result<T, E> =  { 
        #ok: T; 
        #err: E; 
    };

    // Scalable HashMap to store users and their profiles
    var users = HashMap.HashMap<Principal, User>(1000, 
        func (x: Principal, y: Principal): Bool { x == y }, 
        func (x: Principal): HashMap.Hash { HashMap.hashPrincipal(x) }
    );

    // Scalable HashMap to store mentorship matches
    var mentorMatches = HashMap.HashMap<Principal, [MentorshipMatch]>(1000, 
        func (x: Principal, y: Principal): Bool { x == y }, 
        func (x: Principal): HashMap.Hash { HashMap.hashPrincipal(x) }
    );

    public shared func addUser(userId: Principal, profile: UserProfile) : async Result<(), Text> {
        let newUser = User { userId = userId; profile = profile };
        users.put(userId, newUser);
        return #ok(());
    };

 

    // Update user profile function (support dynamic updates)
    public shared func updateUserProfile(userId: Principal, updatedProfile: UserProfile) : async Result<(), Text> {
    switch (users.get(userId)) {
        case (?user) {
            let updatedUser = User {
                userId = user.userId;
                profile = updatedProfile;
            };
            users.put(userId, updatedUser);
            return #ok(());  // Ensure return of #ok when the user is updated
        };
        case null {
            return #err("User not found");  // Ensure return of #err when user is not found
        };
    }
};

   // Function to display badges
public shared func showBadges(userId: Principal) : async Result<[Text], Text> {
    switch (users.get(userId)) {
        case (?user) { 
            return #ok(user.profile.badges);  // Return badges wrapped in Result
        };
        case null { 
            return #err("User not found");  // Return error if user is not found
        };
    }
};

    
// Function to display certifications
public shared func showCertifications(userId: Principal) : async Result<[Text], Text> {
    switch (users.get(userId)) {
        case (?user) {
            return #ok(user.profile.certifications); // Return certifications wrapped in Result
        };
        case null { 
            return #err("User not found"); // Return error if user is not found
        };
    }
};

// Function to create mentorship match
public shared func createMentorshipMatch(mentorId: Principal, menteeId: Principal) : async Result<(), Text> {
    switch (users.get(mentorId)) {
        case (?mentor) {
            switch (users.get(menteeId)) {
                case (?mentee) {
                    let matchScore = calculateMatchScore(mentor.profile, mentee.profile);
                    let newMatch = MentorshipMatch {
                        mentorId = mentorId;
                        menteeId = menteeId;
                        matchScore = matchScore;
                    };

                    switch (mentorMatches.get(mentorId)) {
                        case (?matches) {
                            let updatedMatches = Array.append(matches, [newMatch]);
                            mentorMatches.put(mentorId, updatedMatches);
                            return #ok(()); // Successfully added match
                        };
                        case null {
                            mentorMatches.put(mentorId, [newMatch]);
                            return #ok(()); // Successfully added match as first match for mentor
                        }
                    }
                };
                case null { 
                    return #err("Mentee not found"); // Mentee does not exist
                }
            }
        };
        case null { 
            return #err("Mentor not found"); // Mentor does not exist
        }
    }
};

    // Function to calculate the match score dynamically based on various factors
    private func calculateMatchScore(mentor: UserProfile, mentee: UserProfile) : Float {
        var matchScore: Float = 0.0;

        // Match based on mentorship style
        matchScore += mentorshipStyleMatch(mentor.preferredMentorshipStyle, mentee.preferredMentorshipStyle);

        // Match based on expertise (overlapping expertise areas)
        matchScore += expertiseMatch(mentor.expertise, mentee.expertise);

        // Match based on activity level (higher is better)
        matchScore += activityLevelMatch(mentor.activityLevel, mentee.activityLevel);

        // Match based on experience (years of experience)
        matchScore += experienceMatch(mentor.experienceYears, mentee.experienceYears);

        return matchScore;
    };

    // Mentorship style match calculation
    private func mentorshipStyleMatch(mentorStyle: MentorshipStyle, menteeStyle: MentorshipStyle) : Float {
        switch (mentorStyle, menteeStyle) {
            case (#HandsOn, #HandsOn) { return 25.0 };
            case (#Guided, #Guided) { return 20.0 };
            case (#Strategic, #Strategic) { return 15.0 };
            case (#Technical, #Technical) { return 25.0 };
            case (#Other, #Other) { return 15.0 };
            case (_, _) { return 5.0 };
        }
    };

    // Expertise match calculation
    private func expertiseMatch(mentorExpertise: [Text], menteeExpertise: [Text]) : Float {
        let commonExpertise = Array.filter(mentorExpertise, func (expertise) {
            Array.contains(menteeExpertise, expertise)
        });
        return Float(Array.size(commonExpertise)) * 10.0; // Each common expertise adds 10 points
    };

    // Activity level match calculation
    private func activityLevelMatch(mentorActivity: Float, menteeActivity: Float) : Float {
        return 100.0 - (abs(mentorActivity - menteeActivity) * 100.0); // Closer activity levels increase match score
    };

    // Experience match calculation
    private func experienceMatch(mentorExperience: Float, menteeExperience: Float) : Float {
        return 100.0 - (abs(mentorExperience - menteeExperience) * 5.0); // Smaller difference increases match score
    };
// Recommendation System: Recommends mentors, courses, or activities
public shared func recommend(userId: Principal) : async Result<Text, Text> {
    switch (users.get(userId)) {
        case (?user) {
            // Example of recommending based on expertise
            let recommendedMentors = recommendMentors(user.profile.expertise);
            let recommendedCourses = recommendCourses(user.profile.skills);
            let recommendedActivities = recommendActivities(user.profile.learningPreferences);

            // Combine recommendations and return as a result
            let recommendations = "Recommended Mentors: " # Text.join(recommendedMentors, ", ") # "\n" #
                                  "Recommended Courses: " # Text.join(recommendedCourses, ", ") # "\n" #
                                  "Recommended Activities: " # Text.join(recommendedActivities, ", ");
            return #ok(recommendations); // Return wrapped in #ok to fit Result<Text, Text>

        };
        case null {
            return #err("User not found"); // Return error wrapped in #err
        }
    }
};

    // Example function to recommend mentors based on expertise
    private func recommendMentors(expertise: [Text]) : [Text] {
        // In a real scenario, this could be dynamic, querying other users or a database.
        return Array.map(expertise, func (e) { "Mentor in " # e });
    };

    // Example function to recommend courses based on skills
    private func recommendCourses(skills: [Text]) : [Text] {
        return Array.map(skills, func (s) { "Course for " # s });
    };

    // Example function to recommend activities based on learning preferences
    private func recommendActivities(learningPreferences: [Text]) : [Text] {
        return Array.map(learningPreferences, func (lp) { "Activity for " # lp });
    };
}