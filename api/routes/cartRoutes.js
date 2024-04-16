import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
    getUserCart,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

// Protected routes with authentication middleware
router.get("/", authMiddleware, getUserCart);
router.post("/add", authMiddleware, addItemToCart);
router.delete("/remove/:productId", authMiddleware, removeItemFromCart);
router.patch("/update/", authMiddleware, updateCartItemQuantity);

export default router;