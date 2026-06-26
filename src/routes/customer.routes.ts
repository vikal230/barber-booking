import { Router } from "express";
import { exploreSalons, getSalonDetails } from "../controllers/customer.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, restrictTo("customer"));

router.get("/explore", exploreSalons);
router.get("/salon/:subdomain", getSalonDetails);

export default router;