import { Router } from "express";
import { register, login } from "../controllers/authController";
import { registerValidation, loginValidation } from "../validators/auth.validator";
import { validateResult } from "../middleware/validate.middleware";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.post(
  "/register",
  authLimiter,
  ...registerValidation,
  validateResult,
  register
);
router.post("/login", authLimiter, ...loginValidation, validateResult, login);

export default router;
