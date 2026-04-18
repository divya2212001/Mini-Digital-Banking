import { Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import { AnalyticsService } from "../services/AnalyticsService";
import { AuthRequest } from "../middleware/auth.middleware";

const users = new UserService();
const analytics = new AnalyticsService();

export async function getSettings(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await users.getSettings(req.user!.userId);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function updateSettings(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as {
      theme?: "dark" | "light";
      emailNotifications?: boolean;
    };
    const partial: { theme?: "dark" | "light"; emailNotifications?: boolean } = {};
    if (body.theme !== undefined) partial.theme = body.theme;
    if (body.emailNotifications !== undefined) partial.emailNotifications = body.emailNotifications;
    const data = await users.updateSettings(req.user!.userId, partial);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function changePassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    await users.changePassword(req.user!.userId, currentPassword, newPassword);
    res.json({ success: true, message: "Password updated" });
  } catch (e) {
    next(e);
  }
}

export async function profile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await users.getProfile(req.user!.userId);
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function dashboardSummary(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await analytics.dashboardSummary(req.user!.userId);
    res.json({ success: true, data: summary });
  } catch (e) {
    next(e);
  }
}

export async function monthlySpending(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const data = await analytics.monthlySpending(req.user!.userId, year, month);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
