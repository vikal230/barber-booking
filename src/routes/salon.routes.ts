import { Router } from "express";
import { createSalon, getSalon, getSalonStats, getTodayBookings } from "../controllers/salon.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";
import { createSalonValidator } from "../validators/salon.validator.js";
import validate from "../middleware/validate.js";

const router = Router();

router.post("/", protect, restrictTo("salon_owner"), createSalonValidator, validate, createSalon);
router.get("/", protect, tenantMiddleware, getSalon);
router.get("/stats", protect, tenantMiddleware, getSalonStats);
router.get("/today-bookings", protect, tenantMiddleware, getTodayBookings);

export default router;