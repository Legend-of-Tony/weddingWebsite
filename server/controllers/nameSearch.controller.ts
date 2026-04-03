import type { Request, Response } from "express";
import db from "../database/db.ts";

export const searchGuestsByName = (req: Request, res: Response) => {
  const q = String(req.query.q || "").trim();

  if (!q) {
    return res.json([]);
  }

  try {
    const guests = db
      .prepare(
        `
        SELECT
          Id AS id,
          name,
          has_plus_one,
          is_coming,
          updated_at
        FROM Guests
        WHERE name LIKE ?
        ORDER BY name ASC
        LIMIT 10
        `
      )
      .all(`%${q}%`);

    return res.status(200).json(guests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error searching guests",
      error,
    });
  }
};