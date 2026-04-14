import express from "express";
import {
  createPost,
  getPosts,
  toggleLike,
  getMyPosts,
  deletePost,
  toggleSavePost,
  getSavedPosts,
  getFollowingPosts,
} from "../controllers/post.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Static paths must come BEFORE parametric /:id routes
router.get("/", protect, getPosts);
router.post("/", protect, createPost);
router.get("/my-posts", protect, getMyPosts);
router.get("/saved", protect, getSavedPosts);
router.get("/following", protect, getFollowingPosts);

// Parametric routes
router.put("/:id/like", protect, toggleLike);
router.put("/:id/save", protect, toggleSavePost);
router.delete("/:id", protect, deletePost);

export default router;
