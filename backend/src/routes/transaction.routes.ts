import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  deposit,
  withdraw,
  transfer,
  history,
  exportPdf,
} from "../controllers/transactionController";
import { requireRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../config/constants";
import { amountBody, transferValidation } from "../validators/transaction.validator";
import { validateResult } from "../middleware/validate.middleware";

const router = Router();

router.use(authenticate, requireRole(USER_ROLES.CUSTOMER));

router.post("/deposit", ...amountBody, validateResult, deposit);
router.post("/withdraw", ...amountBody, validateResult, withdraw);
router.post("/transfer", ...transferValidation, validateResult, transfer);
router.get("/history/:id/export-pdf", exportPdf);
router.get("/history/:id", history);

export default router;
