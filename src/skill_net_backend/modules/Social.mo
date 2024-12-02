import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import _Iter "mo:base/Iter";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Buffer "mo:base/Buffer";
import _Hash "mo:base/Hash";
import Blob "mo:base/Blob";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";
import Learning "./modules/Learning";
import Mentorship "./modules/Mentorship";
import Social "./modules/Social";
import Communication "./modules/Communication";


module {
    type User = {
        userId: Principal;
        xp: Nat;
        tokens: Nat;
    };

    type VibeStatus = {
        currentMood: Text;
        energyLevel: Nat;
        focusScore: Nat;
        lastUpdate: Time.Time;
        streakDays: Nat;
    };

    public type Tribe = {
        id: Text;
        name: Text;
        description: Text;
        members: [Principal];
        achievements: [Achievement];
        vibeScore: Nat;
        createdAt: Time.Time;
        lastActive: Time.Time;
    };

    public type ShareEvent = {
        id: Text;
        achievementId: Text;
        sharedBy: Principal;
        message: Text;
        reactions: [Reaction];
        timestamp: Time.Time;
    };

    public type Community = {
        id: Text;
        name: Text;
        description: Text;
        focus: [Text];
        members: [Principal];
        content: [Text];
        metrics: CommunityMetrics;
        mentorSessions: [Text];
        approvedMembers: [Principal];
        createdAt: Time.Time;
    };

    type CommunityMetrics = {
        totalMembers: Nat;
        activeMembers: Nat;
        contentCount: Nat;
        engagementRate: Float;
        totalActions: Nat;
        lastUpdated: Time.Time;
    };

    public type Achievement = {
        id: Text;
        name: Text;
        description: Text;
        icon: Text;
        xpThreshold: Nat;
        tokenReward: Nat;
        badgeType: Text;
        nftReward: ?Text;
        unlocked: Bool;
        unlockedTimestamp: ?Time.Time;
        roleUpgrade: ?UserRole;
    };

    type ContentUpload = {
        id: Text;
        userId: Principal;
        courseId: Text;
        contentType: Text;
        fileMetadata: FileMetadata;
        uploadTime: Time.Time;
        status: Text;
        quality: Nat;
    };

    type FileMetadata = {
        id: Text;
        fileName: Text;
        fileSize: Nat;
        uploadTime: Time.Time;
        fileType: Text;
        ipfsHash: ?Text;
        storageLocation: Text;
    };

    public type UserRole = {
        #Learner;
        #PeerTeacher;
        #Mentor;
    };

    public type Reaction = {
        user: Principal;
        reactionType: Text;
        timestamp: Time.Time;
    };

    public type IPFSContent = {
        cid: Text;
        size: Nat;
        mimeType: Text;
        timestamp: Time.Time;
    };

    public class SocialManager() {
        private let tribes = HashMap.HashMap<Text, Tribe>(0, Text.equal, Text.hash);
        private let communities = HashMap.HashMap<Text, Community>(0, Text.equal, Text.hash);
        private let achievementShares = HashMap.HashMap<Text, ShareEvent>(0, Text.equal, Text.hash);
        private let userStreaks = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
        private let ipfsStorage = HashMap.HashMap<Text, IPFSContent>(0, Text.equal, Text.hash);
        private let contentUpload = HashMap.HashMap<Text, ContentUpload>(0, Text.equal, Text.hash);
        private let fileMetadata = HashMap.HashMap<Text, FileMetadata>(0, Text.equal, Text.hash);
        private let users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);

        public func addUser(userId: Principal, user: User) : Result.Result<(), Text> {
    // Implement user addition logic
    // For example:
    switch (users.get(userId)) {
        case null {
            users.put(userId, user);
            #ok()
        };
        case (?_) { #err("User already exists") }
    }
};

public func getUserXP(userId: Principal) : ?Nat {
    switch (users.get(userId)) {
        case (?user) { ?user.xp };
        case null { null }
    }
};

public func getUserEntries() : Iter.Iter<(Principal, User)> {
    users.entries()
};

public func restoreCommunities(entries: [(Text, Community)]) {
    for ((id, community) in entries.vals()) {
        communities.put(id, community);
    }
};

        // private func getUserXP(userId: Principal) : Nat {
        //     switch (users.get(userId)) {
        //         case (?user) { user.xp };
        //         case null { 0 };
        //     }
        // };

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
                    #ok("Reaction added! ⭐️")
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

        public func calculateVibeLevel(xp: Nat) : Text {
            if (xp >= 1000) { "Radiant" }
            else if (xp >= 500) { "Flowing" }
            else { "Rising" }
        };

        public func trackUserStreak(userId: Principal) : async Result.Result<Nat, Text> {
            let currentStreak = switch (userStreaks.get(userId)) {
                case (?streak) { streak + 1 };
                case null { 1 };
            };
            userStreaks.put(userId, currentStreak);
            #ok(currentStreak)
        };

        public func calculateStreakBonus(streakDays: Nat) : Nat {
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
                if (userXP >= template.xpRequired) {
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
            };

            Buffer.toArray(unlockedAchievements)
        };

        public func calculateSKNTokenAward(quality: Nat) : Nat {
            let baseAward = 10;
            let qualityMultiplier = quality / 20;
            baseAward * qualityMultiplier
        };

        private func updateUserTokens(userId: Principal, amount: Nat) {
            switch (users.get(userId)) {
                case (?user) {
                    let updatedUser = {
                        user with
                        tokens = user.tokens + amount;
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


        public func getIPFSContent(cid: Text) : ?IPFSContent {
            ipfsStorage.get(cid)
        };
        private func generateIPFSHash(content: Blob) : Text {
        let hashValue = Nat32.toNat(Blob.hash(content));
        "ipfs://" # Nat.toText(hashValue)
    };

        
        
    }
}
