import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
    signin,
    signup,
    addAddress,
    updateAddress,
    deleteAddress
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);

// Protected routes with authentication middleware
router.post("/address", authMiddleware, addAddress);
router.put("/address/:addressId", authMiddleware, updateAddress);
router.delete("/address/:addressId", authMiddleware, deleteAddress);

export default router;