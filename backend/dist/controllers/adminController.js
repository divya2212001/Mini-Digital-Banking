"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = users;
exports.freeze = freeze;
exports.activate = activate;
exports.transactions = transactions;
exports.fraudAlerts = fraudAlerts;
exports.auditLogs = auditLogs;
const AdminService_1 = require("../services/AdminService");
const admin = new AdminService_1.AdminService();
async function users(req, res, next) {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 20;
        const q = req.query.q || "";
        const result = q.trim()
            ? await admin.searchUsers(q, skip, limit)
            : await admin.listUsers(skip, limit);
        res.json({
            success: true,
            data: {
                users: result.items.map((u) => ({
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    createdAt: u.createdAt,
                })),
                total: result.total,
            },
        });
    }
    catch (e) {
        next(e);
    }
}
async function freeze(req, res, next) {
    try {
        const id = String(req.params.id);
        const data = await admin.freezeAccount(req.user.userId, id);
        res.json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function activate(req, res, next) {
    try {
        const id = String(req.params.id);
        const data = await admin.activateAccount(req.user.userId, id);
        res.json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
async function transactions(req, res, next) {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 50;
        const rows = await admin.allTransactions(skip, limit);
        res.json({ success: true, data: rows });
    }
    catch (e) {
        next(e);
    }
}
async function fraudAlerts(req, res, next) {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 50;
        const rows = await admin.fraudAlerts(skip, limit);
        res.json({ success: true, data: rows });
    }
    catch (e) {
        next(e);
    }
}
async function auditLogs(req, res, next) {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 50;
        const result = await admin.auditLogs(skip, limit);
        res.json({ success: true, data: result });
    }
    catch (e) {
        next(e);
    }
}
