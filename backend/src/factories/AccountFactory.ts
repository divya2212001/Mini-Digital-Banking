import { Types } from "mongoose";
import { ACCOUNT_TYPES } from "../config/constants";
import { User } from "../classes/User";
import { SavingsAccount } from "../classes/SavingsAccount";
import { FixedDepositAccount } from "../classes/FixedDepositAccount";
import { AccountModel, IAccountDocument } from "../models/Account.model";
import { IAccountRepository } from "../interfaces/IAccountRepository";
import { AccountRepository } from "../repositories/AccountRepository";
import { generateAccountNumber } from "../utils/generateAccountNumber";
import { FD_RATES_BY_MONTHS } from "../config/constants";

export interface CreateSavingsResult {
  document: IAccountDocument;
  domain: SavingsAccount;
}

export interface CreateFdResult {
  document: IAccountDocument;
  domain: FixedDepositAccount;
  maturityDate: Date;
  interestRate: number;
}

/**
 * Factory for constructing domain account objects and persisted account records.
 */
export class AccountFactory {
  constructor(private readonly accounts: IAccountRepository = new AccountRepository()) {}

  async createSavingsAccount(user: User, initialBalance = 0): Promise<CreateSavingsResult> {
    const domain = new SavingsAccount(initialBalance);
    const doc = await this.accounts.create({
      userId: new Types.ObjectId(user.getId()),
      accountNumber: generateAccountNumber(),
      type: ACCOUNT_TYPES.SAVINGS,
      balance: domain.getBalance(),
    });
    return { document: doc, domain };
  }

  async createFixedDepositAccount(
    user: User,
    amount: number,
    durationMonths: number
  ): Promise<CreateFdResult> {
    const rate = FD_RATES_BY_MONTHS[durationMonths] ?? 0.07;
    const domain = new FixedDepositAccount(amount, rate, durationMonths);
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + durationMonths);

    const doc = await this.accounts.create({
      userId: new Types.ObjectId(user.getId()),
      accountNumber: generateAccountNumber(),
      type: ACCOUNT_TYPES.FIXED_DEPOSIT,
      balance: domain.getBalance(),
    });

    return { document: doc, domain, maturityDate, interestRate: rate };
  }
}
