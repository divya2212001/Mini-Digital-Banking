"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const mongoose_1 = require("mongoose");
const Transaction_model_1 = require("../models/Transaction.model");
const constants_1 = require("../config/constants");
class TransactionRepository {
    async findById(id) {
        return Transaction_model_1.TransactionModel.findById(id);
    }
    async create(data) {
        return Transaction_model_1.TransactionModel.create(data);
    }
    async findByAccountId(accountId, skip, limit) {
        const acc = new mongoose_1.Types.ObjectId(accountId);
        return Transaction_model_1.TransactionModel.find({
            $or: [{ fromAccount: acc }, { toAccount: acc }],
        })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .populate("fromAccount toAccount", "accountNumber");
    }
    async aggregateMonthlySpending(userId, year, month) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        const uid = new mongoose_1.Types.ObjectId(userId);
        const result = await Transaction_model_1.TransactionModel.aggregate([
            {
                $match: {
                    userId: uid,
                    status: constants_1.TRANSACTION_STATUS.COMPLETED,
                    timestamp: { $gte: start, $lt: end },
                    type: { $in: [constants_1.TRANSACTION_TYPES.WITHDRAW, constants_1.TRANSACTION_TYPES.TRANSFER] },
                },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return result[0]?.total ?? 0;
    }
}
exports.TransactionRepository = TransactionRepository;
