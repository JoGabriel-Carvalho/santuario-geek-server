import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
    fetchProducts,
    fetchProductById,
    fetchProductsByName,
    fetchProductsByTags,
    addProduct,
    updateProductById,
    deleteProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", fetchProducts);
router.get("/:productId", fetchProductById);
router.get("/search/:searchTerm", fetchProductsByName);
router.get("/category/:tagName", fetchProductsByTags);

// Protected routes with authentication middleware
router.post("/add", authMiddleware, addProduct);
router.put("/update/:productId", authMiddleware, updateProductById);
router.delete("/delete/:productId", authMiddleware, deleteProductById);

export default router;