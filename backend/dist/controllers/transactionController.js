"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deposit = deposit;
exports.withdraw = withdraw;
exports.transfer = transfer;
exports.history = history;
exports.exportPdf = exportPdf;
const TransactionService_1 = require("../services/TransactionService");
const AnalyticsService_1 = require("../services/AnalyticsService");
const PdfService_1 = require("../services/PdfService");
const tx = new TransactionService_1.TransactionService();
const analytics = new AnalyticsService_1.AnalyticsService();
const pdf = new PdfService_1.PdfService();
async function deposit(req, res, next) {
    try {
        const { accountId, amount } = req.body;
        const result = await tx.deposit(req.user.userId, accountId, amount);
        res.status(201).json({ success: true, data: result });
    }
    catch (e) {
        next(e);
    }
}
async function withdraw(req, res, next) {
    try {
        const { accountId, amount } = req.body;
        const result = await tx.withdraw(req.user.userId, accountId, amount);
        res.status(201).json({ success: true, data: result });
    }
    catch (e) {
        next(e);
    }
}
async function transfer(req, res, next) {
    try {
        const { fromAccountId, toAccountNumber, amount } = req.body;
        const result = await tx.transfer(req.user.userId, fromAccountId, toAccountNumber, amount);
        res.status(201).json({ success: true, data: result });
    }
    catch (e) {
        next(e);
    }
}
async function history(req, res, next) {
    try {
        const id = String(req.params.id);
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 50;
        const rows = await tx.history(id, req.user.userId, skip, limit);
        res.json({ success: true, data: rows });
    }
    catch (e) {
        next(e);
    }
}
async function exportPdf(req, res, next) {
    try {
        const id = String(req.params.id);
        const acc = await analytics.assertAccountAccess(req.user.userId, id);
        const rows = await tx.history(id, req.user.userId, 0, 200);
        const buffer = await pdf.buildTransactionStatement("Transaction statement", acc.accountNumber, rows.map((r) => ({
            date: new Date(r.timestamp).toISOString(),
            type: r.type,
            amount: r.amount.toFixed(2),
            status: r.status,
            suspicious: r.suspicious,
        })));
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="transactions-${acc.accountNumber}.pdf"`);
        res.send(buffer);
    }
    catch (e) {
        next(e);
    }
}
