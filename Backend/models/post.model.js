import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    exchangeAvailable: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      default: "All",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    condition: {
      type: String,
      default: "Good",
    },
    maxDuration: {
      type: String,
      default: "2 weeks",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
