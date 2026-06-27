import { Router } from "express";
import { createOrder, verifyPayment, refundPayment } from "../controllers/payment.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create-order", protect, restrictTo("customer"), createOrder);
router.post("/verify", protect, restrictTo("customer"), verifyPayment);
router.post("/refund", protect, restrictTo("salon_owner"), refundPayment);

export default router;