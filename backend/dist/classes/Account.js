"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
/**
 * Encapsulation: balance is private; mutations go through deposit/withdraw.
 */
class Account {
    constructor(initialBalance) {
        if (initialBalance < 0) {
            throw new Error("Initial balance cannot be negative");
        }
        this.balance = initialBalance;
    }
    getBalance() {
        return this.balance;
    }
    setBalance(value) {
        if (value < 0) {
            throw new Error("Balance cannot be negative");
        }
        this.balance = value;
    }
    deposit(amount) {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive");
        }
        this.balance += amount;
    }
    withdraw(amount) {
        if (amount <= 0) {
            return false;
        }
        if (amount > this.balance) {
            return false;
        }
        this.balance -= amount;
        return true;
    }
}
exports.Account = Account;
