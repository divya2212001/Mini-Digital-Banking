import { Types } from "mongoose";
import { AccountFactory } from "../factories/AccountFactory";
import { UserMapper } from "../classes/UserMapper";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IFixedDepositRepository } from "../interfaces/IFixedDepositRepository";
import { UserRepository } from "../repositories/UserRepository";
import { FixedDepositRepository } from "../repositories/FixedDepositRepository";
import { FD_RATES_BY_MONTHS } from "../config/constants";
import { ApiError } from "../utils/ApiError";

export class FixedDepositService {
  constructor(
    private readonly users: IUserRepository = new UserRepository(),
    private readonly fds: IFixedDepositRepository = new FixedDepositRepository(),
    private readonly factory: AccountFactory = new AccountFactory()
  ) {}

  async create(
    userId: string | Types.ObjectId,
    amount: number,
    durationMonths: number
  ) {
    if (!FD_RATES_BY_MONTHS[durationMonths]) {
      throw new ApiError(400, "Unsupported duration. Choose 6, 12, or 24 months.");
    }
    const userDoc = await this.users.findById(userId);
    if (!userDoc) {
      throw new ApiError(404, "User not found");
    }
    const domainUser = UserMapper.toDomain(userDoc);
    const { document, maturityDate, interestRate } = await this.factory.createFixedDepositAccount(
      domainUser,
      amount,
      durationMonths
    );

    const fd = await this.fds.create({
      userId: new Types.ObjectId(userId.toString()),
      accountId: document._id,
      amount,
      durationMonths,
      interestRate,
      maturityDate,
    });

    return { fixedDeposit: fd, account: document };
  }

  async list(userId: string | Types.ObjectId) {
    return this.fds.findByUserId(userId);
  }
}
