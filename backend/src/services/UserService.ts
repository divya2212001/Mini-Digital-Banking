import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IUserSettings } from "../models/User.model";
import { ApiError } from "../utils/ApiError";

const DEFAULT_SETTINGS: IUserSettings = {
  theme: "dark",
  emailNotifications: true,
};

export class UserService {
  constructor(private readonly users: IUserRepository = new UserRepository()) {}

  async getProfile(userId: string | Types.ObjectId) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  mergeSettings(user: { settings?: IUserSettings }): IUserSettings {
    return {
      ...DEFAULT_SETTINGS,
      ...user.settings,
    };
  }

  async getSettings(userId: string | Types.ObjectId): Promise<IUserSettings> {
    const user = await this.getProfile(userId);
    return this.mergeSettings(user);
  }

  async updateSettings(
    userId: string | Types.ObjectId,
    partial: Partial<Pick<IUserSettings, "theme" | "emailNotifications">>
  ): Promise<IUserSettings> {
    const user = await this.getProfile(userId);
    const next: IUserSettings = {
      ...this.mergeSettings(user),
      ...partial,
    };
    await this.users.updateById(userId, { settings: next });
    return next;
  }

  async changePassword(
    userId: string | Types.ObjectId,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.getProfile(userId);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      throw new ApiError(401, "Current password is incorrect");
    }
    const hash = await bcrypt.hash(newPassword, 12);
    const updated = await this.users.updateById(userId, { password: hash });
    if (!updated) {
      throw new ApiError(500, "Could not update password");
    }
  }
}
