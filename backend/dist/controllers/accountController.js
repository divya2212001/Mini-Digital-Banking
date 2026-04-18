"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSavings = createSavings;
exports.myAccounts = myAccounts;
exports.balance = balance;
const AccountService_1 = require("../services/AccountService");
const accounts = new AccountService_1.AccountService();
async function createSavings(req, res, next) {
    try {
        const doc = await accounts.createSavingsAccount(req.user.userId);
        res.status(201).json({
            success: true,
            data: {
                id: doc._id,
                accountNumber: doc.accountNumber,
                type: doc.type,
                balance: doc.balance,
                status: doc.status,
            },
        });
    }
    catch (e) {
        next(e);
    }
}
async function myAccounts(req, res, next) {
    try {
        const list = await accounts.getMyAccounts(req.user.userId);
        res.json({
            success: true,
            data: list.map((a) => ({
                id: a._id,
                accountNumber: a.accountNumber,
                type: a.type,
                balance: a.balance,
                status: a.status,
            })),
        });
    }
    catch (e) {
        next(e);
    }
}
async function balance(req, res, next) {
    try {
        const id = String(req.params.id);
        const bal = await accounts.getBalance(req.user.userId, id);
        res.json({ success: true, data: { accountId: id, balance: bal } });
    }
    catch (e) {
        next(e);
    }
}
