import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

actor{
// Community Types
    type Post = {
        postId: Text;
        author: Principal;
        title: Text;
        content: Text;
        comments: [Comment];
        timestamp: Int;
    };

    type Comment = {
        commentId: Text;
        author: Principal;
        content: Text;
        timestamp: Int;
    };
    // Storage for community posts
    private var posts = HashMap.HashMap<Text, Post>(0, Text.equal, Text.hash);
    private var postList : [Text] = [];

    // Community Management

    public shared(msg) func createPost(title: Text, content: Text) : async Result.Result<Text, Text> {
        let postId = Text.concat("post-", Nat.toText(posts.size()));
        let newPost : Post = {
            postId;
            author = msg.caller;
            title;
            content;
            comments = [];
            timestamp = Time.now();
        };
        posts.put(postId, newPost);
        postList := Array.append(postList, [postId]);
        #ok("Post created successfully")
    };

    public shared(msg) func addComment(postId: Text, content: Text) : async Result.Result<Text, Text> {
        switch (posts.get(postId)) {
            case (?post) {
                let commentId = Text.concat("comment-", Nat.toText(post.comments.size()));
                let newComment : Comment = {
                    commentId;
                    author = msg.caller;
                    content;
                    timestamp = Time.now();
                };
                let updatedPost = { post with comments = Array.append(post.comments, [newComment]) };
                posts.put(postId, updatedPost);
                #ok("Comment added successfully")
            };
            case null { #err("Post not found") };
        };
    };

    public query func getPosts() : async [Post] {
        Array.map<Text, Post>(postList, func(postId: Text) : Post { 
            Option.unwrap(posts.get(postId))
        });
    };
}