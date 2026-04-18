"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_model_1 = require("../models/User.model");
class UserRepository {
    async findById(id) {
        return User_model_1.UserModel.findById(id);
    }
    async create(data) {
        return User_model_1.UserModel.create(data);
    }
    async findByEmail(email) {
        return User_model_1.UserModel.findOne({ email: email.toLowerCase() });
    }
}
exports.UserRepository = UserRepository;
