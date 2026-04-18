import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { profile, dashboardSummary, monthlySpending } from "../controllers/userController";
import { requireRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../config/constants";

const router = Router();

router.use(authenticate);

router.get("/profile", profile);
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
