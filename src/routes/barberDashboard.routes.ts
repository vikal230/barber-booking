import { Router } from "express";
import {
  getMySchedule,
  updateAvailability,
} from "../controllers/barberDashboard.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, restrictTo("barber"));

router.get("/schedule", getMySchedule);
router.patch("/availability", updateAvailability);

export default router;