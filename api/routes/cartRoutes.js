import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
    addItemToCart,
    removeItemFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

// Protected routes with authentication middleware
router.post("/add", authMiddleware, addItemToCart);
router.delete("/remove/:productId", authMiddleware, removeItemFromCart);

export default router;