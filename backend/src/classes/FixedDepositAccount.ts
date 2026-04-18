import { Account } from "./Account";

export class FixedDepositAccount extends Account {
  constructor(
    initialBalance: number,
    private readonly annualRate: number,
    private readonly lockInMonths: number
  ) {
    super(initialBalance);
  }

  calculateInterest(principal: number, _months: number): number {
    return principal * this.annualRate * (this.lockInMonths / 12);
  }
}
