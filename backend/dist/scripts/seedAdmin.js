"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDefaultAdmin = seedDefaultAdmin;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = require("../models/User.model");
const constants_1 = require("../config/constants");
/**
 * Ensures a default admin exists when ADMIN_EMAIL / ADMIN_PASSWORD are provided.
 */
async function seedDefaultAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        return;
    }
    const existing = await User_model_1.UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
        return;
    }
    const hash = await bcrypt_1.default.hash(password, 12);
    await User_model_1.UserModel.create({
        name: "System Admin",
        email: email.toLowerCase(),
        password: hash,
        role: constants_1.USER_ROLES.ADMIN,
    });
    console.log("Seeded default admin user");
}
