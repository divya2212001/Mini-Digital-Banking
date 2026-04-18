import { Types } from "mongoose";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ApiError } from "../utils/ApiError";

export class UserService {
  constructor(private readonly users: IUserRepository = new UserRepository()) {}

  async getProfile(userId: string | Types.ObjectId) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }
}
