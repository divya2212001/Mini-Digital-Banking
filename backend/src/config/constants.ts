export const ACCOUNT_TYPES = {
  SAVINGS: "SAVINGS",
  FIXED_DEPOSIT: "FIXED_DEPOSIT",
} as const;

export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  FROZEN: "FROZEN",
} as const;

export const USER_ROLES = {
  CUSTOMER: "customer",
} as const;

export const TRANSACTION_TYPES = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  TRANSFER: "TRANSFER",
} as const;

export const TRANSACTION_STATUS = {
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

/** Default annual interest rate for savings (simplified). */
export const SAVINGS_ANNUAL_RATE = 0.05;

/** Default FD annual rates by duration (months). */
export const FD_RATES_BY_MONTHS: Record<number, number> = {
  6: 0.065,
  12: 0.07,
  24: 0.075,
};
