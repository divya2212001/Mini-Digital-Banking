/**
 * Encapsulation: balance is private; mutations go through deposit/withdraw.
 */
export abstract class Account {
  private balance: number;

  constructor(initialBalance: number) {
    if (initialBalance < 0) {
      throw new Error("Initial balance cannot be negative");
    }
    this.balance = initialBalance;
  }

  getBalance(): number {
    return this.balance;
  }

  protected setBalance(value: number): void {
    if (value < 0) {
      throw new Error("Balance cannot be negative");
    }
    this.balance = value;
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.balance += amount;
  }

  withdraw(amount: number): boolean {
    if (amount <= 0) {
      return false;
    }
    if (amount > this.balance) {
      return false;
    }
    this.balance -= amount;
    return true;
  }

  /** Polymorphism: different account products compute interest differently. */
  abstract calculateInterest(principal: number, months: number): number;
}
