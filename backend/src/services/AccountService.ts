import { Types } from "mongoose";
import { IAccountService } from "../interfaces/IAccountService";
import { IAccountRepository } from "../interfaces/IAccountRepository";
import { AccountRepository } from "../repositories/AccountRepository";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AccountFactory } from "../factories/AccountFactory";
import { UserMapper } from "../classes/UserMapper";
import { ACCOUNT_TYPES, ACCOUNT_STATUS } from "../config/constants";
import { ApiError } from "../utils/ApiError";
import { IAccountDocument } from "../models/Account.model";

export class AccountService implements IAccountService {
  constructor(
    private readonly accounts: IAccountRepository = new AccountRepository(),
    private readonly users: IUserRepository = new UserRepository(),
    private readonly factory: AccountFactory = new AccountFactory()
  ) {}

  async createSavingsAccount(userId: string | Types.ObjectId): Promise<IAccountDocument> {
    const userDoc = await this.users.findById(userId);
    if (!userDoc) {
      throw new ApiError(404, "User not found");
    }
    const domainUser = UserMapper.toDomain(userDoc);
    const { document } = await this.factory.createSavingsAccount(domainUser, 0);
    return document;
  }

  async getMyAccounts(userId: string | Types.ObjectId): Promise<IAccountDocument[]> {
    return this.accounts.findByUserId(userId);
  }

  async getBalance(userId: string | Types.ObjectId, accountId: string): Promise<number> {
    const acc = await this.accounts.findById(accountId);
    if (!acc) {
      throw new ApiError(404, "Account not found");
    }
    if (acc.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "Forbidden");
    }
    return acc.balance;
  }

  async assertOwnedActiveSavings(
    userId: string | Types.ObjectId,
    accountId: string
  ): Promise<IAccountDocument> {
    const acc = await this.accounts.findById(accountId);
    if (!acc || acc.userId.toString() !== userId.toString()) {
      throw new ApiError(404, "Account not found");
    }
    if (acc.status === ACCOUNT_STATUS.FROZEN) {
      throw new ApiError(403, "Account is frozen");
    }
    if (acc.type !== ACCOUNT_TYPES.SAVINGS) {
      throw new ApiError(400, "Operation allowed only on savings accounts");
    }
    return acc;
  }
}
