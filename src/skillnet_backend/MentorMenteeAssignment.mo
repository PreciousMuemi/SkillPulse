import Nat "mo:base/Nat";
import UserProfileModule "UserProfile"; 


actor MentorMenteeAssignment {

    // Retrieve 
    public shared query func listAvailableMentors() : async [UserProfileModule.UserProfile] {
        let allProfiles = await UserProfileModule.listAllProfiles();
        let availableMentors = Array.filter<UserProfileModule.UserProfile>(allProfiles, func (profile) : Bool {
            profile.role == "mentor" and profile.availability == true
        });
        return availableMentors;
    };

    // pick a mentor by their ID
    public func pickMentor(menteeId: Nat, mentorId: Nat) : async Bool {
        let menteeOpt = await UserProfileModule.getUserProfile(menteeId);
        let mentorOpt = await UserProfileModule.getUserProfile(mentorId);

        // exists
        switch (menteeOpt, mentorOpt) {
            case (?mentee, ?mentor) {
                if (mentor.role == "mentor" and mentor.availability == true) {
                    let updated = await UserProfileModule.updateUserProfile(mentor.id, null, null, null, null, null, null, ?false);
                    return updated;
                } else {
                    return false;  
                }
            };
            case _ {
                return false; 
            };
        }
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

}
