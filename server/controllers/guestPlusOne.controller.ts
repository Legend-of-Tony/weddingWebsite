import type { Request, Response } from "express";
import db from "../database/db.ts";

type GuestLookup = {
  id: number;
  has_plus_one: number;
};

export const getAllPlusOnes = (req: Request, res: Response) => {
  try {
    const plusOnes = db.prepare(`
      SELECT
        Id AS id,
        name,
        guest_id,
        is_coming,
        created_at
      FROM plus_one_guests
    `).all();

    return res.status(200).json(plusOnes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching plus ones",
      error,
    });
  }
};

export const getPlusOneById = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const plusOne = db.prepare(`
      SELECT
        Id AS id,
        name,
        guest_id,
        is_coming,
        created_at
      FROM plus_one_guests
      WHERE Id = ?
    `).get(id);

    if (!plusOne) {
      return res.status(404).json({ message: "Plus one not found" });
    }

    return res.status(200).json(plusOne);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching plus one",
      error,
    });
  }
};

export const createPlusOne = (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      message: "Guest name is required",
    });
  }

  try {
    const guest = db.prepare(`
      SELECT Id AS id, has_plus_one
      FROM Guests
      WHERE name = ?
    `).get(String(name).trim()) as GuestLookup | undefined;

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    if (!guest.has_plus_one) {
      return res.status(400).json({
        message: "Guest does not have a plus one",
      });
    }

    const result = db.prepare(`
      INSERT INTO plus_one_guests (guest_id)
      VALUES (?)
    `).run(guest.id);

    const plusOne = db.prepare(`
      SELECT
        Id AS id,
        name,
        guest_id,
        is_coming,
        created_at
      FROM plus_one_guests
      WHERE Id = ?
    `).get(result.lastInsertRowid);

    return res.status(201).json({
      message: "Plus one created successfully",
      plusOne,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating plus one",
      error,
    });
  }
};

export const updatePlusOne = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const result = db
      .prepare("UPDATE plus_one_guests SET name = ? WHERE Id = ?")
      .run(name, id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Plus one not found",
      });
    }

    const plusOne = db.prepare(`
      SELECT
        Id AS id,
        name,
        guest_id,
        is_coming,
        created_at
      FROM plus_one_guests
      WHERE Id = ?
    `).get(id);

    return res.status(200).json({
      message: "Plus one updated successfully",
      plusOne,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating plus one",
      error,
    });
  }
};

export const deletePlusOne = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = db
      .prepare("DELETE FROM plus_one_guests WHERE Id = ?")
      .run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Plus one not found",
      });
    }

    return res.status(200).json({
      message: "Plus one deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting plus one",
      error,
    });
  }
};