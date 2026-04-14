import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { awardPoints } from "../utils/gamification.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { caption, image, exchangeAvailable, category, bookId, condition, maxDuration } = req.body;

    if (!caption) {
      return res.status(400).json({
        message: "Caption is required",
      });
    }

    const post = await Post.create({
      user: req.user.id,
      caption,
      image: image || "", // image can be empty if it's a book post
      exchangeAvailable: exchangeAvailable || false,
      category: category || "All",
      book: bookId || null,
      condition: condition || "Good",
      maxDuration: maxDuration || "2 weeks",
    });

    // Award 5 points for new post
    await awardPoints(req.user.id, 5);

    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET ALL POSTS (with comment count)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ book: null })
      .populate("user", "name avatar")
      .populate("book")
      .sort({ createdAt: -1 });

    // Attach comment counts
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const postsWithCounts = posts.map((post) => ({
      ...post.toObject(),
      commentCount: countMap[post._id.toString()] || 0,
    }));

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// TOGGLE LIKE
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const userId = req.user.id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);

      // Create like notification (skip self-like)
      if (post.user.toString() !== userId) {
        await Notification.create({
          recipient: post.user,
          sender: userId,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();

    res.json({
      likes: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET MY POSTS
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate("user", "name avatar")
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// TOGGLE SAVE (Bookmark)
export const toggleSavePost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.id;

    const alreadySaved = user.savedPosts.some(
      (id) => id.toString() === postId
    );

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId
      );
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();

    res.json({ saved: !alreadySaved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET SAVED POSTS
export const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedPosts",
      populate: { path: "user", select: "name avatar" },
    });

    res.json(user.savedPosts || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET FOLLOWING POSTS
export const getFollowingPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const followingIds = user.following;

    const posts = await Post.find({ user: { $in: followingIds }, book: null })
      .populate("user", "name avatar")
      .populate("book")
      .sort({ createdAt: -1 });

    // Populate comment counts
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const postsWithCounts = posts.map((post) => ({
      ...post.toObject(),
      commentCount: countMap[post._id.toString()] || 0,
    }));

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
