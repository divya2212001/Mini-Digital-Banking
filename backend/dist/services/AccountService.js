"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const AccountRepository_1 = require("../repositories/AccountRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const AccountFactory_1 = require("../factories/AccountFactory");
const UserMapper_1 = require("../classes/UserMapper");
const constants_1 = require("../config/constants");
const ApiError_1 = require("../utils/ApiError");
class AccountService {
    constructor(accounts = new AccountRepository_1.AccountRepository(), users = new UserRepository_1.UserRepository(), factory = new AccountFactory_1.AccountFactory()) {
        this.accounts = accounts;
        this.users = users;
        this.factory = factory;
    }
    async createSavingsAccount(userId) {
        const userDoc = await this.users.findById(userId);
        if (!userDoc) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const domainUser = UserMapper_1.UserMapper.toDomain(userDoc);
        const { document } = await this.factory.createSavingsAccount(domainUser, 0);
        return document;
    }
    async getMyAccounts(userId) {
        return this.accounts.findByUserId(userId);
    }
    async getBalance(userId, accountId) {
        const acc = await this.accounts.findById(accountId);
        if (!acc) {
            throw new ApiError_1.ApiError(404, "Account not found");
        }
        if (acc.userId.toString() !== userId.toString()) {
            throw new ApiError_1.ApiError(403, "Forbidden");
        }
        return acc.balance;
    }
    async assertOwnedActiveSavings(userId, accountId) {
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
}
exports.AccountService = AccountService;
