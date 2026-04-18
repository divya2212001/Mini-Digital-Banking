"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_1 = require("../utils/jwt");
const ApiError_1 = require("../utils/ApiError");
function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next(new ApiError_1.ApiError(401, "Authentication required"));
        return;
    }
    const token = header.slice(7);
    try {
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch {
        next(new ApiError_1.ApiError(401, "Invalid or expired token"));
    }
}
