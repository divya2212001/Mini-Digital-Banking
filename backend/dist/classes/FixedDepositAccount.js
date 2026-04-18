"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedDepositAccount = void 0;
const Account_1 = require("./Account");
class FixedDepositAccount extends Account_1.Account {
    constructor(initialBalance, annualRate, lockInMonths) {
        super(initialBalance);
        this.annualRate = annualRate;
        this.lockInMonths = lockInMonths;
    }
    calculateInterest(principal, _months) {
        return principal * this.annualRate * (this.lockInMonths / 12);
    }
}
exports.FixedDepositAccount = FixedDepositAccount;
