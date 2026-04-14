import express from "express";
import {
    getMessages,
    sendMessage,
    getRecentChats,
} from "../controllers/chat.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/recent", protect, getRecentChats);
router.get("/:userId", protect, getMessages);
router.post("/:userId", protect, sendMessage);

export default router;
