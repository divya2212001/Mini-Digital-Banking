import mongoose, { Schema, Document, Model } from "mongoose";
import { USER_ROLES } from "../config/constants";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: (typeof USER_ROLES)[keyof typeof USER_ROLES];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [USER_ROLES.CUSTOMER],
      default: USER_ROLES.CUSTOMER,
    },
  },
  { timestamps: true }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
