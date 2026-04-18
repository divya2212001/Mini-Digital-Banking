import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import accountRoutes from "./account.routes";
import transactionRoutes from "./transaction.routes";
import fdRoutes from "./fd.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/accounts", accountRoutes);
router.use("/transactions", transactionRoutes);
router.use("/fd", fdRoutes);

export default router;
