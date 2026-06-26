import { Router } from "express";
import { register, login, refreshToken } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.js";

const router = Router();


router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/refresh-token", refreshToken);

export default router;