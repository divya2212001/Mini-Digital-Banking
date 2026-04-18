"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const ApiError_1 = require("../utils/ApiError");
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            next(new ApiError_1.ApiError(401, "Authentication required"));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new ApiError_1.ApiError(403, "Insufficient permissions"));
            return;
        }
        next();
    };
}
