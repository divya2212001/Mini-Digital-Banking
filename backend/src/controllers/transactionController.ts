import { Response, NextFunction } from "express";
import { TransactionService } from "../services/TransactionService";
import { AnalyticsService } from "../services/AnalyticsService";
import { PdfService } from "../services/PdfService";
import { AuthRequest } from "../middleware/auth.middleware";

const tx = new TransactionService();
const analytics = new AnalyticsService();
const pdf = new PdfService();

export async function deposit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { accountId, amount } = req.body as { accountId: string; amount: number };
    const result = await tx.deposit(req.user!.userId, accountId, amount);
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function withdraw(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { accountId, amount } = req.body as { accountId: string; amount: number };
    const result = await tx.withdraw(req.user!.userId, accountId, amount);
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function transfer(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { fromAccountId, toAccountNumber, amount } = req.body as {
      fromAccountId: string;
      toAccountNumber: string;
      amount: number;
    };
    const result = await tx.transfer(req.user!.userId, fromAccountId, toAccountNumber, amount);
    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function history(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 50;
    const rows = await tx.history(id, req.user!.userId, skip, limit);
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
}

export async function exportPdf(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const acc = await analytics.assertAccountAccess(req.user!.userId, id);
    const rows = await tx.history(id, req.user!.userId, 0, 200);
    const buffer = await pdf.buildTransactionStatement(
      "Transaction statement",
      acc.accountNumber,
      rows.map((r) => ({
        date: new Date(r.timestamp).toISOString(),
        type: r.type,
        amount: r.amount.toFixed(2),
        status: r.status,
        suspicious: r.suspicious,
      }))
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="transactions-${acc.accountNumber}.pdf"`
    );
    res.send(buffer);
  } catch (e) {
    next(e);
  }
}
