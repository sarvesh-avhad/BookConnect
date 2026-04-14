import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Exchange from "../models/exchange.model.js";

const LEVELS = [
    { name: "Beginner Reader", minPoints: 0 },
    { name: "Active Reader", minPoints: 51 },
    { name: "Book Enthusiast", minPoints: 151 },
    { name: "Elite Bibliophile", minPoints: 301 },
];

const BADGES = [
    { name: "First Exchange 📘", type: "exchange", threshold: 1 },
    { name: "5 Exchanges 🔁", type: "exchange", threshold: 5 },
    { name: "10 Posts 📝", type: "post", threshold: 10 },
    { name: "Trusted Trader ⭐", type: "trusted", threshold: 1 }, // Custom logic if needed
];

export const calculateLevel = (points) => {
    let currentLevel = LEVELS[0].name;
    for (const level of LEVELS) {
        if (points >= level.minPoints) {
            currentLevel = level.name;
        }
    }
    return currentLevel;
};

export const awardPoints = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        user.points += amount;
        user.level = calculateLevel(user.points);

        // Check for badges
        await checkAndAwardBadges(user);

        await user.save();
        return user;
    } catch (err) {
        console.error("Error awarding points:", err);
    }
};

const checkAndAwardBadges = async (user) => {
    const currentBadgeNames = user.badges.map((b) => b.name);

    // Post count check
    const postCount = await Post.countDocuments({ user: user._id });
    if (postCount >= 10 && !currentBadgeNames.includes("10 Posts 📝")) {
        user.badges.push({ name: "10 Posts 📝", icon: "📝" });
    }

    // Exchange count check
    const exchangeCount = await Exchange.countDocuments({
        $or: [{ requester: user._id }, { owner: user._id }],
        status: "completed",
    });

    if (exchangeCount >= 1 && !currentBadgeNames.includes("First Exchange 📘")) {
        user.badges.push({ name: "First Exchange 📘", icon: "📘" });
    }
    if (exchangeCount >= 5 && !currentBadgeNames.includes("5 Exchanges 🔁")) {
        user.badges.push({ name: "5 Exchanges 🔁", icon: "🔁" });
    }

    // Trusted Trader logic (e.g., 5 successful unique exchanges)
    if (exchangeCount >= 10 && !currentBadgeNames.includes("Trusted Trader ⭐")) {
        user.badges.push({ name: "Trusted Trader ⭐", icon: "⭐" });
    }
};
