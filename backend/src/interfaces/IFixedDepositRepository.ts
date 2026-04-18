import { Types } from "mongoose";
import { IFixedDepositDocument } from "../models/FixedDeposit.model";
import { IBaseRepository } from "./IRepository";

export interface IFixedDepositRepository extends IBaseRepository<IFixedDepositDocument> {
  create(data: Partial<IFixedDepositDocument>): Promise<IFixedDepositDocument>;
  findByUserId(userId: string | Types.ObjectId): Promise<IFixedDepositDocument[]>;
}
