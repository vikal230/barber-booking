import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["salon_owner", "customer", "barber"])
    .withMessage("Invalid role"),
];

export const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];