import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
// import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
// import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

module {
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

    public class LearningManager() {
        private let courses = HashMap.HashMap<Text, Course>(0, Text.equal, Text.hash);
        private let projects = HashMap.HashMap<Text, Project>(0, Text.equal, Text.hash);
        private let userCourses = HashMap.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);

        public func createCourse(
            courseId: Text, 
            title: Text, 
            description: Text, 
            difficulty: Text, 
            tokenReward: Nat, 
            nftReward: Text, 
            modules: [Text]
        ) : async Result.Result<Text, Text> {
            let newCourse : Course = {
                courseId;
                title;
                description;
                difficulty;
                tokenReward;
                nftReward;
                modules;
            };
            courses.put(courseId, newCourse);
            #ok("Course created successfully")
        };

        public func enrollInCourse(
            userId: Principal, 
            courseId: Text
        ) : async Result.Result<Text, Text> {
            switch (courses.get(courseId)) {
                case (?_course) {
                    let currentEnrolled = switch (userCourses.get(userId)) {
                        case (?enrolled) { enrolled };
                        case null { [] };
                    };
                    userCourses.put(userId, Array.append(currentEnrolled, [courseId]));
                    #ok("Successfully enrolled in course")
                };
                case null { #err("Course not found") };
            }
        };

        public func submitProject(
            courseId: Text, 
            projectId: Text, 
            userId: Principal
        ) : async Result.Result<Text, Text> {
            let newProject : Project = {
                projectId;
                courseId;
                userId;
                feedback = null;
                rating = null;
            };
            projects.put(projectId, newProject);
            #ok("Project submitted successfully")
        };

        public func addProjectFeedback(
            projectId: Text, 
            feedback: Text, 
            rating: Nat
        ) : async Result.Result<Text, Text> {
            switch (projects.get(projectId)) {
                case (?project) {
                    let updatedProject = {
                        project with 
                        feedback = ?feedback;
                        rating = ?rating
                    };
                    projects.put(projectId, updatedProject);
                    #ok("Feedback added successfully")
                };
                case null { #err("Project not found") };
            }
        };

        public func completeModule(
            _courseId: Text, 
            _moduleId: Text, 
            _userId: Principal
        ) : async Result.Result<Text, Text> {
            #ok("Module completed successfully")
        };

        public func getCourseEntries() : Iter.Iter<(Text, Course)> {
            courses.entries()
        };

        public func getProjectEntries() : Iter.Iter<(Text, Project)> {
            projects.entries()
        };

        public func restoreCourses(entries: [(Text, Course)]) {
            for ((id, course) in entries.vals()) {
                courses.put(id, course);
            }
        };

        public func restoreProjects(entries: [(Text, Project)]) {
            for ((id, project) in entries.vals()) {
                projects.put(id, project);
            }
        }
    }
}