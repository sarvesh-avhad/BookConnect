import express from "express";
import {
    searchBooks,
    getBookDetails,
    addReview,
    getTopBooks,
} from "../controllers/book.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", searchBooks);
router.post("/details", getBookDetails);
router.get("/top", getTopBooks);
router.post("/:id/reviews", protect, addReview);

export default router;
