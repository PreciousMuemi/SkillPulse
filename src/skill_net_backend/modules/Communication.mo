import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
// import Array "mo:base/Array";
import Result "mo:base/Result";
// import Buffer "mo:base/Buffer";
// import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

module {
    public type MessageType = {
        #DirectMessage;
        #MentorshipInquiry;
        #ProjectCollaboration;
        #CourseDiscussion;
        #NetworkRequest;
    };

    public type CommunicationStatus = {
        #Unread;
        #Read;
        #Responded;
        #Archived;
    };

    public type Message = {
        id: Text;
        senderId: Principal;
        receiverId: Principal;
        content: Text;
        timestamp: Time.Time;
        messageType: MessageType;
        status: CommunicationStatus;
        relatedEntityId: ?Text; // Optional ID for course, project, etc.
    };

    public type Notification = {
        id: Text;
        userId: Principal;
        content: Text;
        timestamp: Time.Time;
        notificationType: NotificationType;
        read: Bool;
    };

    public type NotificationType = {
        #MessageReceived;
        #MentorshipMatch;
        #ProjectInvite;
        #AchievementUnlocked;
        #SkillEndorsement;
    };

    public class CommunicationManager() {
        private let messages = HashMap.HashMap<Text, Message>(0, Text.equal, Text.hash);
        private let notifications = HashMap.HashMap<Text, Notification>(0, Text.equal, Text.hash);

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
        ) : Result.Result<Text, Text> {
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

        public func getUnreadMessages(userId: Principal) : [Message] {
            Iter.toArray(
                Iter.filter(
                    messages.vals(), 
                    func(message: Message) : Bool { 
                        message.receiverId == userId and message.status == #Unread 
                    }
                )
            )
        };

        public func getNotifications(userId: Principal) : [Notification] {
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
            let _ = createNotification(
                suggestedMentorId, 
                "Potential mentorship match with " # debug_show(menteeId), 
                #MentorshipMatch
            );

            // sendMessage(
            //     menteeId, 
            //     suggestedMentorId, 
            //     "Mentorship Request: " # reason, 
            //     #MentorshipInquiry,
            //     ?matchId
            // )
        };
    }
}