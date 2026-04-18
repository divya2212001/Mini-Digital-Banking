"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = require("../repositories/UserRepository");
const constants_1 = require("../config/constants");
const jwt_1 = require("../utils/jwt");
const ApiError_1 = require("../utils/ApiError");
class AuthService {
    constructor(users = new UserRepository_1.UserRepository()) {
        this.users = users;
    }
    async register(name, email, password) {
        const existing = await this.users.findByEmail(email);
        if (existing) {
            throw new ApiError_1.ApiError(409, "Email already registered");
        }
        const hashed = await bcrypt_1.default.hash(password, 12);
        const user = await this.users.create({
            name,
            email,
            password: hashed,
            role: constants_1.USER_ROLES.CUSTOMER,
        });
        const token = (0, jwt_1.signToken)({ userId: user._id.toString(), role: user.role });
        return { user, token };
    }
    async login(email, password) {
        const user = await this.users.findByEmail(email);
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        }
        const token = (0, jwt_1.signToken)({ userId: user._id.toString(), role: user.role });
        return { user, token };
    }
}
exports.AuthService = AuthService;
