import express from 'express';
import { register, login } from './controllers/userController.mjs';
import { verifyToken } from './auth/authentication.mjs';
import { createReview, updateReview, deleteReview } from './controllers/reviewController.mjs'
import { uploadImage } from './controllers/frontendController.mjs';

const router = express.Router();

// User routes
router.post('/login', login);
router.post('/register', register);

// Book routes


// Review routes
router.post('/books/:bookId/review',createReview);
router.put('/books/:bookId/review/:reviewId', updateReview);
router.delete('/books/:bookId/review/:reviewId', deleteReview);

// Image upload route
router.post("/frontend", uploadImage)

export default router;