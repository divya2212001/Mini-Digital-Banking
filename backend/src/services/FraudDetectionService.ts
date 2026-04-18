/**
 * Simple rules-based fraud flags for high-value movements.
 */
export class FraudDetectionService {
  evaluate(amount: number): { suspicious: boolean; reason?: string } {
    const threshold = Number(process.env.FRAUD_AMOUNT_THRESHOLD) || 10_000;
    if (amount > threshold) {
      return {
        suspicious: true,
        reason: `Amount exceeds configured threshold (${threshold})`,
      };
    }
    return { suspicious: false };
  }
}
