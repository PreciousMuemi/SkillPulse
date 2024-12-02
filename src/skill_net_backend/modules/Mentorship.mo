// import HashMap "mo:base/HashMap";
// import Time "mo:base/Time";
// import Principal "mo:base/Principal";
// import Result "mo:base/Result";
// import Array "mo:base/Array";
// import Float "mo:base/Float";
// import Iter "mo:base/Iter";

// module {

//     // Type definitions
//     // type UserProfile = {
//         name: Text;
//         bio: Text;
//         avatar: Text;
//         location: Text;
//         badges: [Text]; // Badges awarded to the user (e.g., "Top Mentor", "Course Completions")
//         certifications: [Text]; // List of certifications (e.g., "React.js Certified", "Blockchain Expert")
//         recommendations: [Text]; // List of recommended resources or mentors
//     };

//     type User = {
//         userId: Principal;
//         skills: [Text];
//         completedCourses: [Text];
//         tokens: Nat;
//         nfts: [Text];
//         mentor: Bool;
//         experience_years: Nat;
//         rating: Float;
//         availability: Text;
//         timezone: Text;
//         profile: UserProfile;
//         verificationStatus: Text;
//         lastActive: Time.Time;
//         achievements: [Text];
//         xp: Nat;
//         skillLevel: Nat;
//         vibeStatus: Text;
//         contentScore: Float;
//         tribe: Text;
//         level: Nat; // Level based on experience and activity
//     };

//     type MentorshipMatch = {
//         mentorId: Principal;
//         menteeId: Principal;
//         matchScore: Float;
//         recommendedInteractionStyle: MentorshipStyle;
//         suggestedTopics: [Text];
//     };

//     type MentorshipStyle =  {
//     #HandsOn;
//     #Guided;
//     #Strategic;
//     #Technical;
//     #Other;
//     };

//     // Initialize users and mentorMatches HashMaps
//      var users = HashMap.HashMap<Principal, User>(1000, 
//         func (x: Principal, y: Principal): Bool { x == y }, 
//         func (x: Principal): HashMap.Hash { HashMap.hashPrincipal(x) }
//     );
//    var mentorMatches = HashMap.HashMap<Principal, [MentorshipMatch]>(1000, 
//         func (x: Principal, y: Principal): Bool { x == y }, 
//         func (x: Principal): HashMap.Hash { HashMap.hashPrincipal(x) }
//     );


//     // public function to update user profile, including badges and certifications
//     public func updateUserProfile(userId: Principal, updatedProfile: UserProfile) : Result.Result<(), Text> {
//         switch (users.get(userId)) {
//             case (?user) {
//                 let updatedUser = User {
//                     userId = user.userId;
//                     skills = user.skills;
//                     completedCourses = user.completedCourses;
//                     tokens = user.tokens;
//                     nfts = user.nfts;
//                     mentor = user.mentor;
//                     experience_years = user.experience_years;
//                     rating = user.rating;
//                     availability = user.availability;
//                     timezone = user.timezone;
//                     profile = updatedProfile;
//                     verificationStatus = user.verificationStatus;
//                     lastActive = Time.now(); // Update last active time
//                     achievements = user.achievements;
//                     xp = user.xp;
//                     skillLevel = user.skillLevel;
//                     vibeStatus = user.vibeStatus;
//                     contentScore = user.contentScore;
//                     tribe = user.tribe;
//                     level = user.level;
//                 };
//                 users.put(userId, updatedUser);
//                 #ok(()); 
//             };
//             case null { #err("User not found") }
//         }
//     };

//     // Function to find the best mentor match for a mentee
//     public func findBestMentorMatch(
//         menteeId: Principal,
//         skillInterests: [Text]
//     ) : Result.Result<MentorshipMatch, Text> {
//         if (Array.size(skillInterests) == 0) {
//             return #err("Skill interests cannot be empty");
//         };

//         let bestMentor = _findMatchingMentor(menteeId, skillInterests);
//         let matchScore = _calculateMentorMatchScore(bestMentor, skillInterests);

//         let match : MentorshipMatch = {
//             mentorId = bestMentor;
//             menteeId = menteeId;
//             matchScore = matchScore;
//             recommendedInteractionStyle = _determineMentorshipStyle(bestMentor, menteeId);
//             suggestedTopics = skillInterests
//         };

//         let currentMatches = switch (mentorMatches.get(menteeId)) {
//             case (?matches) { matches };
//             case null { [] };
//         };
//         mentorMatches.put(menteeId, Array.append(currentMatches, [match]));

//         #ok(match)
//     };

