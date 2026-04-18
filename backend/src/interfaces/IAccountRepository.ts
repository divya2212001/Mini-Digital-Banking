import { Types } from "mongoose";
import { IAccountDocument } from "../models/Account.model";
import { IBaseRepository } from "./IRepository";

export interface IAccountRepository extends IBaseRepository<IAccountDocument> {
  create(data: Partial<IAccountDocument>): Promise<IAccountDocument>;
  findByUserId(userId: string | Types.ObjectId): Promise<IAccountDocument[]>;
  findByAccountNumber(accountNumber: string): Promise<IAccountDocument | null>;
  updateById(
    id: string | Types.ObjectId,
    update: Partial<IAccountDocument>
  ): Promise<IAccountDocument | null>;
}
