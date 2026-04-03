import express from "express";
import rateLimit from "express-rate-limit";
import { loginAdmin, logoutAdmin, getAdminSession } from "../controllers/adminAuth.controller.ts";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/session", getAdminSession);

export default router;