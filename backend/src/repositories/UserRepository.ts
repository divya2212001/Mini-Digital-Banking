import { Types } from "mongoose";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserDocument, UserModel } from "../models/User.model";

export class UserRepository implements IUserRepository {
  async findById(id: string | Types.ObjectId): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
    return UserModel.create(data);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  }
}
