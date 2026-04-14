import Notification from "../models/notification.model.js";

// GET all notifications for logged-in user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user._id,
        })
            .populate("sender", "name avatar")
            .populate("post", "image caption")
            .sort({ createdAt: -1 })
            .limit(30);

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// MARK ALL as read
export const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { $set: { read: true } }
        );

        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
