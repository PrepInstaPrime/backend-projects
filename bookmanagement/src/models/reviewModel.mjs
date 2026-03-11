import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "BookId is required"],
      ref: "Book",
    },

    reviewedBy: {
      type: String,
      required: true,
      default: "Guest",
      trim: true,
    },

    reviewedAt: {
      type: Date,
      required: [true, "Review date is required"],
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },

    review: {
      type: String,
      trim: true,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
