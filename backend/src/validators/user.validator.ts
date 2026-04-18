import { body } from "express-validator";

export const updateSettingsValidation = [
  body("theme").optional().isIn(["dark", "light"]),
  body("emailNotifications").optional().isBoolean(),
];

export const changePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
];
