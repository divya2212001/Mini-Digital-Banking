import { IUserDocument } from "../models/User.model";

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<{ user: IUserDocument; token: string }>;
  login(email: string, password: string): Promise<{ user: IUserDocument; token: string }>;
}
