import { Account } from "./Account";
import { SAVINGS_ANNUAL_RATE } from "../config/constants";

export class SavingsAccount extends Account {
  calculateInterest(principal: number, months: number): number {
    const monthlyRate = SAVINGS_ANNUAL_RATE / 12;
    return principal * monthlyRate * months;
  }
}
