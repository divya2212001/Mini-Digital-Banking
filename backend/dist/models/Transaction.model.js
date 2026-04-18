"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../config/constants");
const TransactionSchema = new mongoose_1.Schema({
    fromAccount: { type: mongoose_1.Schema.Types.ObjectId, ref: "Account", default: null },
    toAccount: { type: mongoose_1.Schema.Types.ObjectId, ref: "Account", default: null },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
        type: String,
        enum: [constants_1.TRANSACTION_TYPES.DEPOSIT, constants_1.TRANSACTION_TYPES.WITHDRAW, constants_1.TRANSACTION_TYPES.TRANSFER],
        required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: [constants_1.TRANSACTION_STATUS.COMPLETED, constants_1.TRANSACTION_STATUS.FAILED],
        default: constants_1.TRANSACTION_STATUS.COMPLETED,
    },
    suspicious: { type: Boolean, default: false },
    suspiciousReason: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: false });
exports.TransactionModel = mongoose_1.default.models.Transaction ||
    mongoose_1.default.model("Transaction", TransactionSchema);
