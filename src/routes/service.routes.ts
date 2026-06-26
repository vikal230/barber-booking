import { Router } from "express";
import { createService, getServices, deleteService } from "../controllers/service.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

const router = Router();

router.use(protect, tenantMiddleware, restrictTo("salon_owner"));

router.post("/", createService);
router.get("/", getServices);
router.delete("/:id", deleteService);

export default router;