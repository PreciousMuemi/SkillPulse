import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";

actor SkillNet {
    // Type definitions
    type User = {
        username: Text;
        skills: [Text];
        completedCourses: [Text];
        tokens: Nat;
        nfts: [Text];
        mentor: Bool;
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

    type Community = {
        communityId: Text;
        name: Text;
        description: Text;
        members: [Principal];
        courses: [Text];
        mentorSessions: [Text];
        approvedMembers: [Principal];
    };

    // Storage
    private var users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
    private var courses = HashMap.HashMap<Text, Course>(0, Text.equal, Text.hash);
    private var projects = HashMap.HashMap<Text, Project>(0, Text.equal, Text.hash);
    private var communities = HashMap.HashMap<Text, Community>(0, Text.equal, Text.hash);

    // Add stable storage
    private stable var usersEntries : [(Principal, User)] = [];
    private stable var coursesEntries : [(Text, Course)] = [];
    private stable var projectsEntries : [(Text, Project)] = [];
    private stable var communitiesEntries : [(Text, Community)] = [];

    // Initialize HashMaps from stable storage
    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
        coursesEntries := Iter.toArray(courses.entries());
        projectsEntries := Iter.toArray(projects.entries());
        communitiesEntries := Iter.toArray(communities.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter<Principal, User>(usersEntries.vals(), 1, Principal.equal, Principal.hash);
        courses := HashMap.fromIter<Text, Course>(coursesEntries.vals(), 1, Text.equal, Text.hash);
        projects := HashMap.fromIter<Text, Project>(projectsEntries.vals(), 1, Text.equal, Text.hash);
        communities := HashMap.fromIter<Text, Community>(communitiesEntries.vals(), 1, Text.equal, Text.hash);
    };

    // Helper functions
    private func getUserOrFail(userId: Principal) : Result.Result<User, Text> {
        switch (users.get(userId)) {
            case (?user) { #ok(user) };
            case null { #err("User not found") };
        };
    };

    private func getCommunityOrFail(communityId: Text) : Result.Result<Community, Text> {
        switch (communities.get(communityId)) {
            case (?community) { #ok(community) };
            case null { #err("Community not found") };
        };
    };

    // Fix Array.remove usage in acceptInvitation
    private func removeFromArray(arr: [Principal], element: Principal) : [Principal] {
        let buffer = Buffer.Buffer<Principal>(arr.size());
        for (item in arr.vals()) {
            if (item != element) {
                buffer.add(item);
            };
        };
        Buffer.toArray(buffer);
    };

    // Community Management
    public shared(msg) func createCommunity(communityId: Text, name: Text, description: Text) : async Result.Result<Text, Text> {
        switch (communities.get(communityId)) {
            case (?_) { #err("Community already exists") };
            case null {
                let newCommunity : Community = {
                    communityId = communityId;
                    name = name;
                    description = description;
                    members = [];
                    courses = [];
                    mentorSessions = [];
                    approvedMembers = [];
                };
                communities.put(communityId, newCommunity);
                #ok("Community created successfully")
            };
        };
    };

    public shared(msg) func inviteMember(communityId: Text, memberId: Principal) : async Result.Result<Text, Text> {
        switch (getCommunityOrFail(communityId), getUserOrFail(memberId)) {
            case (#ok(community), #ok(_)) {
                let updatedCommunity : Community = {
                    communityId = community.communityId;
                    name = community.name;
                    description = community.description;
                    members = Array.append(community.members, [memberId]);
                    courses = community.courses;
                    mentorSessions = community.mentorSessions;
                    approvedMembers = community.approvedMembers;
                };
                communities.put(communityId, updatedCommunity);
                #ok("Member invited successfully")
            };
            case (#err(e), _) { #err(e) };
            case (_, #err(e)) { #err(e) };
        };
    };

    public shared(msg) func acceptInvitation(communityId: Text) : async Result.Result<Text, Text> {
        switch (getCommunityOrFail(communityId), getUserOrFail(msg.caller)) {
            case (#ok(community), #ok(user)) {
                if (Array.find<Principal>(community.members, func(p) { p == msg.caller }) != null) {
                    let updatedCommunity : Community = {
                        communityId = community.communityId;
                        name = community.name;
                        description = community.description;
                        members = removeFromArray(community.members, msg.caller);
                        courses = community.courses;
                        mentorSessions = community.mentorSessions;
                        approvedMembers = Array.append(community.approvedMembers, [msg.caller]);
                    };
                    communities.put(communityId, updatedCommunity);
                    #ok("Invitation accepted successfully")
                } else {
                    #err("User not invited to this community")
                };
            };
            case (#err(e), _) { #err(e) };
            case (_, #err(e)) { #err(e) };
        };
    };

    public shared(msg) func scheduleMentorSession(communityId: Text, sessionId: Text) : async Result.Result<Text, Text> {
        switch (getCommunityOrFail(communityId)) {
            case (#ok(community)) {
                let updatedCommunity : Community = {
                    communityId = community.communityId;
                    name = community.name;
                    description = community.description;
                    members = community.members;
                    courses = community.courses;
                    mentorSessions = Array.append(community.mentorSessions, [sessionId]);
                    approvedMembers = community.approvedMembers;
                };
                communities.put(communityId, updatedCommunity);
                #ok("Mentor session scheduled successfully")
            };
            case (#err(e)) { #err(e) };
        };
    };

    public shared(msg) func getCommunityMembers(communityId: Text) : async Result.Result<[Principal], Text> {
        switch (getCommunityOrFail(communityId)) {
            case (#ok(community)) { #ok(community.approvedMembers) };
            case (#err(e)) { #err(e) };
        };
    };

    // (Other existing functions from your previous code...)
}