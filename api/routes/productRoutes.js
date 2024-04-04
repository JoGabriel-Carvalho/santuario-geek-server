import express from "express";
import {
    fetchProducts,
    fetchProductById,
    fetchProductsByName,
    fetchProductsByCategory,
    addProduct,
    updateProductById,
    deleteProductById
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", fetchProducts);
router.get("/products/:productId", fetchProductById);
router.get("/products/search/:searchTerm", fetchProductsByName);
router.get("/products/category/:categoryName", fetchProductsByCategory);
router.post("/products", addProduct);
router.put("/products/:productId", updateProductById);
router.delete("/products/:productId", deleteProductById);

export default router;