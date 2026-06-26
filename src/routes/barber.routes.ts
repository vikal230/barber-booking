import { Router } from "express";
import { addBarber, getBarbers, updateBarber } from "../controllers/barber.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

const router = Router();

router.use(protect, tenantMiddleware);

router.post("/", restrictTo("salon_owner"), addBarber);
router.get("/", restrictTo("salon_owner", "barber"), getBarbers);
router.patch("/:id", restrictTo("salon_owner"), updateBarber);

export default router;