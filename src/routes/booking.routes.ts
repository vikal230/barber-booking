// import { Router } from "express";
// import {
//   getSlots,
//   lockBookingSlot,
//   confirmBooking,
//   getMyBookings,
//   cancelBooking,
// } from "../controllers/booking.controller.js";
// import { protect, restrictTo } from "../middleware/authMiddleware.js";
// import tenantMiddleware from "../middleware/tenantMiddleware.js";

// const router = Router();

// router.use(protect, tenantMiddleware);

// router.get("/slots", getSlots);
// router.post("/lock-slot", restrictTo("customer"), lockBookingSlot);
// router.post("/confirm", restrictTo("customer"), confirmBooking);
// router.get("/my", restrictTo("customer"), getMyBookings);
// router.patch("/cancel/:id", restrictTo("customer"), cancelBooking);

// export default router;


import { Router } from "express";
import {
  getSlots,
  lockBookingSlot,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  completeBooking
} from "../controllers/booking.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import tenantMiddleware from "../middleware/tenantMiddleware.js";
import {
  getSlotsValidator,
  lockSlotValidator,
  confirmBookingValidator,
} from "../validators/booking.validator.js";
import validate from "../middleware/validate.js";

const router = Router();

router.use(protect, tenantMiddleware);

router.get("/slots", getSlotsValidator, validate, getSlots);
router.post("/lock-slot", restrictTo("customer"), lockSlotValidator, validate, lockBookingSlot);
router.post("/confirm", restrictTo("customer"), confirmBookingValidator, validate, confirmBooking);
router.get("/my", restrictTo("customer"), getMyBookings);
router.patch("/cancel/:id", restrictTo("customer"), cancelBooking);
router.patch("/complete/:id", restrictTo("barber"), completeBooking);

export default router;