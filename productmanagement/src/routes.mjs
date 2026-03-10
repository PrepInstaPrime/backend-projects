import express from "express";
import upload from "./config/multer.mjs";
import {createProduct,getProducts,getProductById,updateProduct,deleteProduct,} from "./controllers/productController.mjs";
import {createOrder,updateOrder} from "./controllers/orderController.mjs"
const router = express.Router();
router.post("/products", upload.single("productImage"), createProduct);
router.get("/products", getProducts);
router.get("/products/:productId", getProductById);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);
router.post("/users/:userId/orders", createOrder)
router.put("/users/:userId/orders", updateOrder)
export default router;
