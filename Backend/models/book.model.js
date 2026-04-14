import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        googleBooksId: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        authors: [
            {
                type: String,
            },
        ],
        description: String,
        thumbnail: String,
        averageRating: {
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        pageCount: Number,
        categories: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
