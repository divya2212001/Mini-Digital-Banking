"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const AuthService_1 = require("../services/AuthService");
const authService = new AuthService_1.AuthService();
function sanitizeUser(user) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
    };
}
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const { user, token } = await authService.register(name, email, password);
        res.status(201).json({
            success: true,
            data: { user: sanitizeUser(user), token },
        });
    }
    catch (e) {
        next(e);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.json({
            success: true,
            data: { user: sanitizeUser(user), token },
        });
    }
    catch (e) {
        next(e);
    }
}
