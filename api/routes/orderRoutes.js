import express from "express";
import {
    createOrder,
    cancelOrder,
    getOrderDetails
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders/create", createOrder);
router.put("/orders/cancel/:orderId", cancelOrder);
router.get("/orders/:orderId", getOrderDetails);

export default router;