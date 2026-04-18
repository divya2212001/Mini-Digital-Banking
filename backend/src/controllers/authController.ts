import { Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { AuthRequest } from "../middleware/auth.middleware";

const authService = new AuthService();

function sanitizeUser(user: { name: string; email: string; role: string; _id: unknown }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function register(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const { user, token } = await authService.register(name, email, password);
    res.status(201).json({
      success: true,
      data: { user: sanitizeUser(user), token },
    });
  } catch (e) {
    next(e);
  }
}

export async function login(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { user, token } = await authService.login(email, password);
    res.json({
      success: true,
      data: { user: sanitizeUser(user), token },
    });
  } catch (e) {
    next(e);
  }
}
