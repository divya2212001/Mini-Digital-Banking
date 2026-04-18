import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createSavings, myAccounts, balance } from "../controllers/accountController";
import { requireRole } from "../middleware/role.middleware";
import { USER_ROLES } from "../config/constants";

const router = Router();

router.use(authenticate, requireRole(USER_ROLES.CUSTOMER));

router.post("/create", createSavings);
router.get("/my", myAccounts);
router.get("/balance/:id", balance);

export default router;
