import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createFd, myFd } from "../controllers/fdController";
import { requireRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../config/constants";
import { fdValidation } from "../validators/transaction.validator";
import { validateResult } from "../middleware/validate.middleware";

const router = Router();

router.use(authenticate, requireRole(USER_ROLES.CUSTOMER));

router.post("/create", ...fdValidation, validateResult, createFd);
router.get("/my", myFd);

export default router;
