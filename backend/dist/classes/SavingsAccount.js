"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsAccount = void 0;
const Account_1 = require("./Account");
const constants_1 = require("../config/constants");
class SavingsAccount extends Account_1.Account {
    calculateInterest(principal, months) {
        const monthlyRate = constants_1.SAVINGS_ANNUAL_RATE / 12;
        return principal * monthlyRate * months;
    }
}
exports.SavingsAccount = SavingsAccount;
