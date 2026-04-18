import { Types } from "mongoose";
import { ITransactionDocument } from "../models/Transaction.model";
import { IBaseRepository } from "./IRepository";

export interface ITransactionRepository extends IBaseRepository<ITransactionDocument> {
  create(data: Partial<ITransactionDocument>): Promise<ITransactionDocument>;
  findByAccountId(
    accountId: string | Types.ObjectId,
    skip: number,
    limit: number
  ): Promise<ITransactionDocument[]>;
  aggregateMonthlySpending(
    userId: string | Types.ObjectId,
    year: number,
    month: number
  ): Promise<number>;
}
