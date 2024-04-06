import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
    createOrder,
    cancelOrder,
    getOrderDetails,
} from "../controllers/orderController.js";

const router = express.Router();

// Protected routes with authentication middleware
router.post("/create", authMiddleware, createOrder);
router.put("/cancel/:orderId", authMiddleware, cancelOrder);
router.get("/:orderId", authMiddleware, getOrderDetails);

export default router;