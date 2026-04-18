"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidation = exports.updateSettingsValidation = void 0;
const express_validator_1 = require("express-validator");
exports.updateSettingsValidation = [
    (0, express_validator_1.body)("theme").optional().isIn(["dark", "light"]),
    (0, express_validator_1.body)("emailNotifications").optional().isBoolean(),
];
exports.changePasswordValidation = [
    (0, express_validator_1.body)("currentPassword").notEmpty().withMessage("Current password is required"),
    (0, express_validator_1.body)("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters"),
];
