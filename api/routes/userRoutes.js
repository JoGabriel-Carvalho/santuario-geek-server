import express from "express";
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
router.post("/address", addAddress);
router.put("/address/:addressId", updateAddress);
router.delete("/address/:addressId", deleteAddress);

export default router;
