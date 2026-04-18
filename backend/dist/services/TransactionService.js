"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const mongoose_1 = require("mongoose");
const SavingsAccount_1 = require("../classes/SavingsAccount");
const constants_1 = require("../config/constants");
const AccountRepository_1 = require("../repositories/AccountRepository");
const TransactionRepository_1 = require("../repositories/TransactionRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const ApiError_1 = require("../utils/ApiError");
const EmailService_1 = require("./EmailService");
const FraudDetectionService_1 = require("./FraudDetectionService");
class TransactionService {
    shouldSendTransactionEmail(user) {
        if (!user) {
            return false;
        }
        if (user.settings?.emailNotifications === false) {
            return false;
        }
        return true;
    }
    constructor(accounts = new AccountRepository_1.AccountRepository(), transactions = new TransactionRepository_1.TransactionRepository(), users = new UserRepository_1.UserRepository(), fraud = new FraudDetectionService_1.FraudDetectionService(), email = new EmailService_1.EmailService()) {
        this.accounts = accounts;
        this.transactions = transactions;
        this.users = users;
        this.fraud = fraud;
        this.email = email;
    }
    async loadSavings(userId, accountId) {
        const acc = await this.accounts.findById(accountId);
        if (!acc || acc.userId.toString() !== userId.toString()) {
            throw new ApiError_1.ApiError(404, "Account not found");
        }
        if (acc.status === constants_1.ACCOUNT_STATUS.FROZEN) {
            throw new ApiError_1.ApiError(403, "Account is frozen");
        }
        if (acc.type !== constants_1.ACCOUNT_TYPES.SAVINGS) {
            throw new ApiError_1.ApiError(400, "Operation allowed only on savings accounts");
        }
        return acc;
    }
    async deposit(userId, accountId, amount) {
        const acc = await this.loadSavings(userId, accountId);
        const domain = new SavingsAccount_1.SavingsAccount(acc.balance);
        domain.deposit(amount);
        const fraud = this.fraud.evaluate(amount);
        await this.accounts.updateById(acc._id, { balance: domain.getBalance() });
        const tx = await this.transactions.create({
            userId: new mongoose_1.Types.ObjectId(userId.toString()),
            toAccount: acc._id,
            type: constants_1.TRANSACTION_TYPES.DEPOSIT,
            amount,
            status: constants_1.TRANSACTION_STATUS.COMPLETED,
            suspicious: fraud.suspicious,
            suspiciousReason: fraud.reason,
        });
        const user = await this.users.findById(userId);
        if (this.shouldSendTransactionEmail(user)) {
            this.email.notifyTransaction(user.email, "DEPOSIT", amount, acc.accountNumber);
        }
        return tx;
    }
    async withdraw(userId, accountId, amount) {
        const acc = await this.loadSavings(userId, accountId);
        const domain = new SavingsAccount_1.SavingsAccount(acc.balance);
        const ok = domain.withdraw(amount);
        if (!ok) {
            throw new ApiError_1.ApiError(400, "Insufficient balance or invalid amount");
        }
        const fraud = this.fraud.evaluate(amount);
        await this.accounts.updateById(acc._id, { balance: domain.getBalance() });
        const tx = await this.transactions.create({
            userId: new mongoose_1.Types.ObjectId(userId.toString()),
            fromAccount: acc._id,
            type: constants_1.TRANSACTION_TYPES.WITHDRAW,
            amount,
            status: constants_1.TRANSACTION_STATUS.COMPLETED,
            suspicious: fraud.suspicious,
            suspiciousReason: fraud.reason,
        });
        const user = await this.users.findById(userId);
        if (this.shouldSendTransactionEmail(user)) {
            this.email.notifyTransaction(user.email, "WITHDRAW", amount, acc.accountNumber);
        }
        return tx;
    }
    async transfer(userId, fromAccountId, toAccountNumber, amount) {
        const from = await this.loadSavings(userId, fromAccountId);
        const to = await this.accounts.findByAccountNumber(toAccountNumber.trim());
        if (!to) {
            throw new ApiError_1.ApiError(404, "Destination account not found");
        }
        if (to._id.equals(from._id)) {
            throw new ApiError_1.ApiError(400, "Cannot transfer to the same account");
        }
        if (to.status === constants_1.ACCOUNT_STATUS.FROZEN) {
            throw new ApiError_1.ApiError(403, "Destination account is frozen");
        }
        if (to.type !== constants_1.ACCOUNT_TYPES.SAVINGS) {
            throw new ApiError_1.ApiError(400, "Transfers supported to savings accounts only");
        }
        const source = new SavingsAccount_1.SavingsAccount(from.balance);
        const moved = source.withdraw(amount);
        if (!moved) {
            throw new ApiError_1.ApiError(400, "Insufficient balance or invalid amount");
        }
        const dest = new SavingsAccount_1.SavingsAccount(to.balance);
        dest.deposit(amount);
        const fraud = this.fraud.evaluate(amount);
        await this.accounts.updateById(from._id, { balance: source.getBalance() });
        await this.accounts.updateById(to._id, { balance: dest.getBalance() });
        const tx = await this.transactions.create({
            userId: new mongoose_1.Types.ObjectId(userId.toString()),
            fromAccount: from._id,
            toAccount: to._id,
            type: constants_1.TRANSACTION_TYPES.TRANSFER,
            amount,
            status: constants_1.TRANSACTION_STATUS.COMPLETED,
            suspicious: fraud.suspicious,
            suspiciousReason: fraud.reason,
        });
        const user = await this.users.findById(userId);
        if (this.shouldSendTransactionEmail(user)) {
            this.email.notifyTransaction(user.email, "TRANSFER", amount, from.accountNumber);
        }
        return tx;
    }
    async history(accountId, userId, skip = 0, limit = 50) {
        const acc = await this.accounts.findById(accountId);
        if (!acc || acc.userId.toString() !== userId.toString()) {
            throw new ApiError_1.ApiError(404, "Account not found");
        }
        return this.transactions.findByAccountId(accountId, skip, limit);
    }
}
exports.TransactionService = TransactionService;
