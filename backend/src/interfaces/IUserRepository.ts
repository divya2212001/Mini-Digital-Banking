import { Types } from "mongoose";
import { IUserDocument } from "../models/User.model";
import { IBaseRepository } from "./IRepository";

export interface IUserRepository extends IBaseRepository<IUserDocument> {
  create(data: Partial<IUserDocument>): Promise<IUserDocument>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  updateById(
    id: string | Types.ObjectId,
    update: Partial<IUserDocument>
  ): Promise<IUserDocument | null>;
}
