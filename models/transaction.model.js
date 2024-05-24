import mongoose from "mongoose";

const Transaction = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    category: {
      type: String,
      enum: ["saving", "expenses", "investment"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: "Unknown"
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", Transaction);
