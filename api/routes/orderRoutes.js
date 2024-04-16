import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
    createOrderFromCart,

} from "../controllers/orderController.js";

const router = express.Router();

// Protected routes with authentication middleware
router.post("/create", authMiddleware, createOrderFromCart);

export default router;