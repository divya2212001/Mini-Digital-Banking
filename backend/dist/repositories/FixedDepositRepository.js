"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedDepositRepository = void 0;
const FixedDeposit_model_1 = require("../models/FixedDeposit.model");
class FixedDepositRepository {
    async findById(id) {
        return FixedDeposit_model_1.FixedDepositModel.findById(id);
    }
    async create(data) {
        return FixedDeposit_model_1.FixedDepositModel.create(data);
    }
    async findByUserId(userId) {
        return FixedDeposit_model_1.FixedDepositModel.find({ userId }).sort({ createdAt: -1 }).populate("accountId");
    }
}
exports.FixedDepositRepository = FixedDepositRepository;
