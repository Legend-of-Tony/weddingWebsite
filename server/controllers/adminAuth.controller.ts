import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

export const loginAdmin = async (req: Request, res: Response) => {
  const { pin } = req.body as { pin?: string };

  if (!pin || !/^\d{4}$/.test(pin)) {
    return res.status(400).json({ error: "Invalid PIN format." });
  }

  const pinHash = process.env.ADMIN_PIN_HASH;

  if (!pinHash) {
    return res.status(500).json({ error: "Admin PIN is not configured." });
  }

  const isValid = await bcrypt.compare(pin, pinHash);

  if (!isValid) {
    return res.status(401).json({ error: "Incorrect PIN." });
  }

  req.session.isAdmin = true;

  return res.status(200).json({ success: true });
};

export const logoutAdmin = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true });
  });
};

export const getAdminSession = (req: Request, res: Response) => {
  return res.status(200).json({
    authenticated: !!req.session.isAdmin,
  });
};