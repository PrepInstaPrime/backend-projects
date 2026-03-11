import express from "express";
const router = express.Router();
import { registerUser, getUser } from "./controllers/userController.mjs";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "./controllers/bookController.mjs";
import {
  createReview,
  updateReview,
  deleteReview,
} from "./controllers/reviewController.mjs";
import { authenticateToken } from "./middlewares/auth.mjs";

router.get("/", (req, res) => {
  res.send("Book Management");
});

// User routes
router.post("/register", registerUser);
router.get("/user/:id", getUser);

// Book routes (protected)
router.post("/books", authenticateToken, createBook);
router.get("/books", authenticateToken, getBooks);
router.get("/books/:bookId", authenticateToken, getBookById);
router.put("/books/:bookId", authenticateToken, updateBook);
router.delete("/books/:bookId", authenticateToken, deleteBook);

// Review routes (protected)
router.post("/books/:bookId/review", authenticateToken, createReview);
router.put("/books/:bookId/review/:reviewId", authenticateToken, updateReview);
router.delete(
  "/books/:bookId/review/:reviewId",
  authenticateToken,
  deleteReview,
);

export default router;
