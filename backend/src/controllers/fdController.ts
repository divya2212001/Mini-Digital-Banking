import { Response, NextFunction } from "express";
import { FixedDepositService } from "../services/FixedDepositService";
import { AuthRequest } from "../middleware/auth.middleware";

const fds = new FixedDepositService();

export async function createFd(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { amount, durationMonths } = req.body as { amount: number; durationMonths: number };
    const result = await fds.create(req.user!.userId, amount, durationMonths);
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function myFd(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const list = await fds.list(req.user!.userId);
    res.json({ success: true, data: list });
  } catch (e) {
    next(e);
  }
}
