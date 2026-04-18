"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFd = createFd;
exports.myFd = myFd;
const FixedDepositService_1 = require("../services/FixedDepositService");
const fds = new FixedDepositService_1.FixedDepositService();
async function createFd(req, res, next) {
    try {
        const { amount, durationMonths } = req.body;
        const result = await fds.create(req.user.userId, amount, durationMonths);
        res.status(201).json({ success: true, data: result });
    }
    catch (e) {
        next(e);
    }
}
async function myFd(req, res, next) {
    try {
        const list = await fds.list(req.user.userId);
        res.json({ success: true, data: list });
    }
    catch (e) {
        next(e);
    }
}
