import axios from "axios";
import Book from "../models/book.model.js";
import Review from "../models/review.model.js";

// @desc    Search books via Google Books API
// @route   GET /api/books/search
export const searchBooks = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ message: "Search query is required" });
    }

    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY || "";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20${API_KEY ? `&key=${API_KEY}` : ""}`;

    const fetchWithRetry = async (attempts = 3) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            if (attempts <= 1) throw error;
            // Simple exponential backoff
            const delay = (4 - attempts) * 1000;
            console.warn(`Google Books API call failed. Retrying in ${delay}ms... (${attempts - 1} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(attempts - 1);
        }
    };

    try {
        const data = await fetchWithRetry();
        const books = data.items?.map((item) => ({
            googleBooksId: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            description: item.volumeInfo.description || "",
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
            pageCount: item.volumeInfo.pageCount,
            categories: item.volumeInfo.categories || [],
        })) || [];

        res.json(books);
    } catch (error) {
        console.error("Google Books API Error:", error.response?.data?.error?.message || error.message);
        
        const status = error.response?.status || 500;
        const errorMessage = status === 429 
            ? "Google Books API daily quota reached. Please add an API key for more requests." 
            : "Error fetching data from Google Books. Please try again later.";
            
        res.status(status).json({ message: errorMessage });
    }
};

// @desc    Get or Create book in local DB and return reviews
// @route   POST /api/books/details
export const getBookDetails = async (req, res) => {
    const { googleBooksId, title, authors, description, thumbnail, pageCount, categories } = req.body;

    try {
        let book = await Book.findOne({ googleBooksId });

        if (!book) {
            book = await Book.create({
                googleBooksId,
                title,
                authors,
                description,
                thumbnail,
                pageCount,
                categories,
            });
        }

        const reviews = await Review.find({ book: book._id }).populate("user", "name avatar");

        res.json({ book, reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review for a book
// @route   POST /api/books/:id/reviews
export const addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const bookId = req.params.id;

    try {
        const review = await Review.create({
            user: req.user._id, // assuming protect middleware is used
            book: bookId,
            rating,
            comment,
        });

        const populatedReview = await Review.findById(review._id).populate("user", "name avatar");

        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get top rated books
// @route   GET /api/books/top
export const getTopBooks = async (req, res) => {
    try {
        const books = await Book.find({ totalReviews: { $gt: 0 } })
            .sort({ averageRating: -1 })
            .limit(10);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
