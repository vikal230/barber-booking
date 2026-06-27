// import { Router } from "express";
// import { createService, getServices, deleteService } from "../controllers/service.controller.js";
// import { protect, restrictTo } from "../middleware/authMiddleware.js";
// import tenantMiddleware from "../middleware/tenantMiddleware.js";

// const router = Router();

// router.use(protect, tenantMiddleware, restrictTo("salon_owner"));

// router.post("/", createService);
// router.get("/", getServices);
// router.delete("/:id", deleteService);

// export default router;


import { Router } from "express";
import { createService, getServices, deleteService } from "../controllers/service.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";

const router = Router();

router.post("/", protect, tenantMiddleware, restrictTo("salon_owner"), createService);
router.get("/", protect, tenantMiddleware, getServices);
router.delete("/:id", protect, tenantMiddleware, restrictTo("salon_owner"), deleteService);

export default router;