import express from 'express';
import { verifyToken } from "./auth/authentication.mjs"
import { login, register, getProfile, updateProfile } from "./controllers/userController.mjs"
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "./controllers/productController.mjs";
import { createOrder, updateOrder } from "./controllers/orderController.mjs"
import { getCart, addToCart, updateCart, deleteCart } from "./controllers/cartController.mjs";

const router = express.Router();

// User Routes
router.post('/login', login);
router.post('/register', register);
router.get('/user/:userId/profile', verifyToken, getProfile);
router.put('/user/:userId/profile', verifyToken, updateProfile);

// Product Routes
router.post("/products", createProduct);
router.get("/products", getProducts);
router.get("/products/:productId", getProductById);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);

// Order Routes
router.post("/users/:userId/orders", createOrder)
router.put("/users/:userId/orders", updateOrder)

// Cart Routes
router.get('/users/:userId/cart', verifyToken, getCart);
router.post('/users/:userId/cart', verifyToken, addToCart);
router.put('/users/:userId/cart', verifyToken, updateCart);
router.delete('/users/:userId/cart', verifyToken, deleteCart);

export default router;