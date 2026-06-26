import { Router } from "express";
import {
  getAllSalons,
  updateSalonStatus,
  getPlatformStats,
} from "../controllers/admin.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, restrictTo("super_admin"));

router.get("/salons", getAllSalons);
router.patch("/salons/:id/status", updateSalonStatus);
router.get("/stats", getPlatformStats);

export default router;