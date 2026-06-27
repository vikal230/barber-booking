import { Router } from "express";
import {
  getPlans,
  createSubscriptionOrder,
  verifySubscription,
  updateChairs,
} from "../controllers/subscription.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

const router = Router();

router.use(protect, tenantMiddleware, restrictTo("salon_owner"));

router.get("/plans", getPlans);
router.post("/create-order", createSubscriptionOrder);
router.post("/verify", verifySubscription);
router.patch("/chairs", updateChairs);

export default router;