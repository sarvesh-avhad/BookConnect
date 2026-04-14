import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    proposedDuration: {
      type: String,
    },
    requestNote: {
      type: String,
    },
    requesterConfirmed: {
      type: Boolean,
      default: false,
    },
    ownerConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Exchange = mongoose.model("Exchange", exchangeSchema);
export default Exchange;
