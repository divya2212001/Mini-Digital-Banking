"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const TransactionRepository_1 = require("../repositories/TransactionRepository");
const AccountRepository_1 = require("../repositories/AccountRepository");
const ApiError_1 = require("../utils/ApiError");
class AnalyticsService {
    constructor(transactions = new TransactionRepository_1.TransactionRepository(), accounts = new AccountRepository_1.AccountRepository()) {
        this.transactions = transactions;
        this.accounts = accounts;
    }
    async monthlySpending(userId, year, month) {
        const total = await this.transactions.aggregateMonthlySpending(userId, year, month);
        return { year, month, totalSpending: total };
    }
    async dashboardSummary(userId) {
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
        const monthlySpending = await this.transactions.aggregateMonthlySpending(userId, now.getFullYear(), now.getMonth() + 1);
        return {
            totalBalance,
            accountCount: accounts.length,
            monthlySpending,
        };
    }
    async assertAccountAccess(userId, accountId) {
        const acc = await this.accounts.findById(accountId);
        if (!acc || acc.userId.toString() !== userId.toString()) {
            throw new ApiError_1.ApiError(404, "Account not found");
        }
        return acc;
    }
}
exports.AnalyticsService = AnalyticsService;
