import Post from "../models/Post.js";

import User from "../models/User.js";

const getPost = async (req , res) => {
  try {
    const { postId } = req.params ;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({msg : "post doesn't exist"});
    return res.status(200).json({msg : "found post successfully" , post});
  }
  catch (err){
    return res.status(500).json({msg : "internal server error"});
  }
}

const createPost = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const post = await Post.create({
      username: req.user.username,
      title,
      content,
      isPublic: isPublic ?? true,
      createdAt: new Date(),
      likes: [],
      comments: []
    });
    return res.status(201).json({ msg: "Post added successfully", post });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, isPublic } = req.body;

    
    

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post doesn't exist" });

    if (post.username.toLowerCase() !== req.user.username.toLowerCase()) {
     return res.status(403).json({ msg: "You can only edit your own posts" });
    }

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.isPublic = isPublic ?? post.isPublic;

    const updatedPost = await post.save();

    

    return res.status(200).json({ msg: "Successfully updated post", post: updatedPost });
  } catch (err) {
    console.error("Update API error:", err.response?.data || err.message);
    return res.status(500).json({ error: err.message });
  }
};




const updateLikes = async (req, res) => {
  try {
    const { postId, likedByUser } = req.params;
    
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    const alreadyLiked = post.likes.some(u => u.username === likedByUser);
    if (alreadyLiked){
      post.likes = post.likes.filter(u => u.username !== likedByUser);
      await post.save();
      return res.status(200).json({ msg: "Like removed successfully" , post });
    }
        

      
   else {
      post.likes.push({ username: likedByUser });
      await post.save();
      return res.status(201).json({ msg: "Like registered successfully"  , post});
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentContent, commentUser } = req.body;

    if (!commentContent)
      return res.status(400).json({ msg: "Comment content is required" });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            username: commentUser,
            comment: commentContent,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedPost)
      return res.status(404).json({ msg: "Post not found" });

    return res
      .status(200)
      .json({ msg: "Successfully added comment", post: updatedPost });
  } catch (err) {
    console.error("Error adding comment:", err);
    return res.status(500).json({ error: err.message });
  }
};


const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (comment.username !== req.user.username) return res.status(403).json({ msg: "You can only delete your own comment" });
    comment.deleteOne();
    await post.save();
    return res.status(200).json({ msg: "Comment deleted successfully", post });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.username !== req.user.username) return res.status(403).json({ msg: "You can only delete your own post" });
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ msg: "Post deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const changestatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.username !== req.user.username) return res.status(403).json({ msg: "You can only toggle your own post" });
    post.isPublic = !post.isPublic;
    await post.save();
    return res.status(200).json({ msg: "Toggle successful", post });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const posts = await Post.find({ username }).sort({ createdAt: -1 });
    return res.status(200).json({posts});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getFeed = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = await User.findOne({ username });
    if (!currentUser)
      return res.status(404).json({ msg: "User not found" });

    
    const followingUsernames = currentUser.following.map(f => f.username);

    const feed = await Post.find({
      username: { $in: followingUsernames },
      isPublic: true,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({ feed });
  } catch (err) {
    console.error("Feed error:", err);
    return res.status(500).json({ error: "Failed to fetch feed" });
  }
};


export { getPost , createPost, updateLikes, addComment, deleteComment, deletePost, changestatus, getPosts , updatePost , getFeed};
