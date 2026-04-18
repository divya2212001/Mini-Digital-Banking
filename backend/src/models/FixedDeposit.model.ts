import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFixedDepositDocument extends Document {
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  amount: number;
  durationMonths: number;
  interestRate: number;
  maturityDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FixedDepositSchema = new Schema<IFixedDepositDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    amount: { type: Number, required: true, min: 0 },
    durationMonths: { type: Number, required: true, min: 1 },
    interestRate: { type: Number, required: true },
    maturityDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const FixedDepositModel: Model<IFixedDepositDocument> =
  mongoose.models.FixedDeposit ||
  mongoose.model<IFixedDepositDocument>("FixedDeposit", FixedDepositSchema);
