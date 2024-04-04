import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
    fetchProducts,
    fetchProductById,
    fetchProductsByName,
    fetchProductsByCategory,
    addProduct,
    updateProductById,
    deleteProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/products", fetchProducts);
router.get("/products/:productId", fetchProductById);
router.get("/products/search/:searchTerm", fetchProductsByName);
router.get("/products/category/:categoryName", fetchProductsByCategory);

// Protected routes with authentication middleware
router.post("/product/add", authMiddleware, addProduct);
router.put("/product/update/:productId", authMiddleware, updateProductById);
router.delete("/product/delete/:productId", authMiddleware, deleteProductById);

export default router;