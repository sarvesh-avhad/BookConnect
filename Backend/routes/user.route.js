import express from "express";
import {
    getUserProfile,
    followUser,
    unfollowUser,
    getRecommendedUsers,
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Publicly available, but needs protect to know which user's profile is being viewed for further interaction.
router.get("/recommended", protect, getRecommendedUsers);
router.get("/:id", protect, getUserProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

export default router;
