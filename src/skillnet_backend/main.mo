import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

actor SkillNet {
    // Type definitions inside actor
    type User = {
        username: Text;
        skills: [Text];
        completedCourses: [Text];
        tokens: Nat;
        nfts: [Text];
        mentor: Bool;
        experience_years: Nat;
        rating: Float;
        availability: [Text];
        timezone: Text;
    };

    type MentorMatch = {
        mentor_id: Text;
        similarity: Float;
        experience_years: Nat;
        rating: Float;
        availability: [Text];
        timezone: Text;
        match_score: Float;
        skill_overlap: [Text];
    };

    type MatchMetrics = {
        total_matches: Nat;
        success_rate: Float;
        average_rating: Float;
        last_updated: Time.Time;
    };

    type Community = {
        communityId: Text;
        name: Text;
        description: Text;
        members: [Principal];
        courses: [Text];
        mentorSessions: [Text];
        approvedMembers: [Principal];
    };

    type Course = {
        courseId: Text;
        title: Text;
        description: Text;
        difficulty: Text;
        tokenReward: Nat;
        nftReward: Text;
        modules: [Text];
    };

    type Project = {
        projectId: Text;
        courseId: Text;
        userId: Principal;
        feedback: ?Text;
        rating: ?Nat;
    };

    // Storage declarations
    private var users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
    private var communities = HashMap.HashMap<Text, Community>(0, Text.equal, Text.hash);
    private var courses = HashMap.HashMap<Text, Course>(0, Text.equal, Text.hash);
    private var projects = HashMap.HashMap<Text, Project>(0, Text.equal, Text.hash);
    private let rateLimit = HashMap.HashMap<Text, Time.Time>(100, Text.equal, Text.hash);
    private var matchMetrics = HashMap.HashMap<Text, MatchMetrics>(0, Text.equal, Text.hash);

    // Stable storage
    private stable var usersEntries : [(Principal, User)] = [];
    private stable var communitiesEntries : [(Text, Community)] = [];
    private stable var coursesEntries : [(Text, Course)] = [];
    private stable var projectsEntries : [(Text, Project)] = [];
    private stable var matchMetricsEntries : [(Text, MatchMetrics)] = [];

    // Your existing functions here...
    
    // System upgrades
    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
        communitiesEntries := Iter.toArray(communities.entries());
        coursesEntries := Iter.toArray(courses.entries());
        projectsEntries := Iter.toArray(projects.entries());
        matchMetricsEntries := Iter.toArray(matchMetrics.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter<Principal, User>(usersEntries.vals(), 1, Principal.equal, Principal.hash);
        communities := HashMap.fromIter<Text, Community>(communitiesEntries.vals(), 1, Text.equal, Text.hash);
        courses := HashMap.fromIter<Text, Course>(coursesEntries.vals(), 1, Text.equal, Text.hash);
        projects := HashMap.fromIter<Text, Project>(projectsEntries.vals(), 1, Text.equal, Text.hash);
        matchMetrics := HashMap.fromIter<Text, MatchMetrics>(matchMetricsEntries.vals(), 1, Text.equal, Text.hash);
    };
}
