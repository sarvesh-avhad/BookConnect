import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// @desc    Get messages between two users
export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Send a message (Only if mutual follow)
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.params;
        const { text } = req.body;
        const currentUserId = req.user._id;

        if (!text) {
            return res.status(400).json({ message: "Message text is required" });
        }

        // Check mutual follow
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(userId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.some(id => id.toString() === userId);
        const isFollowedBack = targetUser.following.some(id => id.toString() === currentUserId.toString());

        if (!isFollowing || !isFollowedBack) {
            return res.status(403).json({
                message: "You can only message users who follow you back (Mutual Connection required)"
            });
        }

        const message = await Message.create({
            sender: currentUserId,
            recipient: userId,
            text,
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get list of users with whom current user has chat history
export const getRecentChats = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find all messages where user is sender or recipient
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { recipient: currentUserId }],
        })
            .sort({ createdAt: -1 })
            .populate("sender", "name avatar")
            .populate("recipient", "name avatar");

        // Extract unique users
        const usersMap = new Map();

        messages.forEach((msg) => {
            const otherUser = msg.sender._id.toString() === currentUserId.toString()
                ? msg.recipient
                : msg.sender;

            if (!usersMap.has(otherUser._id.toString())) {
                usersMap.set(otherUser._id.toString(), {
                    user: otherUser,
                    lastMessage: msg.text,
                    time: msg.createdAt,
                });
            }
        });

        res.json(Array.from(usersMap.values()));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
