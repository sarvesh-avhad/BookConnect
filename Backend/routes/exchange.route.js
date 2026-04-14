import express from "express";
import protect from "../middleware/auth.middleware.js";

// import controller functions
import {
  createExchange,
  getIncomingExchanges,
  getOutgoingExchanges,
  getCompletedExchanges,
  acceptExchange,
  rejectExchange,
  confirmExchange,
  getAvailableExchanges,
  getMyLendings,
} from "../controllers/exchange.controller.js";

const router = express.Router();

router.post("/request", protect, createExchange);
router.get("/incoming", protect, getIncomingExchanges);
router.get("/outgoing", protect, getOutgoingExchanges);
router.get("/available", protect, getAvailableExchanges);
router.get("/my-lendings", protect, getMyLendings);
router.get("/completed", protect, getCompletedExchanges);

router.put("/:id/accept", protect, acceptExchange);
router.put("/:id/reject", protect, rejectExchange);
router.post("/:id/confirm", protect, confirmExchange);

export default router;
