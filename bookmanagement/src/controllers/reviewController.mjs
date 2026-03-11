import bookModel from "../models/bookModel.mjs";
import reviewModel from "../models/reviewModel.mjs";

const createReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { reviewedBy = "Guest", rating, review } = req.body;
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book)
      return res.status(404).send({ status: false, message: "Book not found" });
    if (rating === undefined)
      return res
        .status(400)
        .send({ status: false, message: "Rating is required" });
    const reviewedAt = new Date();
    const newReview = await reviewModel.create({
      bookId,
      reviewedBy,
      rating,
      review,
      reviewedAt,
    });
    book.reviews = (book.reviews || 0) + 1;
    await book.save();
    const reviewsData = await reviewModel
      .findOne({ _id: newReview._id })
      .select("reviewedBy reviewedAt rating review isDeleted");
    const result = book.toObject();
    result.reviewsData = reviewsData;
    return res
      .status(201)
      .send({
        status: true,
        message: "Review added successfully",
        data: result,
      });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).send({ status: false, message: err.message });
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const updates = req.body;
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book)
      return res.status(404).send({ status: false, message: "Book not found" });
    const review = await reviewModel.findOneAndUpdate(
      { _id: reviewId, bookId, isDeleted: false },
      updates,
      { new: true, runValidators: true },
    );
    if (!review)
      return res
        .status(404)
        .send({ status: false, message: "Review not found" });
    const reviewsData = await reviewModel
      .find({ bookId, isDeleted: false })
      .select("reviewedBy reviewedAt rating review");
    const result = book.toObject();
    result.reviewsData = reviewsData;
    return res
      .status(200)
      .send({ status: true, message: "Review updated", data: result });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).send({ status: false, message: err.message });
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book)
      return res.status(404).send({ status: false, message: "Book not found" });
    const review = await reviewModel.findOne({
      _id: reviewId,
      bookId,
      isDeleted: false,
    });
    if (!review)
      return res
        .status(404)
        .send({ status: false, message: "Review not found" });
    review.isDeleted = true;
    await review.save();
    book.reviews = Math.max(0, (book.reviews || 1) - 1);
    await book.save();
    return res
      .status(200)
      .send({ status: true, message: "Review deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export { createReview, updateReview, deleteReview };
