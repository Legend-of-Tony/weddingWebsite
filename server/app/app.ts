import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";

import guestRoutes from "../routes/guests.routes.ts";
import plusOneRoutes from "../routes/guestPlusOne.routes.ts";
import nameSearchRoutes from "../routes/nameSearch.routes.ts";
import rsvpRoutes from "../routes/rsvp.route.ts";

// add these
import adminAuthRoutes from "../routes/adminAuth.routes.ts";
import adminGuestRoutes from "../routes/adminGuests.routes.ts";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = new Set([
  "https://www.jasmenandlucas.com",
  "https://jasmenandlucas.com",
]);

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isLocalViteOrigin = /^http:\/\/localhost:51\d{2}$/.test(origin);

      if (isLocalViteOrigin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    proxy: isProduction,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 4,
    },
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/guests", nameSearchRoutes);
app.use("/rsvp", rsvpRoutes);

// add these
app.use("/admin", adminAuthRoutes);
app.use("/admin/guests", adminGuestRoutes);

app.use("/guests", guestRoutes);
app.use("/plus-ones", plusOneRoutes);

export default app;
