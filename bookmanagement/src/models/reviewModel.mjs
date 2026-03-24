import mongoose from "mongoose";
const reviewSchema=new mongoose.Schema({
    bookId:{
        type: mongoose.Types.ObjectId,
        ref: "books",
        required: [true, "bookId is required"]
    },
    reviewedBy: {
        type: String,
        required: [true, "reviewed By is required"],
        default: "Guest"
    },
    reviewedAt: {
        type: Date,
        required: [true, "Reviewed At is required"]
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5
    },
    review: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const reviewModel= mongoose.model('reviews', reviewSchema);
export default reviewModel;