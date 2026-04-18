import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new ApiError(401, "Authentication required"));
    return;
  }
  const token = header.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
