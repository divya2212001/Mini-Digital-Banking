import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
    return;
  }
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
