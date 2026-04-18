"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedDepositService = void 0;
const mongoose_1 = require("mongoose");
const AccountFactory_1 = require("../factories/AccountFactory");
const UserMapper_1 = require("../classes/UserMapper");
const UserRepository_1 = require("../repositories/UserRepository");
const FixedDepositRepository_1 = require("../repositories/FixedDepositRepository");
const constants_1 = require("../config/constants");
const ApiError_1 = require("../utils/ApiError");
class FixedDepositService {
    constructor(users = new UserRepository_1.UserRepository(), fds = new FixedDepositRepository_1.FixedDepositRepository(), factory = new AccountFactory_1.AccountFactory()) {
        this.users = users;
        this.fds = fds;
        this.factory = factory;
    }
    async create(userId, amount, durationMonths) {
        if (!constants_1.FD_RATES_BY_MONTHS[durationMonths]) {
            throw new ApiError_1.ApiError(400, "Unsupported duration. Choose 6, 12, or 24 months.");
        }
        const userDoc = await this.users.findById(userId);
        if (!userDoc) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const domainUser = UserMapper_1.UserMapper.toDomain(userDoc);
        const { document, maturityDate, interestRate } = await this.factory.createFixedDepositAccount(domainUser, amount, durationMonths);
        const fd = await this.fds.create({
            userId: new mongoose_1.Types.ObjectId(userId.toString()),
            accountId: document._id,
            amount,
            durationMonths,
            interestRate,
            maturityDate,
        });
        return { fixedDeposit: fd, account: document };
    }
    async list(userId) {
        return this.fds.findByUserId(userId);
    }
}
exports.FixedDepositService = FixedDepositService;
