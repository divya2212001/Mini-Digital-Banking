import { Types } from "mongoose";
import { IAccountRepository } from "../interfaces/IAccountRepository";
import { AccountModel, IAccountDocument } from "../models/Account.model";

export class AccountRepository implements IAccountRepository {
  async findById(id: string | Types.ObjectId): Promise<IAccountDocument | null> {
    return AccountModel.findById(id);
  }

  async create(data: Partial<IAccountDocument>): Promise<IAccountDocument> {
    return AccountModel.create(data);
  }

  async findByUserId(userId: string | Types.ObjectId): Promise<IAccountDocument[]> {
    return AccountModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByAccountNumber(accountNumber: string): Promise<IAccountDocument | null> {
    return AccountModel.findOne({ accountNumber });
  }

  async updateById(
    id: string | Types.ObjectId,
    update: Partial<IAccountDocument>
  ): Promise<IAccountDocument | null> {
    return AccountModel.findByIdAndUpdate(id, update, { new: true });
  }
}
