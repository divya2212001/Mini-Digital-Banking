"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const mongoose_1 = require("mongoose");
const UserRepository_1 = require("../repositories/UserRepository");
const AccountRepository_1 = require("../repositories/AccountRepository");
const TransactionRepository_1 = require("../repositories/TransactionRepository");
const AuditLogRepository_1 = require("../repositories/AuditLogRepository");
const constants_1 = require("../config/constants");
const ApiError_1 = require("../utils/ApiError");
class AdminService {
    constructor(users = new UserRepository_1.UserRepository(), accounts = new AccountRepository_1.AccountRepository(), transactions = new TransactionRepository_1.TransactionRepository(), audit = new AuditLogRepository_1.AuditLogRepository()) {
        this.users = users;
        this.accounts = accounts;
        this.transactions = transactions;
        this.audit = audit;
    }
    async listUsers(skip, limit) {
        const [items, total] = await Promise.all([
            this.users.findAll(skip, limit),
            this.users.countDocuments(),
        ]);
        return { items, total };
    }
    async searchUsers(q, skip, limit) {
        const [items, total] = await Promise.all([
            this.users.search(q, skip, limit),
            this.users.countSearch(q),
        ]);
        return { items, total };
    }
    async freezeAccount(adminId, userId) {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const accs = await this.accounts.findByUserId(userId);
        await Promise.all(accs.map((a) => this.accounts.updateById(a._id, { status: constants_1.ACCOUNT_STATUS.FROZEN })));
        await this.audit.create({
            action: "FREEZE_USER_ACCOUNTS",
            adminId: new mongoose_1.Types.ObjectId(adminId),
            targetUserId: new mongoose_1.Types.ObjectId(userId),
            metadata: { accountCount: accs.length },
        });
        return { frozen: accs.length };
    }
    async activateAccount(adminId, userId) {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const accs = await this.accounts.findByUserId(userId);
        await Promise.all(accs.map((a) => this.accounts.updateById(a._id, { status: constants_1.ACCOUNT_STATUS.ACTIVE })));
        await this.audit.create({
            action: "ACTIVATE_USER_ACCOUNTS",
            adminId: new mongoose_1.Types.ObjectId(adminId),
            targetUserId: new mongoose_1.Types.ObjectId(userId),
            metadata: { accountCount: accs.length },
        });
        return { activated: accs.length };
    }
    async allTransactions(skip, limit) {
        return this.transactions.findAll(skip, limit);
    }
    async fraudAlerts(skip, limit) {
        return this.transactions.findSuspicious(skip, limit);
    }
    async auditLogs(skip, limit) {
        const [items, total] = await Promise.all([
            this.audit.findAll(skip, limit),
            this.audit.count(),
        ]);
        return { items, total };
    }
}
exports.AdminService = AdminService;
