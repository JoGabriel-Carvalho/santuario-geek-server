import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
    createOrder,
    cancelOrder,
    getOrderDetails,
} from "../controllers/orderController.js";

const router = express.Router();

// Protected routes with authentication middleware
router.post("/order/create", authMiddleware, createOrder);
router.put("/order/cancel/:orderId", authMiddleware, cancelOrder);
router.get("/order/:orderId", authMiddleware, getOrderDetails);

export default router;