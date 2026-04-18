import { body } from "express-validator";

export const amountBody = [
  body("accountId").notEmpty(),
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be positive"),
];

export const transferValidation = [
  body("fromAccountId").notEmpty(),
  body("toAccountNumber").trim().notEmpty(),
  body("amount").isFloat({ gt: 0 }),
];

export const fdValidation = [
  body("amount").isFloat({ gt: 0 }),
  body("durationMonths")
    .isInt()
    .custom((v) => [6, 12, 24].includes(Number(v)))
    .withMessage("durationMonths must be 6, 12, or 24"),
];
