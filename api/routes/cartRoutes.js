import express from "express";
import {
    addItemToCart,
    removeItemFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/cart/add", addItemToCart);
router.delete("/cart/remove/:productId", removeItemFromCart);

export default router;