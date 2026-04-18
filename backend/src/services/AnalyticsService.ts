import { Types } from "mongoose";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { IAccountRepository } from "../interfaces/IAccountRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { AccountRepository } from "../repositories/AccountRepository";
import { ApiError } from "../utils/ApiError";

export class AnalyticsService {
  constructor(
    private readonly transactions: ITransactionRepository = new TransactionRepository(),
    private readonly accounts: IAccountRepository = new AccountRepository()
  ) {}

  async monthlySpending(userId: string | Types.ObjectId, year: number, month: number) {
    const total = await this.transactions.aggregateMonthlySpending(userId, year, month);
    return { year, month, totalSpending: total };
  }

  async dashboardSummary(userId: string | Types.ObjectId) {
    const accounts = await this.accounts.findByUserId(userId);
    if (!accounts.length) {
      return {
        totalBalance: 0,
        accountCount: 0,
        monthlySpending: 0,
      };
    }
    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
    const now = new Date();
    const monthlySpending = await this.transactions.aggregateMonthlySpending(
      userId,
      now.getFullYear(),
      now.getMonth() + 1
    );
    return {
      totalBalance,
      accountCount: accounts.length,
      monthlySpending,
    };
  }

  async assertAccountAccess(userId: string | Types.ObjectId, accountId: string) {
    const acc = await this.accounts.findById(accountId);
    if (!acc || acc.userId.toString() !== userId.toString()) {
      throw new ApiError(404, "Account not found");
    }
    return acc;
  }
}
