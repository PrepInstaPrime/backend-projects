import bookModel from "../models/bookModel.mjs";
import userModel from "../models/userModel.mjs";
import reviewModel from "../models/reviewModel.mjs";

const createBook = async (req, res) => {
  try {
    const data = req.body;
    const { userId, releasedAt } = data;
    if (!userId)
      return res
        .status(400)
        .send({ status: false, message: "userId is required" });
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(400).send({ status: false, message: "Invalid userId" });
    if (releasedAt) data.releasedAt = new Date(releasedAt);
    const book = await bookModel.create(data);
    return res.status(201).send({ status: true, data: book });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).send({ status: false, message: err.message });
    if (err.code === 11000)
      return res
        .status(400)
        .send({ status: false, message: "Duplicate key error" });
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

const getBooks = async (req, res) => {
  try {
    const filters = { isDeleted: false };
    const { userId, category, subcategory } = req.query;
    if (userId) filters.userId = userId;
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;

    const books = await bookModel
      .find(filters)
      .select("title excerpt userId category releasedAt reviews")
      .sort({ title: 1 });
    if (!books || books.length === 0)
      return res.status(404).send({ status: false, message: "No books found" });
    return res
      .status(200)
      .send({ status: true, message: "Books list", data: books });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book)
      return res.status(404).send({ status: false, message: "Book not found" });
    const reviewsData = await reviewModel
      .find({ bookId: book._id, isDeleted: false })
      .select("reviewedBy reviewedAt rating review");
    const result = book.toObject();
    result.reviewsData = reviewsData;
    return res
      .status(200)
      .send({ status: true, message: "Book details", data: result });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updates = req.body;
    if (updates.releasedAt) updates.releasedAt = new Date(updates.releasedAt);
    const book = await bookModel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      updates,
      { new: true, runValidators: true },
    );
    if (!book)
      return res.status(404).send({ status: false, message: "Book not found" });
    return res
      .status(200)
      .send({ status: true, message: "Book updated", data: book });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).send({ status: false, message: err.message });
    if (err.code === 11000)
      return res
        .status(400)
        .send({ status: false, message: "Duplicate key error" });
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book)
      return res.status(404).send({ status: false, message: "Book not found" });
    book.isDeleted = true;
    book.deletedAt = new Date();
    await book.save();
    return res
      .status(200)
      .send({ status: true, message: "Book deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export { createBook, getBooks, getBookById, updateBook, deleteBook };
