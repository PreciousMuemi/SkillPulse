// Course.mo - Course management canister for SkillNet

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Types "types";

actor Course {
    type Course = Types.Course;

    private stable var nextCourseId : Nat = 0;
    private var courses : HashMap.HashMap<Nat, Course> = HashMap.HashMap(0, Nat.equal, Nat.hash);

    // Create a new course
    public func createCourse(title : Text, description : Text, instructor : Text, duration : Nat, category : Text, skillLevel : Text, price : Nat) : async Nat {
        let courseId = nextCourseId;
        let newCourse : Course = {
            id = courseId;
            title = title;
            description = description;
            instructor = instructor;
            duration = duration;
            category = category;
            skillLevel = skillLevel;
            price = price;
            enrolledStudents = [];
            rating = 0.0;
            createdAt = Time.now();
        };
        courses.put(courseId, newCourse);
        nextCourseId += 1;
        courseId
    };

    // Get course by ID
    public query func getCourse(courseId : Nat) : async ?Course {
        courses.get(courseId)
    };

    // Enroll a student in a course
    public func enrollStudent(courseId : Nat, studentId : Nat) : async Bool {
        switch (courses.get(courseId)) {
            case (null) { false };
            case (?course) {
                let updatedEnrolledStudents = Array.append(course.enrolledStudents, [studentId]);
                let updatedCourse : Course = {
                    id = course.id;
                    title = course.title;
                    description = course.description;
                    instructor = course.instructor;
                    duration = course.duration;
                    category = course.category;
                    skillLevel = course.skillLevel;
                    price = course.price;
                    enrolledStudents = updatedEnrolledStudents;
                    rating = course.rating;
                    createdAt = course.createdAt;
                };
                courses.put(courseId, updatedCourse);
                true
            };
        }
    };

    // Update course rating
    public func updateCourseRating(courseId : Nat, newRating : Float) : async Bool {
        switch (courses.get(courseId)) {
            case (null) { false };
            case (?course) {
                let updatedCourse : Course = {
                    id = course.id;
                    title = course.title;
                    description = course.description;
                    instructor = course.instructor;
                    duration = course.duration;
                    category = course.category;
                    skillLevel = course.skillLevel;
                    price = course.price;
                    enrolledStudents = course.enrolledStudents;
                    rating = (course.rating + newRating) / 2.0; // Simple average rating
                    createdAt = course.createdAt;
                };
                courses.put(courseId, updatedCourse);
                true
            };
        }
    };

    // Get all courses
    public query func getAllCourses() : async [Course] {
        Array.tabulate<Course>(courses.size(), func (i : Nat) : Course {
            switch (courses.get(i)) {
                case (null) { 
                    {
                        id = 0;
                        title = "";
                        description = "";
                        instructor = "";
                        duration = 0;
                        category = "";
                        skillLevel = "";
                        price = 0;
                        enrolledStudents = [];
                        rating = 0.0;
                        createdAt = Time.now();
                    }
                };
                case (?course) { course };
            }
        })
    };
}