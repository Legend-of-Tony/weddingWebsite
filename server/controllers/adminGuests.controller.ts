import type { Request, Response } from "express";
import db from "../database/db.ts";

const PAGE_SIZE = 15;

export const getAdminGuestList = (req: Request, res: Response) => {
  const filter = String(req.query.filter || "all");
  const search = String(req.query.search || "").trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const offset = (page - 1) * PAGE_SIZE;

  try {
    if (filter === "plus-ones") {
      const whereParts: string[] = [];
      const params: unknown[] = [];

      if (search) {
        whereParts.push("p.name LIKE ?");
        params.push(`%${search}%`);
      }

      const whereSql = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

      const rows = db.prepare(`
        SELECT
          p.Id as id,
          p.name,
          p.guest_id,
          p.is_coming,
          g.name as primary_guest_name
        FROM plus_one_guests p
        JOIN Guests g ON g.Id = p.guest_id
        ${whereSql}
        ORDER BY p.name ASC
        LIMIT ? OFFSET ?
      `).all(...params, PAGE_SIZE, offset);

      const totalRow = db.prepare(`
        SELECT COUNT(*) as count
        FROM plus_one_guests p
        JOIN Guests g ON g.Id = p.guest_id
        ${whereSql}
      `).get(...params) as { count: number };

      return res.json({
        rows,
        total: totalRow.count,
        page,
        pageSize: PAGE_SIZE,
      });
    }

    const whereParts: string[] = [];
    const params: unknown[] = [];

    if (filter === "rsvpd") {
      whereParts.push("is_coming IS NOT NULL");
    } else if (filter === "not-rsvpd") {
      whereParts.push("is_coming IS NULL");
    } else if (filter === "with-plus-ones") {
      whereParts.push("has_plus_one = 1");
    }

    if (search) {
      whereParts.push("name LIKE ?");
      params.push(`%${search}%`);
    }

    const whereSql = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

    const rows = db.prepare(`
      SELECT
        Id as id,
        name,
        has_plus_one,
        is_coming,
        updated_at
      FROM Guests
      ${whereSql}
      ORDER BY name ASC
      LIMIT ? OFFSET ?
    `).all(...params, PAGE_SIZE, offset);

    const totalRow = db.prepare(`
      SELECT COUNT(*) as count
      FROM Guests
      ${whereSql}
    `).get(...params) as { count: number };

    return res.json({
      rows,
      total: totalRow.count,
      page,
      pageSize: PAGE_SIZE,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load guest list." });
  }
};

export const createAdminGuest = (req: Request, res: Response) => {
  const { name, has_plus_one = 0 } = req.body as {
    name?: string;
    has_plus_one?: number;
  };

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Guest name is required." });
  }

  try {
    const result = db.prepare(`
      INSERT INTO Guests (name, has_plus_one, is_coming)
      VALUES (?, ?, NULL)
    `).run(name.trim(), has_plus_one ? 1 : 0);

    const guest = db.prepare(`
      SELECT Id as id, name, has_plus_one, is_coming, updated_at
      FROM Guests
      WHERE Id = ?
    `).get(result.lastInsertRowid);

    return res.status(201).json({ guest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create guest." });
  }
};

export const updateAdminGuest = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, is_coming } = req.body as {
    name?: string;
    is_coming?: number | null;
  };

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Guest name is required." });
  }

  try {
    const result = db.prepare(`
      UPDATE Guests
      SET name = ?, is_coming = ?, updated_at = datetime('now','localtime')
      WHERE Id = ?
    `).run(name.trim(), is_coming ?? null, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Guest not found." });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update guest." });
  }
};

export const updateAdminPlusOne = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, is_coming } = req.body as {
    name?: string;
    is_coming?: number | null;
  };

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Plus one name is required." });
  }

  try {
    const result = db.prepare(`
      UPDATE plus_one_guests
      SET name = ?, is_coming = ?
      WHERE Id = ?
    `).run(name.trim(), is_coming ?? null, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Plus one not found." });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update plus one." });
  }
};

export const updateGuestPlusOneAccess = (req: Request, res: Response) => {
  const { id } = req.params;
  const { has_plus_one } = req.body as { has_plus_one?: number };

  try {
    const result = db.prepare(`
      UPDATE Guests
      SET has_plus_one = ?, updated_at = datetime('now','localtime')
      WHERE Id = ?
    `).run(has_plus_one ? 1 : 0, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Guest not found." });
    }

    if (!has_plus_one) {
      db.prepare(`
        DELETE FROM plus_one_guests
        WHERE guest_id = ?
      `).run(id);
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update plus-one access." });
  }
};
