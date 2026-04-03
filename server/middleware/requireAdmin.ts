import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};