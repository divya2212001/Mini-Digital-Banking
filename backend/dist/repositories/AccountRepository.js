"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const Account_model_1 = require("../models/Account.model");
class AccountRepository {
    async findById(id) {
        return Account_model_1.AccountModel.findById(id);
    }
    async create(data) {
        return Account_model_1.AccountModel.create(data);
    }
    async findByUserId(userId) {
        return Account_model_1.AccountModel.find({ userId }).sort({ createdAt: -1 });
    }
    async findByAccountNumber(accountNumber) {
        return Account_model_1.AccountModel.findOne({ accountNumber });
    }
    async updateById(id, update) {
        return Account_model_1.AccountModel.findByIdAndUpdate(id, update, { new: true });
    }
}
exports.AccountRepository = AccountRepository;
