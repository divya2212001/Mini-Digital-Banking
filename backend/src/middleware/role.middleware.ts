import { Response, NextFunction } from "express";
import { USER_ROLES } from "../config/constants";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "./auth.middleware";

export function requireRole(...roles: (typeof USER_ROLES)[keyof typeof USER_ROLES][]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "Authentication required"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "Insufficient permissions"));
      return;
    }
    next();
  };
}
