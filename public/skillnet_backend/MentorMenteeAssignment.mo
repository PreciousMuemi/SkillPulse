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

}
