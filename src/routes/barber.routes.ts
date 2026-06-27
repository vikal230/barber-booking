import { Router } from "express";
import { addBarber, getBarbers, updateBarber, deactivateBarber, deleteBarber } from "../controllers/barber.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

const router = Router();

router.use(protect, tenantMiddleware);

router.post("/", restrictTo("salon_owner"), addBarber);
router.get("/", restrictTo("salon_owner", "barber"), getBarbers);
router.patch("/:id", restrictTo("salon_owner"), updateBarber);
router.patch("/:id/deactivate", restrictTo("salon_owner"), deactivateBarber);
router.delete("/:id", restrictTo("salon_owner"), deleteBarber);

export default router;