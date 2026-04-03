import type { Request, Response } from "express";
import db from "../database/db.ts";

export const getAllGuests = (req: Request, res: Response) => {
  try {
    const guests = db.prepare(`
      SELECT
        Id AS id,
        name,
        has_plus_one,
        is_coming,
        updated_at
      FROM Guests
    `).all();

    return res.status(200).json({
      success: true,
      data: guests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch guests.",
    });
  }
};

export const getGuestById = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const guest = db.prepare(`
      SELECT
        Id AS id,
        name,
        has_plus_one,
        is_coming,
        updated_at
      FROM Guests
      WHERE Id = ?
    `).get(id);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: guest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch guest.",
    });
  }
};

export const createGuest = (req: Request, res: Response) => {
  const { name, has_plus_one = 0, is_coming = null } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      success: false,
      message: "Guest name is required.",
    });
  }

  try {
    const result = db.prepare(`
      INSERT INTO Guests (name, has_plus_one, is_coming)
      VALUES (?, ?, ?)
    `).run(String(name).trim(), has_plus_one, is_coming);

    const newGuest = db.prepare(`
      SELECT
        Id AS id,
        name,
        has_plus_one,
        is_coming,
        updated_at
      FROM Guests
      WHERE Id = ?
    `).get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      data: newGuest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create guest.",
    });
  }
};

export const updateGuest = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, has_plus_one, is_coming } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      success: false,
      message: "Guest name is required.",
    });
  }

  try {
    const result = db.prepare(`
      UPDATE Guests
      SET name = ?, has_plus_one = ?, is_coming = ?
      WHERE Id = ?
    `).run(String(name).trim(), has_plus_one, is_coming, id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }

    const updatedGuest = db.prepare(`
      SELECT
        Id AS id,
        name,
        has_plus_one,
        is_coming,
        updated_at
      FROM Guests
      WHERE Id = ?
    `).get(id);

    return res.status(200).json({
      success: true,
      data: updatedGuest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update guest.",
    });
  }
};

export const deleteGuest = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = db.prepare("DELETE FROM Guests WHERE Id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Guest deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete guest.",
    });
  }
};