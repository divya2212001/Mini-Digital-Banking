"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectionService = void 0;
/**
 * Simple rules-based fraud flags for high-value movements.
 */
class FraudDetectionService {
    evaluate(amount) {
        const threshold = Number(process.env.FRAUD_AMOUNT_THRESHOLD) || 10000;
        if (amount > threshold) {
            return {
                suspicious: true,
                reason: `Amount exceeds configured threshold (${threshold})`,
            };
        }
        return { suspicious: false };
    }
}
exports.FraudDetectionService = FraudDetectionService;
