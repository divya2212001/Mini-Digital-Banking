"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fdValidation = exports.transferValidation = exports.amountBody = void 0;
const express_validator_1 = require("express-validator");
exports.amountBody = [
    (0, express_validator_1.body)("accountId").notEmpty(),
    (0, express_validator_1.body)("amount").isFloat({ gt: 0 }).withMessage("Amount must be positive"),
];
exports.transferValidation = [
    (0, express_validator_1.body)("fromAccountId").notEmpty(),
    (0, express_validator_1.body)("toAccountNumber").trim().notEmpty(),
    (0, express_validator_1.body)("amount").isFloat({ gt: 0 }),
];
exports.fdValidation = [
    (0, express_validator_1.body)("amount").isFloat({ gt: 0 }),
    (0, express_validator_1.body)("durationMonths")
        .isInt()
        .custom((v) => [6, 12, 24].includes(Number(v)))
        .withMessage("durationMonths must be 6, 12, or 24"),
];
