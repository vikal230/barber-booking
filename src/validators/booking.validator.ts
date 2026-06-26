import { body, query } from "express-validator";

export const getSlotsValidator = [
  query("barberId").notEmpty().withMessage("Barber ID is required"),
  query("date")
    .notEmpty()
    .withMessage("Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  query("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isNumeric()
    .withMessage("Duration must be a number"),
];

export const lockSlotValidator = [
  body("barberId").notEmpty().withMessage("Barber ID is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("slot").notEmpty().withMessage("Slot is required"),
];

export const confirmBookingValidator = [
  body("barberId").notEmpty().withMessage("Barber ID is required"),
  body("serviceId").notEmpty().withMessage("Service ID is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("slot.start").notEmpty().withMessage("Slot start is required"),
  body("slot.end").notEmpty().withMessage("Slot end is required"),
];