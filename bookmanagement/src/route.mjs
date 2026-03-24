import express from 'express';
import { register, login } from './controllers/userController.mjs';
import { verifyToken } from './auth/authentication.mjs';
import { createReview, updateReview, deleteReview } from './controllers/reviewController.mjs'
import { uploadImage } from './controllers/frontendController.mjs';
import * as booksController from './controllers/bookControllers.mjs';
const router = express.Router();

// User routes
router.post('/login', login);
router.post('/register', register);

// Book routes
router.get('/books', verifyToken, booksController.getAll);
router.get('/books/:id', verifyToken, booksController.getById);
router.post('/books', verifyToken, booksController.add);
router.put('/books/:id', verifyToken, booksController.update);
router.delete('/books/:id', verifyToken, booksController.remove);

// Review routes
router.post('/books/:bookId/review', verifyToken, createReview);
router.put('/books/:bookId/review/:reviewId', verifyToken, updateReview);
router.delete('/books/:bookId/review/:reviewId',verifyToken, deleteReview);

// File upload route
router.post("/frontend",verifyToken ,uploadImage)

export default router;
