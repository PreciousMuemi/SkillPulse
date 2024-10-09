// Mentor.mo - Mentor management canister for SkillNet

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Types "types";

actor Mentor {
    type Mentor = Types.Mentor;
    type Review = Types.Review;

    private stable var nextMentorId : Nat = 0;
    private stable var nextReviewId : Nat = 0;
    private var mentors : HashMap.HashMap<Nat, Mentor> = HashMap.HashMap(0, Nat.equal, Nat.hash);

    // Apply to become a mentor
    public func applyForMentorship(userId : Nat, expertise : [Text], experience : Nat, availableHours : Nat) : async Nat {
        let mentorId = nextMentorId;
        let newMentor : Mentor = {
            id = mentorId;
            userId = userId;
            expertise = expertise;
            experience = experience;
            availableHours = availableHours;
            rating = 0.0;
            reviews = [];
            approvalStatus = false;
            createdAt = Time.now();
        };
        mentors.put(mentorId, newMentor);
        nextMentorId += 1;
        mentorId
    };

    // Get mentor by ID
    public query func getMentor(mentorId : Nat) : async ?Mentor {
        mentors.get(mentorId)
    };

    // Approve a mentor application
    public func approveMentor(mentorId : Nat) : async Bool {
        switch (mentors.get(mentorId)) {
            case (null) { false };
            case (?mentor) {
                let updatedMentor : Mentor = {
                    id = mentor.id;
                    userId = mentor.userId;
                    expertise = mentor.expertise;
                    experience = mentor.experience;
                    availableHours = mentor.availableHours;
                    rating = mentor.rating;
                    reviews = mentor.reviews;
                    approvalStatus = true;
                    createdAt = mentor.createdAt;
                };
                mentors.put(mentorId, updatedMentor);
                true
            };
        }
    };

    // Add a review for a mentor
    public func addReview(mentorId : Nat, reviewerId : Nat, rating : Nat, comment : Text) : async Bool {
        switch (mentors.get(mentorId)) {
            case (null) { false };
            case (?mentor) {
                let newReview : Review = {
                    id = nextReviewId;
                    reviewerId = reviewerId;
                    rating = rating;
                    comment = comment;
                    createdAt = Time.now();
                };
                nextReviewId += 1;

                let updatedReviews = Array.append(mentor.reviews, [newReview]);
                let newAverageRating = calculateAverageRating(updatedReviews);

                let updatedMentor : Mentor = {
                    id = mentor.id;
                    userId = mentor.userId;
                    expertise = mentor.expertise;
                    experience = mentor.experience;
                    available
                }
            }
        }
            }
        }