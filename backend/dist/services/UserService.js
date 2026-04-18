"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = require("../repositories/UserRepository");
const ApiError_1 = require("../utils/ApiError");
const DEFAULT_SETTINGS = {
    theme: "dark",
    emailNotifications: true,
};
class UserService {
    constructor(users = new UserRepository_1.UserRepository()) {
        this.users = users;
    }
    async getProfile(userId) {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        return user;
    }
    mergeSettings(user) {
        return {
            ...DEFAULT_SETTINGS,
            ...user.settings,
        };
    }
    async getSettings(userId) {
        const user = await this.getProfile(userId);
        return this.mergeSettings(user);
    }
    async updateSettings(userId, partial) {
        const user = await this.getProfile(userId);
        const next = {
            ...this.mergeSettings(user),
            ...partial,
        };
        await this.users.updateById(userId, { settings: next });
        return next;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.getProfile(userId);
        const match = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!match) {
            throw new ApiError_1.ApiError(401, "Current password is incorrect");
        }
        const hash = await bcrypt_1.default.hash(newPassword, 12);
        const updated = await this.users.updateById(userId, { password: hash });
        if (!updated) {
            throw new ApiError_1.ApiError(500, "Could not update password");
        }
    }
}
exports.UserService = UserService;
