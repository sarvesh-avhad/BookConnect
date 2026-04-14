import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// update averageRating and totalReviews on Book model after saving review
reviewSchema.post("save", async function () {
    const Book = mongoose.model("Book");
    const reviews = await this.constructor.find({ book: this.book });
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews;

    await Book.findByIdAndUpdate(this.book, {
        averageRating: averageRating.toFixed(1),
        totalReviews,
    });
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