//     // Function to find the best matching mentor based on skill interests
//     private func _findMatchingMentor(menteeId: Principal, skillInterests: [Text]) : Principal {
//         let potentialMentors = Iter.filter(users.entries(), func((id, user): (Principal, User)) : Bool {
//             // Filter out users who are not mentors and don't match skill interests
//             user.mentor and Array.hasAll(user.skills, skillInterests)
//         });

//         // Assuming there is at least one potential mentor, return the first one
//         switch (Iter.next(potentialMentors)) {
//             case (?((mentorId, _))) { mentorId };
//             case null { Principal.fromText("aaaaa-aa") }; // Placeholder if no mentor is found
//         }
//     };

//     // Function to calculate the match score between a mentor and a mentee
//     private func _calculateMentorMatchScore(
//         _mentor: Principal,
//         _interests: [Text]
//     ) : Float {
//         let user = switch (users.get(_mentor)) {
//             case (?user) { user };
//             case null { return 0.0 }; // Return a low score if the mentor doesn't exist
//         };

//         let expertiseMatch = _calculateExpertiseMatch(user.skills, _interests);
//         let activityScore = _calculateActivityScore(user.lastActive);
//         let experienceScore = _calculateExperienceScore(user.experience_years);
        
//         return (expertiseMatch * 0.4) + (activityScore * 0.3) + (experienceScore * 0.3);
//     };

//     // Function to calculate how much mentor's skills match mentee's interests
//     private func _calculateExpertiseMatch(userSkills: [Text], interests: [Text]) : Float {
//         return Float(Array.size(Array.filter(userSkills, func (skill: Text) : Bool {
//             Array.has(interests, skill)
//         })) as Float) / Float(Array.size(userSkills) as Nat);
//     };

//     // Function to calculate the activity score based on last active time
//     private func _calculateActivityScore(lastActive: Time.Time) : Float {
//         let timeSinceLastActive = Time.now() - lastActive;
//         return if (timeSinceLastActive < Time.fromSeconds(86400)) { 1.0 } else { 0.5 }; // High score if active within 24 hours
//     };

//     // Function to calculate the experience score based on years of experience
//     private func _calculateExperienceScore(experienceYears: Nat) : Float {
//         return Float(experienceYears) / 10.0; // Assuming experience max is 10 years for scaling
//     };

//     // Function to determine the mentorship style based on user preferences
//     private func _determineMentorshipStyle(mentor: Principal, mentee: Principal) : MentorshipStyle {
//         let mentorUser = switch (users.get(mentor)) {
//             case (?user) { user };
//             case null { return #Guided }; // Default to Guided if mentor not found
//         };

//         let menteeUser = switch (users.get(mentee)) {
//             case (?user) { user };
//             case null { return #Guided }; // Default to Guided if mentee not found
//         };

//         // Determine style based on mentor's profile and mentee's preferences
//         if (Array.has(mentorUser.skills, "Hands-on")) {
//             return #HandsOn;
//         } else if (Array.has(menteeUser.skills, "Strategic")) {
//             return #Strategic;
//         } else if (Array.has(mentorUser.skills, "Technical")) {
//             return #Technical;
//         } else {
//             return #Guided; // Default to Guided
//         }
//     };

//     // Function to award a badge to a user
//     public func awardBadge(userId: Principal, badge: Text) : Result.Result<(), Text> {
//         switch (users.get(userId)) {
//             case (?user) {
//                 let updatedProfile = UserProfile {
//                     name = user.profile.name;
//                     bio = user.profile.bio;
//                     avatar = user.profile.avatar;
//                     location = user.profile.location;
//                     badges = Array.append(user.profile.badges, [badge]);
//                     certifications = user.profile.certifications;
//                     recommendations = user.profile.recommendations;
//                 };
//                 updateUserProfile(userId, updatedProfile);
//                 #ok(()); 
//             };
//             case null { #err("User not found") }
//         }
//     };

//     // Function to award a certification to a user
//     public func awardCertification(userId: Principal, certification: Text) : Result.Result<(), Text> {
//         switch (users.get(userId)) {
//             case (?user) {
//                 let updatedProfile = UserProfile {
//                     name = user.profile.name;
//                     bio = user.profile.bio;
//                     avatar = user.profile.avatar;
//                     location = user.profile.location;
//                     badges = user.profile.badges;
//                     certifications = Array.append(user.profile.certifications, [certification]);
//                     recommendations = user.profile.recommendations;
//                 };
//                 updateUserProfile(userId, updatedProfile);
//                 #ok(()); 
//             };
//             case null { #err("User not found") }
//         }
//     };
// };
