import jwt from "jsonwebtoken";
import { USER_ROLES } from "../config/constants";

export interface JwtPayload {
  userId: string;
  role: (typeof USER_ROLES)[keyof typeof USER_ROLES];
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  const expires = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn: expires as jwt.SignOptions["expiresIn"] });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.verify(token, secret) as JwtPayload;
}
