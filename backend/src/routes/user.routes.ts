import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  profile,
  dashboardSummary,
  monthlySpending,
  getSettings,
  updateSettings,
  changePassword,
} from "../controllers/userController";
import { requireRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../config/constants";
import { updateSettingsValidation, changePasswordValidation } from "../validators/user.validator";
import { validateResult } from "../middleware/validate.middleware";

const router = Router();

router.use(authenticate);

router.get("/profile", profile);
router.get("/settings", getSettings);
router.put(
  "/settings",
  requireRole(USER_ROLES.CUSTOMER),
  ...updateSettingsValidation,
  validateResult,
  updateSettings
);
router.put(
  "/password",
  requireRole(USER_ROLES.CUSTOMER),
  ...changePasswordValidation,
  validateResult,
  changePassword
);
router.get(
  "/dashboard/summary",
  requireRole(USER_ROLES.CUSTOMER),
  dashboardSummary
);
router.get(
  "/analytics/spending",
  requireRole(USER_ROLES.CUSTOMER),
  monthlySpending
);

export default router;
