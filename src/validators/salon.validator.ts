import { body } from "express-validator";

export const createSalonValidator = [
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required"),
  body("subdomain")
    .trim()
    .notEmpty()
    .withMessage("Subdomain is required")
    .isLowercase()
    .withMessage("Subdomain must be lowercase")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Subdomain can only contain letters, numbers and hyphens"),
];