import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Order "mo:base/Order";
import Nat32 "mo:base/Nat32";
import Blob "mo:base/Blob";

import Models "./models";


actor MentorshipPlatform {
    // Type aliases for cleaner code
    type User = Models.User;
    type Mentor = Models.Mentor;
    type Course = Models.Course;
    type Project = Models.Project;
    type UserProfile = Models.UserProfile;
    type Mentorprofile = Models.MentorProfile;
    type MentorshipMatch = Models.MentorshipMatch;
    type ServiceError = Models.ServiceError;
    type Result<T, E> = Models.Result<T, E>;
    type Skill = Models.Skill;
    type Message = Models.Message;
    type Notification = Models.Notification;
    type MessageType = Models.MessageType;
    type NotificationType = Models.NotificationType;
    type Tribe = Models.Tribe;
    type Community = Models.Community;
    type ShareEvent = Models.ShareEvent;
    type IPFSContent = Models.IPFSContent;
    type ContentUpload = Models.ContentUpload;
    type FileMetadata = Models.FileMetadata;
    type StudyJam = Models.StudyJam;
    type Post = Models.Post;
    type Achievement = Models.Achievement;
    type Forum = Models.Forum;

    class EnhancedHashMap<K, V>(
        initCapacity : Nat, 
        keyEq : (K, K) -> Bool, 
        keyHash : (K) -> Hash.Hash
    ) {
        let map = HashMap.HashMap<K, V>(
            initCapacity, 
            keyEq, 
            keyHash
        );

        public func put(key : K, value : V) { map.put(key, value); };
        public func get(key : K) : ?V { map.get(key) };
        public func delete(key : K) { map.delete(key) };
        public func keys() : Iter.Iter<K> { map.keys() };
        public func size() : Nat { map.size() };
        public func entries() : Iter.Iter<(K, V)> { map.entries() };
    };

    // Centralized state management
    let users = EnhancedHashMap<Principal, User>(
        100, 
        func(x, y) { x == y }, 
        Principal.hash
    );

    let mentors = EnhancedHashMap<Principal, Mentor>(
        100,
        func(x, y) { x == y },
        Principal.hash
    );

    let mentorMatches = EnhancedHashMap<Principal, [MentorshipMatch]>(
        100, 
        func(x, y) { x == y }, 
        Principal.hash
    );

    // Utility functions
    private func validateProfile(profile : UserProfile) : Result<(), ServiceError> {
        if (Text.size(profile.name) == 0) {
            return #err(#InvalidInput({ message = "Name cannot be empty" }));
        };

        if (Text.size(profile.email) == 0 or not isValidEmail(profile.email)) {
            return #err(#InvalidInput({ message = "Invalid email format" }));
        };

        if (Array.size(profile.skills) == 0) {
            return #err(#InvalidInput({ message = "At least one skill is required" }));
        };

        #ok(());
    };

    private func validateMentorProfile(mentor : Mentorprofile) : Result<(), ServiceError> {
        if (Text.size(mentor.name) == 0) {
            return #err(#InvalidInput({ message = "Name cannot be empty" }));
        };

        if (Text.size(mentor.email) == 0 or not isValidEmail(mentor.email)) {
            return #err(#InvalidInput({ message = "Invalid email format" }));
        };

        if (Array.size(mentor.skills) == 0) {
            return #err(#InvalidInput({ message = "At least one skill is required" }));
        };

        #ok(());
    };

    private func isValidEmail(email : Text) : Bool {
        let parts = Text.split(email, #char('@'));
        let partsArray = Iter.toArray(parts);
        partsArray.size() == 2 and 
        Text.size(partsArray[0]) > 0 and 
        Text.size(partsArray[1]) > 0
    };

    private func removeDuplicateSkills(skills : [Skill]) : [Skill] {
        let buffer = Buffer.Buffer<Skill>(skills.size());
        for (skill in skills.vals()) {
            if (not Buffer.contains<Skill>(buffer, skill, func(x, y) { x.name == y.name })) {
                buffer.add(skill);
            };
        };
        Buffer.toArray(buffer)
    };

    // User Management Functions
    public shared func addUser(profile : UserProfile) : async Result<(), ServiceError> {
        // Validate input
        switch (validateProfile(profile)) {
            case (#err(error)) { return #err(error) };
            case (#ok(_)) {
                // Remove duplicate skills
                let uniqueSkills = removeDuplicateSkills(profile.skills);

                let newUser : User = {
                    userId = profile.id;
                    profile = {
                        profile with 
                        skills = uniqueSkills;
                    };
                    registeredAt = Time.now();
                    lastUpdated = Time.now();
                };

                users.put(profile.id, newUser);
                
                // Logging
                Debug.print("N   " # debug_show(profile.id));

                return #ok(());
            }
        }
    };

    public shared func addMentor(mentor : Mentorprofile) : async Result<(), ServiceError> {
      // Validate input
      switch (validateMentorProfile(mentor)) {
        case (#err(error)) { return #err(error) };
        case (#ok(_)) {
          // Remove duplicate skills
          let uniqueSkills = removeDuplicateSkills(mentor.skills);

          let newMentor : Mentor = {
            userId = mentor.id;
            profile = {
              avatar = mentor.avatar; // Ensure avatar is present in Mentorprofile
              badges = mentor.badges; // Ensure these fields exist in Mentorprofile
              bio = mentor.bio;
              certifications = mentor.certifications;
              email = mentor.email;
              id = mentor.id;
              location = mentor.location;
              mentorType = mentor.mentorType;
              name = mentor.name;
              privacySettings = mentor.privacySettings;
              rating = mentor.rating;
              skills = uniqueSkills; // Use processed unique skills
            };
            registeredAt = Time.now();
            lastUpdated = Time.now();
          };

          mentors.put(mentor.id, newMentor);

          // Logging
          Debug.print("N  " # debug_show(mentor.id));
          return #ok(());
        }
      }
    };

    // Match Score Calculation
    private func calculateMatchScore(
        mentor : UserProfile, 
        mentee : UserProfile
    ) : Models.MatchScore {
        {
            overall = calculateOverallScore(mentor, mentee);
            styleSimilarity = calculateStyleSimilarity(mentor, mentee);
            expertiseSimilarity = calculateExpertiseSimilarity(mentor, mentee);
            activityAlignment = calculateActivityAlignment(mentor, mentee);
            experienceComplementarity = calculateExperienceComplementarity(mentor, mentee);
        }
    };

    // Detailed scoring functions
    private func calculateStyleSimilarity(
        mentor : UserProfile, 
        mentee : UserProfile
    ) : Float {
        switch (mentor.preferredMentorshipStyle, mentee.preferredMentorshipStyle) {
            case (#HandsOn(mentorStyle), #HandsOn(menteeStyle)) {
                switch (mentorStyle, menteeStyle) {
                    case (#PracticalProjects, #PracticalProjects) { 1.0 };
                    case (#CodeReviews, #CodeReviews) { 0.9 };
                    case (#PairProgramming, #PairProgramming) { 0.8 };
                    case (_, _) { 0.5 };
                }
            };
            case (_, _) { 0.3 };
        }
    };

    private func calculateExpertiseSimilarity(
        mentor : UserProfile, 
        mentee : UserProfile
    ) : Float {
        var matchingSkills = 0;
        var totalSkills = mentor.skills.size();

        label outer for (menteeSkill in mentee.skills.vals()) {
            for (mentorSkill in mentor.skills.vals()) {
                if (menteeSkill.name == mentorSkill.name) {
                    matchingSkills += 1;
                    break outer;
                };
            };
        };

        Float.fromInt(matchingSkills) / Float.fromInt(totalSkills)
    };

    private func calculateActivityAlignment(
        mentor : UserProfile, 
        mentee : UserProfile
    ) : Float {
        0.7 // Placeholder, can be refined based on specific activity metrics
    };

    private func calculateExperienceComplementarity(
        mentor : UserProfile, 
        mentee : UserProfile
    ) : Float {
        let experienceDiff = Float.abs(
            mentor.experienceYears - mentee.experienceYears
        );
        
        1.0 / (1.0 + experienceDiff * 0.2)
    };

    private func calculateOverallScore(
        mentor : UserProfile, 
        mentee : UserProfile
    ) : Float {
        let styleFactor = calculateStyleSimilarity(mentor, mentee);
        let expertiseFactor = calculateExpertiseSimilarity(mentor, mentee);
        let activityFactor = calculateActivityAlignment(mentor, mentee);
        let experienceFactor = calculateExperienceComplementarity(mentor, mentee);

        styleFactor * 0.3 + 
        expertiseFactor * 0.25 + 
        activityFactor * 0.2 + 
        experienceFactor * 0.25
    };

    // Mentorship Matching Function
    public shared func createMentorshipMatch(
        mentorId : Principal, 
        menteeId : Principal
    ) : async Result<MentorshipMatch, ServiceError> {
        // Fetch mentor and mentee profiles
        let mentorProfile = switch (users.get(mentorId)) {
            case (null) { 
                return #err(#UserNotFound({ userId = mentorId })) 
            };
            case (?user) { user.profile }
        };

        let menteeProfile = switch (users.get(menteeId)) {
            case (null) { 
                return #err(#UserNotFound({ userId = menteeId })) 
            };
            case (?user) { user.profile }
        };

        // Calculate match score
        let matchScore = calculateMatchScore(mentorProfile, menteeProfile);

        let newMatch : MentorshipMatch = {
            mentorId = mentorId;
            menteeId = menteeId;
            matchScore = matchScore;
            matchedAt = Time.now();
            status = #Pending;
            interactionHistory = [];
        };

        // Update mentor's matches
        switch (mentorMatches.get(mentorId)) {
            case (null) {
                mentorMatches.put(mentorId, [newMatch]);
            };
            case (?existingMatches) {
                let updatedMatches = Array.append(existingMatches, [newMatch]);
                mentorMatches.put(mentorId, updatedMatches);
            }
        };

        // Logging
        Debug.print(
            "Mentorship match created: Mentor " # 
            debug_show(mentorId) # " with Mentee " # 
            debug_show(menteeId) # 
            " (Score: " # debug_show(matchScore.overall) # ")"
        );

        #ok(newMatch)
    };

    // Recommendation System
    public shared query func recommendMentors(
        menteeId : Principal, 
        limit : Nat
    ) : async Result<[Principal], ServiceError> {
        // Fetch mentee profile
        let menteeProfile = switch (users.get(menteeId)) {
            case (null) { 
                return #err(#UserNotFound({ userId = menteeId })) 
            };
            case (?user) { user.profile }
        };

        // Find potential mentors
        let potentialMentors = Array.mapFilter<(Principal, User), Principal>(
            Iter.toArray(users.entries()),
            func((id, user)) {
                // Filter out the mentee from potential mentors
                if (id == menteeId) {
                    null
                } else {
                    // Score the potential mentor match
                    let matchScore = calculateMatchScore(user.profile, menteeProfile);
                    if (matchScore.overall > 0.7) {
                        ?id
                    } else {
                        null
                    }
                }
            }
        );

        // Sort mentors by match score
        let sortedMentors = Array.sort<Principal>(
            potentialMentors, 
            func(a : Principal, b : Principal) : Order.Order {
                let scoreA = switch (users.get(a)) {
                    case (null) { 0.0 };
                    case (?user) { 
                        calculateMatchScore(user.profile, menteeProfile).overall 
                    }
                };
                let scoreB = switch (users.get(b)) {
                    case (null) { 0.0 };
                    case (?user) { 
                        calculateMatchScore(user.profile, menteeProfile).overall 
                    }
                };
                if (scoreA < scoreB) { #less }
                else if (scoreA > scoreB) { #greater }
                else { #equal }
            }
        );

        // Return top limited number of mentors
        #ok(Array.tabulate<Principal>(Nat.min(limit, sortedMentors.size()), func(i) { sortedMentors[i] }))
    };

    private let courses = HashMap.HashMap<Text, Course>(0, Text.equal, Text.hash);
    private let projects = HashMap.HashMap<Text, Project>(0, Text.equal, Text.hash);
    private let userCourses = HashMap.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);

    private let messages = HashMap.HashMap<Text, Message>(0, Text.equal, Text.hash);
    private let notifications = HashMap.HashMap<Text, Notification>(0, Text.equal, Text.hash);
    
    private let tribes = HashMap.HashMap<Text, Tribe>(0, Text.equal, Text.hash);
    private let communities = HashMap.HashMap<Text, Community>(0, Text.equal, Text.hash);
    private let achievementShares = HashMap.HashMap<Text, ShareEvent>(0, Text.equal, Text.hash);
    private let userStreaks = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
    private let ipfsStorage = HashMap.HashMap<Text, IPFSContent>(0, Text.equal, Text.hash);
    private let contentUpload = HashMap.HashMap<Text, ContentUpload>(0, Text.equal, Text.hash);
    private let fileMetadata = HashMap.HashMap<Text, FileMetadata>(0, Text.equal, Text.hash);

    private let studyJams = HashMap.HashMap<Text, StudyJam>(10, Text.equal, Text.hash);
    private let forums = HashMap.HashMap<Text, Forum>(0, Text.equal, Text.hash);

    private stable var idCounter : Nat = 0;

    public shared func createCourse(
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

    public shared func enrollInCourse(
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

    public shared func submitProject(
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

    public shared func addProjectFeedback(
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

    public shared func completeModule(
        _courseId: Text, 
        _moduleId: Text, 
        _userId: Principal
    ) : async Result.Result<Text, Text> {
        #ok("Module completed successfully")
    };

    public shared func getCourseEntries() : async [(Text, Course)] {
        Iter.toArray(courses.entries())
    };

    public shared func getProjectEntries() : async [(Text, Project)] {
        Iter.toArray(projects.entries())
    };

    public shared func restoreCourses(entries: [(Text, Course)]) {
        for ((id, course) in entries.vals()) {
            courses.put(id, course);
        }
    };

    public shared func restoreProjects(entries: [(Text, Project)]) {
        for ((id, project) in entries.vals()) {
            projects.put(id, project);
        }
    };

    public func sendMessage(
        senderId: Principal, 
        receiverId: Principal, 
        content: Text, 
        messageType: MessageType,
        relatedEntityId: ?Text
    ) : async Result.Result<Text, Text> {
        let messageId = debug_show(Time.now());
        let newMessage : Message = {
            id = messageId;
            senderId = senderId;
            receiverId = receiverId;
            content = content;
            timestamp = Time.now();
            messageType = messageType;
            status = #Unread;
            relatedEntityId = relatedEntityId;
        };

        messages.put(messageId, newMessage);
        
        // Automatically create a notification
        let _ = createNotification(
            receiverId, 
            "New message received from " # debug_show(senderId), 
            #MessageReceived
        );

        #ok(messageId)
    };

    public func createNotification(
        userId: Principal, 
        content: Text, 
        notificationType: NotificationType
    ) : async Result.Result<Text, Text> {
        let notificationId = debug_show(Time.now());
        let newNotification : Notification = {
            id = notificationId;
            userId = userId;
            content = content;
            timestamp = Time.now();
            notificationType = notificationType;
            read = false;
        };

        notifications.put(notificationId, newNotification);
        #ok(notificationId)
    };

    public func markMessageAsRead(messageId: Text) : async Result.Result<(), Text> {
        switch (messages.get(messageId)) {
            case (?message) {
                let updatedMessage = {
                    message with 
                    status = #Read
                };
                messages.put(messageId, updatedMessage);
                #ok(())
            };
            case null { #err("Message not found") };
        }
    };

    public func getUnreadMessages(userId: Principal) : async [Message] {
        Iter.toArray(
            Iter.filter(
                messages.vals(), 
                func(message: Message) : Bool { 
                    message.receiverId == userId and message.status == #Unread 
                }
            )
        )
    };

    public func getNotifications(userId: Principal) : async [Notification] {
        Iter.toArray(
            Iter.filter(
                notifications.vals(), 
                func(notification: Notification) : Bool { 
                    notification.userId == userId and not notification.read 
                }
            )
        )
    };

    public func markNotificationAsRead(notificationId: Text) : async Result.Result<(), Text> {
        switch (notifications.get(notificationId)) {
            case (?notification) {
                let updatedNotification = {
                    notification with 
                    read = true
                };
                notifications.put(notificationId, updatedNotification);
                #ok(())
            };
            case null { #err("Notification not found") };
        }
    };

    // Advanced communication features
    public func suggestMentorMatch(
        menteeId: Principal, 
        suggestedMentorId: Principal,
        _reason: Text
    ) : async Result.Result<Text, Text> {
        let _matchId = debug_show(Time.now());
        let notificationResult = await createNotification(
            suggestedMentorId, 
            "Potential mentorship match with " # debug_show(menteeId), 
            #MentorshipMatch
        );
        
        switch (notificationResult) {
            case (#ok(_)) {
                #ok("Mentor match suggested successfully")
            };
            case (#err(e)) {
                #err("Failed to suggest mentor match: " # e)
            };
        }
    };

    public shared(msg) func whoami() : async Principal {
        msg.caller
    };

    public func getUserXP(userId: Principal) : async ?Nat {
        switch (users.get(userId)) {
            case (?user) { ?user.profile.xp };
            case null { null }
        }
    };

    public shared func getUserEntries() : async [(Principal, User)] {
        Iter.toArray(users.entries())
    };

    public func restoreCommunities(entries: [(Text, Community)]) {
        for ((id, community) in entries.vals()) {
            communities.put(id, community);
        }
    };

    public func createTribe(_name: Text, _description: Text, _initialMembers: [Principal]) : async Result.Result<Text, Text> {
        let _tribeId = debug_show(Time.now());
        #ok("Tribe created successfully! ✨")
    };

    public func joinTribe(tribeId: Text, userId: Principal) : async Result.Result<Text, Text> {
        switch (tribes.get(tribeId)) {
            case (?tribe) {
                let updatedMembers = Array.append(tribe.members, [userId]);
                let updatedTribe = {
                    tribe with 
                    members = updatedMembers;
                    lastActive = Time.now();
                };
                tribes.put(tribeId, updatedTribe);
                #ok("Joined tribe successfully! 🌟")
            };
            case null { #err("Tribe not found") };
        }
    };

    public func shareAchievement(_achievementId: Text, _userId: Principal, _message: Text) : async Result.Result<Text, Text> {
        let _shareId = debug_show(Time.now());
        #ok("Achievement shared with your tribe! 🎉")
    };

    public func reactToAchievement(shareId: Text, userId: Principal, reaction: Text) : async Result.Result<Text, Text> {
        switch (achievementShares.get(shareId)) {
            case (?share) {
                let newReaction = {
                    user = userId;
                    reactionType = reaction;
                    timestamp = Time.now();
                };
                let updatedShare = {
                    share with
                    reactions = Array.append(share.reactions, [newReaction]);
                };
                achievementShares.put(shareId, updatedShare);
                #ok("Reaction added! ⭐")
            };
            case null { #err("Share not found") };
        }
    };

    public func createCommunity(name: Text, description: Text, focus: [Text], userId: Principal) : async Result.Result<Text, Text> {
        let communityId = debug_show(Time.now());
        let newCommunity = {
            id = communityId;
            name = name;
            description = description;
            focus = focus;
            members = [userId];
            content = [];
            metrics = {
                totalMembers = 1;
                activeMembers = 1;
                contentCount = 0;
                engagementRate = 0.0;
                totalActions = 0;
                lastUpdated = Time.now();
            };
            mentorSessions = [];
            approvedMembers = [userId];
            createdAt = Time.now();
        };
        communities.put(communityId, newCommunity);
        #ok("Community created! 🌈")
    };

    private func generateUniqueId() : Text {
        idCounter += 1;
        Nat.toText(idCounter)
    };

    public shared func createStudyJam(name: Text, description: Text, date: Text): async Bool {
        let id = generateUniqueId(); // Assuming this returns Nat
        let newStudyJam : StudyJam = {
            id = id;
            name = name;
            description = description;
            date = date;
            participants = [];
        };
        studyJams.put(id, newStudyJam);
        true
    };

    public shared func joinStudyJam(userId: Principal, jamId: Text): async Bool {
        switch (studyJams.get(jamId)) {
            case (?jam) {
                var updatedParticipants = jam.participants;
                switch (Array.find<Principal>(updatedParticipants, func(p) = Principal.equal(p, userId))) {
                    case (null) {
                        updatedParticipants := Array.append<Principal>(updatedParticipants, [userId]);
                        let updatedJam = {
                            id = jam.id;
                            name = jam.name;
                            description = jam.description;
                            date = jam.date;
                            participants = updatedParticipants;
                        };
                        studyJams.put(jamId, updatedJam);
                        true
                    };
                    case (?_) { false };
                };
            };
            case null { false };
        };
    };

    public shared func getAllStudyJams(): async [StudyJam] {
        Iter.toArray(studyJams.vals())
    };

    public shared func createForum(name: Text, description: Text): async Bool {
        let id = generateUniqueId();
        let newForum = {
            id;
            name;
            description;
            posts = [];
        };
        forums.put(id, newForum);
        true
    };

    public shared func postMessage(forumId: Text, userId: Principal, message: Text): async Bool {
        switch (forums.get(forumId)) {
            case (?forum) {
                let postNumber = Nat.toText(forum.posts.size());
                let newPost : Post = {
                    id = Text.concat(forumId, Text.concat("-post-", postNumber)); // Correct concatenation
                    author = userId;
                    content = message;
                    title = ""; // You might want to add a title parameter to your function
                    timestamp = Time.now();
                };
                let updatedPosts = Array.append<Post>(forum.posts, [newPost]);
                let updatedForum : Forum = {
                    id = forum.id;
                    name = forum.name;
                    description = forum.description;
                    posts = updatedPosts;
                };
                forums.put(forumId, updatedForum);
                true
            };
            case null { false };
        };
    };

    public shared func getForumPosts(forumId: Text): async [Post] {
        switch (forums.get(forumId)) {
            case (?forum) { forum.posts };
            case null { [] };
        }
    };

    private func calculateVibeLevel(xp: Nat) : Text {
        if (xp >= 1000) { "Radiant" }
        else if (xp >= 500) { "Flowing" }
        else { "Rising" }
    };

    private func trackUserStreak(userId: Principal) : async Result.Result<Nat, Text> {
        let currentStreak = switch (userStreaks.get(userId)) {
            case (?streak) { streak + 1 };
            case null { 1 };
        };
        userStreaks.put(userId, currentStreak);
        #ok(currentStreak)
    };

    public func calculateStreakBonus(streakDays: Nat) : async Nat {
        streakDays * 10
    };

    public func uploadContent(userId: Principal, content: ContentUpload) : async Result.Result<Text, Text> {
        let uploadId = debug_show(Time.now());
        contentUpload.put(uploadId, content);
        let tokenAward = calculateSKNTokenAward(content.quality);
        updateUserTokens(userId, tokenAward);
        let _ = await checkAndUnlockAchievements(userId, content);
        #ok("Content uploaded successfully! Earned " # debug_show(tokenAward) # " SKN tokens 🎉")
    };


    private let achievementTemplates = [
        {
            id = "first_upload";
            name = "Content Pioneer";
            xpRequired = 10;
            tokenReward = 50;
        },
        {
            id = "quality_creator";
            name = "Quality Maven";
            xpRequired = 100;
            tokenReward = 200;
        },
        {
            id = "community_pillar";
            name = "Community Pillar";
            xpRequired = 500;
            tokenReward = 1000;
        }
    ];

    public func checkAndUnlockAchievements(userId: Principal, _content: ContentUpload) : async [Achievement] {
        let unlockedAchievements = Buffer.Buffer<Achievement>(0);
        let userXP = getUserXP(userId);

        for (template in achievementTemplates.vals()) {
            // if (userXP >= template.xpRequired) {
            unlockedAchievements.add({
                id = template.id;
                name = template.name;
                description = "Achievement unlocked!";
                icon = "🏆";
                xpThreshold = template.xpRequired;
                tokenReward = template.tokenReward;
                badgeType = "Standard";
                nftReward = null;
                unlocked = true;
                unlockedTimestamp = ?Time.now();
                roleUpgrade = null;
            });
        };

        Buffer.toArray(unlockedAchievements)
    };

    private func calculateSKNTokenAward(quality: Nat) : Nat {
        let baseAward = 10;
        let qualityMultiplier = quality / 20;
        baseAward * qualityMultiplier
    };

private func updateUserTokens(userId: Principal, amount: Nat) {
    switch (users.get(userId)) {
        case (?user) {
            let updatedProfile = {
                user.profile with
                tokens = (user.profile.token_balance + amount) : Nat;
            };
            let updatedUser = {
                userId = user.userId;
                profile = updatedProfile;
                registeredAt = user.registeredAt;
                lastUpdated = Time.now();
            };
            users.put(userId, updatedUser);
        };
        case null {};
    };
};

    public func uploadToIPFS(content: Blob, metadata: FileMetadata) : async Result.Result<IPFSContent, Text> {
      let cid = generateIPFSHash(content);
      
      let ipfsContent : IPFSContent = {
          cid = cid;
          size = Nat32.toNat(Blob.hash(content));
          mimeType = metadata.fileType;
          timestamp = Time.now();
      };

      ipfsStorage.put(cid, ipfsContent);

      let updatedMetadata = {
          metadata with
          ipfsHash = ?cid;
      };
      
      fileMetadata.put(metadata.id, updatedMetadata);
      #ok(ipfsContent)
    };


    public func getIPFSContent(cid: Text) : async ?IPFSContent {
        ipfsStorage.get(cid)
    };

    private func generateIPFSHash(content: Blob) : Text {
        let hashValue = Nat32.toNat(Blob.hash(content));
        "ipfs://" # Nat.toText(hashValue)
    };

}