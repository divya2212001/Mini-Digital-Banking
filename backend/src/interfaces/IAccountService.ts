import { Types } from "mongoose";
import { IAccountDocument } from "../models/Account.model";

export interface IAccountService {
  createSavingsAccount(userId: string | Types.ObjectId): Promise<IAccountDocument>;
  getMyAccounts(userId: string | Types.ObjectId): Promise<IAccountDocument[]>;
  getBalance(userId: string | Types.ObjectId, accountId: string): Promise<number>;
}
