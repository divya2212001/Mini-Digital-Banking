import bcrypt from "bcrypt";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IUserDocument } from "../models/User.model";
import { USER_ROLES } from "../config/constants";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export class AuthService implements IAuthService {
  constructor(private readonly users: IUserRepository = new UserRepository()) {}

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: IUserDocument; token: string }> {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ApiError(409, "Email already registered");
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await this.users.create({
      name,
      email,
      password: hashed,
      role: USER_ROLES.CUSTOMER,
    });
    const token = signToken({ userId: user._id.toString(), role: user.role });
    return { user, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUserDocument; token: string }> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError(401, "Invalid credentials");
    }
    const token = signToken({ userId: user._id.toString(), role: user.role });
    return { user, token };
  }
}
