"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const ApiError_1 = require("../utils/ApiError");
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
}
exports.UserService = UserService;
