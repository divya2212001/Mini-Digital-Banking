"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = validateResult;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../utils/ApiError");
function validateResult(req, _res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        next(new ApiError_1.ApiError(400, "Validation failed", errors.array()));
        return;
    }
    next();
}
