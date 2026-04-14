import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  googleAuth,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.put("/profile", protect, updateProfile);
router.get("/profile", protect, getProfile);

export default router;
