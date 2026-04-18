import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ACCOUNT_TYPES, ACCOUNT_STATUS } from "../config/constants";

export interface IAccountDocument extends Document {
  userId: Types.ObjectId;
  accountNumber: string;
  type: (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];
  balance: number;
  status: (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccountDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    accountNumber: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: [ACCOUNT_TYPES.SAVINGS, ACCOUNT_TYPES.FIXED_DEPOSIT],
      required: true,
    },
    balance: { type: Number, required: true, default: 0, min: 0 },
    status: {
      type: String,
      enum: [ACCOUNT_STATUS.ACTIVE, ACCOUNT_STATUS.FROZEN],
      default: ACCOUNT_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

export const AccountModel: Model<IAccountDocument> =
  mongoose.models.Account || mongoose.model<IAccountDocument>("Account", AccountSchema);
