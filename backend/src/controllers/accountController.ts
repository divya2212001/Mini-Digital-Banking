import { Response, NextFunction } from "express";
import { AccountService } from "../services/AccountService";
import { AuthRequest } from "../middleware/auth.middleware";

const accounts = new AccountService();

export async function createSavings(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const doc = await accounts.createSavingsAccount(req.user!.userId);
    res.status(201).json({
      success: true,
      data: {
        id: doc._id,
        accountNumber: doc.accountNumber,
        type: doc.type,
        balance: doc.balance,
        status: doc.status,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function myAccounts(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const list = await accounts.getMyAccounts(req.user!.userId);
    res.json({
      success: true,
      data: list.map((a) => ({
        id: a._id,
        accountNumber: a.accountNumber,
        type: a.type,
        balance: a.balance,
        status: a.status,
      })),
    });
  } catch (e) {
    next(e);
  }
}

export async function balance(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const bal = await accounts.getBalance(req.user!.userId, id);
    res.json({ success: true, data: { accountId: id, balance: bal } });
  } catch (e) {
    next(e);
  }
}
