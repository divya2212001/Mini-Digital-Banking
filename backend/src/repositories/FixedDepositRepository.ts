import { Types } from "mongoose";
import { IFixedDepositRepository } from "../interfaces/IFixedDepositRepository";
import { FixedDepositModel, IFixedDepositDocument } from "../models/FixedDeposit.model";

export class FixedDepositRepository implements IFixedDepositRepository {
  async findById(id: string | Types.ObjectId): Promise<IFixedDepositDocument | null> {
    return FixedDepositModel.findById(id);
  }

  async create(data: Partial<IFixedDepositDocument>): Promise<IFixedDepositDocument> {
    return FixedDepositModel.create(data);
  }

  async findByUserId(userId: string | Types.ObjectId): Promise<IFixedDepositDocument[]> {
    return FixedDepositModel.find({ userId }).sort({ createdAt: -1 }).populate("accountId");
  }
}
