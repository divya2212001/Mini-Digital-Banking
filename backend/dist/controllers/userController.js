"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = profile;
exports.dashboardSummary = dashboardSummary;
exports.monthlySpending = monthlySpending;
const UserService_1 = require("../services/UserService");
const AnalyticsService_1 = require("../services/AnalyticsService");
const users = new UserService_1.UserService();
const analytics = new AnalyticsService_1.AnalyticsService();
async function profile(req, res, next) {
    try {
        const user = await users.getProfile(req.user.userId);
        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    }
    catch (e) {
        next(e);
    }
}
async function dashboardSummary(req, res, next) {
    try {
        const summary = await analytics.dashboardSummary(req.user.userId);
        res.json({ success: true, data: summary });
    }
    catch (e) {
        next(e);
    }
}
async function monthlySpending(req, res, next) {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();
        const month = Number(req.query.month) || new Date().getMonth() + 1;
        const data = await analytics.monthlySpending(req.user.userId, year, month);
        res.json({ success: true, data });
    }
    catch (e) {
        next(e);
    }
}
