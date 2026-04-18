import { body } from "express-validator";

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];
