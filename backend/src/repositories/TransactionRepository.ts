import { Types } from "mongoose";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { ITransactionDocument, TransactionModel } from "../models/Transaction.model";
import { TRANSACTION_STATUS, TRANSACTION_TYPES } from "../config/constants";

export class TransactionRepository implements ITransactionRepository {
  async findById(id: string | Types.ObjectId): Promise<ITransactionDocument | null> {
    return TransactionModel.findById(id);
  }

  async create(data: Partial<ITransactionDocument>): Promise<ITransactionDocument> {
    return TransactionModel.create(data);
  }

  async findByAccountId(
    accountId: string | Types.ObjectId,
    skip: number,
    limit: number
  ): Promise<ITransactionDocument[]> {
    const acc = new Types.ObjectId(accountId);
    return TransactionModel.find({
      $or: [{ fromAccount: acc }, { toAccount: acc }],
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate("fromAccount toAccount", "accountNumber");
  }

  async aggregateMonthlySpending(
    userId: string | Types.ObjectId,
    year: number,
    month: number
  ): Promise<number> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const uid = new Types.ObjectId(userId);

    const result = await TransactionModel.aggregate<{ total: number }>([
      {
        $match: {
          userId: uid,
          status: TRANSACTION_STATUS.COMPLETED,
          timestamp: { $gte: start, $lt: end },
          type: { $in: [TRANSACTION_TYPES.WITHDRAW, TRANSACTION_TYPES.TRANSFER] },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return result[0]?.total ?? 0;
  }
}
