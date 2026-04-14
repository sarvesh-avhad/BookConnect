import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

// GET public profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("followers", "name avatar")
            .populate("following", "name avatar");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get user's posts
        const posts = await Post.find({ user: user._id })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        res.json({ user, posts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// FOLLOW user
export const followUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already following to avoid duplicate notifications
        const isAlreadyFollowing = currentUser.following.some(id => id.toString() === targetUserId);

        if (isAlreadyFollowing) {
            return res.status(400).json({ message: "Already following this user" });
        }

        // Update target user's followers
        await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });

        // Update current user's following
        await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });

        // Create notification
        await Notification.create({
            recipient: targetUserId,
            sender: currentUserId,
            type: "follow",
        });

        res.json({ message: "Followed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UNFOLLOW user
export const unfollowUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        const userToUnfollow = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove from target user's followers
        await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });

        // Remove from current user's following
        await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });

        res.json({ message: "Unfollowed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET recommended users (users you don't follow)
export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find users who are NOT the current user AND NOT in the current user's following list
        const recommended = await User.find({
            _id: { $ne: currentUserId, $nin: currentUser.following },
        })
            .select("name avatar bio")
            .limit(5);

        res.json(recommended);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
