"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountFactory = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../config/constants");
const SavingsAccount_1 = require("../classes/SavingsAccount");
const FixedDepositAccount_1 = require("../classes/FixedDepositAccount");
const AccountRepository_1 = require("../repositories/AccountRepository");
const generateAccountNumber_1 = require("../utils/generateAccountNumber");
const constants_2 = require("../config/constants");
/**
 * Factory for constructing domain account objects and persisted account records.
 */
class AccountFactory {
    constructor(accounts = new AccountRepository_1.AccountRepository()) {
        this.accounts = accounts;
    }
    async createSavingsAccount(user, initialBalance = 0) {
        const domain = new SavingsAccount_1.SavingsAccount(initialBalance);
        const doc = await this.accounts.create({
            userId: new mongoose_1.Types.ObjectId(user.getId()),
            accountNumber: (0, generateAccountNumber_1.generateAccountNumber)(),
            type: constants_1.ACCOUNT_TYPES.SAVINGS,
            balance: domain.getBalance(),
        });
        return { document: doc, domain };
    }
    async createFixedDepositAccount(user, amount, durationMonths) {
        const rate = constants_2.FD_RATES_BY_MONTHS[durationMonths] ?? 0.07;
        const domain = new FixedDepositAccount_1.FixedDepositAccount(amount, rate, durationMonths);
        const maturityDate = new Date();
        maturityDate.setMonth(maturityDate.getMonth() + durationMonths);
        const doc = await this.accounts.create({
            userId: new mongoose_1.Types.ObjectId(user.getId()),
            accountNumber: (0, generateAccountNumber_1.generateAccountNumber)(),
            type: constants_1.ACCOUNT_TYPES.FIXED_DEPOSIT,
            balance: domain.getBalance(),
        });
        return { document: doc, domain, maturityDate, interestRate: rate };
    }
}
exports.AccountFactory = AccountFactory;
