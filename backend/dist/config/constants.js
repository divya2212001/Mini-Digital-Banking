"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FD_RATES_BY_MONTHS = exports.SAVINGS_ANNUAL_RATE = exports.TRANSACTION_STATUS = exports.TRANSACTION_TYPES = exports.USER_ROLES = exports.ACCOUNT_STATUS = exports.ACCOUNT_TYPES = void 0;
exports.ACCOUNT_TYPES = {
    SAVINGS: "SAVINGS",
    FIXED_DEPOSIT: "FIXED_DEPOSIT",
};
exports.ACCOUNT_STATUS = {
    ACTIVE: "ACTIVE",
    FROZEN: "FROZEN",
};
exports.USER_ROLES = {
    CUSTOMER: "customer",
};
exports.TRANSACTION_TYPES = {
    DEPOSIT: "DEPOSIT",
    WITHDRAW: "WITHDRAW",
    TRANSFER: "TRANSFER",
};
exports.TRANSACTION_STATUS = {
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
};
/** Default annual interest rate for savings (simplified). */
exports.SAVINGS_ANNUAL_RATE = 0.05;
/** Default FD annual rates by duration (months). */
exports.FD_RATES_BY_MONTHS = {
    6: 0.065,
    12: 0.07,
    24: 0.075,
};
