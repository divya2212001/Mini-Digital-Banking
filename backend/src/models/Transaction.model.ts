import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from "../config/constants";

export interface ITransactionDocument extends Document {
  fromAccount?: Types.ObjectId | null;
  toAccount?: Types.ObjectId | null;
  userId: Types.ObjectId;
  type: (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];
  amount: number;
  status: (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
  suspicious: boolean;
  suspiciousReason?: string;
  timestamp: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    fromAccount: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    toAccount: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: [TRANSACTION_TYPES.DEPOSIT, TRANSACTION_TYPES.WITHDRAW, TRANSACTION_TYPES.TRANSFER],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [TRANSACTION_STATUS.COMPLETED, TRANSACTION_STATUS.FAILED],
      default: TRANSACTION_STATUS.COMPLETED,
    },
    suspicious: { type: Boolean, default: false },
    suspiciousReason: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const TransactionModel: Model<ITransactionDocument> =
  mongoose.models.Transaction ||
  mongoose.model<ITransactionDocument>("Transaction", TransactionSchema);
