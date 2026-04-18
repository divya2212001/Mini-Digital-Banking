import { Types } from "mongoose";
import { SavingsAccount } from "../classes/SavingsAccount";
import { ACCOUNT_STATUS, ACCOUNT_TYPES, TRANSACTION_STATUS, TRANSACTION_TYPES } from "../config/constants";
import { IAccountRepository } from "../interfaces/IAccountRepository";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { IUserRepository } from "../interfaces/IUserRepository";
import { AccountRepository } from "../repositories/AccountRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ApiError } from "../utils/ApiError";
import { EmailService } from "./EmailService";
import { FraudDetectionService } from "./FraudDetectionService";

export class TransactionService {
  constructor(
    private readonly accounts: IAccountRepository = new AccountRepository(),
    private readonly transactions: ITransactionRepository = new TransactionRepository(),
    private readonly users: IUserRepository = new UserRepository(),
    private readonly fraud: FraudDetectionService = new FraudDetectionService(),
    private readonly email: EmailService = new EmailService()
  ) {}

  private async loadSavings(userId: string | Types.ObjectId, accountId: string) {
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

  async deposit(userId: string | Types.ObjectId, accountId: string, amount: number) {
    const acc = await this.loadSavings(userId, accountId);
    const domain = new SavingsAccount(acc.balance);
    domain.deposit(amount);
    const fraud = this.fraud.evaluate(amount);
    await this.accounts.updateById(acc._id, { balance: domain.getBalance() });
    const tx = await this.transactions.create({
      userId: new Types.ObjectId(userId.toString()),
      toAccount: acc._id,
      type: TRANSACTION_TYPES.DEPOSIT,
      amount,
      status: TRANSACTION_STATUS.COMPLETED,
      suspicious: fraud.suspicious,
      suspiciousReason: fraud.reason,
    });
    const user = await this.users.findById(userId);
    if (user) {
      this.email.notifyTransaction(user.email, "DEPOSIT", amount, acc.accountNumber);
    }
    return tx;
  }

  async withdraw(userId: string | Types.ObjectId, accountId: string, amount: number) {
    const acc = await this.loadSavings(userId, accountId);
    const domain = new SavingsAccount(acc.balance);
    const ok = domain.withdraw(amount);
    if (!ok) {
      throw new ApiError(400, "Insufficient balance or invalid amount");
    }
    const fraud = this.fraud.evaluate(amount);
    await this.accounts.updateById(acc._id, { balance: domain.getBalance() });
    const tx = await this.transactions.create({
      userId: new Types.ObjectId(userId.toString()),
      fromAccount: acc._id,
      type: TRANSACTION_TYPES.WITHDRAW,
      amount,
      status: TRANSACTION_STATUS.COMPLETED,
      suspicious: fraud.suspicious,
      suspiciousReason: fraud.reason,
    });
    const user = await this.users.findById(userId);
    if (user) {
      this.email.notifyTransaction(user.email, "WITHDRAW", amount, acc.accountNumber);
    }
    return tx;
  }

  async transfer(
    userId: string | Types.ObjectId,
    fromAccountId: string,
    toAccountNumber: string,
    amount: number
  ) {
    const from = await this.loadSavings(userId, fromAccountId);
    const to = await this.accounts.findByAccountNumber(toAccountNumber.trim());
    if (!to) {
      throw new ApiError(404, "Destination account not found");
    }
    if (to._id.equals(from._id)) {
      throw new ApiError(400, "Cannot transfer to the same account");
    }
    if (to.status === ACCOUNT_STATUS.FROZEN) {
      throw new ApiError(403, "Destination account is frozen");
    }
    if (to.type !== ACCOUNT_TYPES.SAVINGS) {
      throw new ApiError(400, "Transfers supported to savings accounts only");
    }

    const source = new SavingsAccount(from.balance);
    const moved = source.withdraw(amount);
    if (!moved) {
      throw new ApiError(400, "Insufficient balance or invalid amount");
    }
    const dest = new SavingsAccount(to.balance);
    dest.deposit(amount);
    const fraud = this.fraud.evaluate(amount);

    await this.accounts.updateById(from._id, { balance: source.getBalance() });
    await this.accounts.updateById(to._id, { balance: dest.getBalance() });

    const tx = await this.transactions.create({
      userId: new Types.ObjectId(userId.toString()),
      fromAccount: from._id,
      toAccount: to._id,
      type: TRANSACTION_TYPES.TRANSFER,
      amount,
      status: TRANSACTION_STATUS.COMPLETED,
      suspicious: fraud.suspicious,
      suspiciousReason: fraud.reason,
    });

    const user = await this.users.findById(userId);
    if (user) {
      this.email.notifyTransaction(user.email, "TRANSFER", amount, from.accountNumber);
    }
    return tx;
  }

  async history(accountId: string, userId: string | Types.ObjectId, skip = 0, limit = 50) {
    const acc = await this.accounts.findById(accountId);
    if (!acc || acc.userId.toString() !== userId.toString()) {
      throw new ApiError(404, "Account not found");
    }
    return this.transactions.findByAccountId(accountId, skip, limit);
  }
}
