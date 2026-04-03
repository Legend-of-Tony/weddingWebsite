import type { Request, Response } from "express";
import db from "../database/db.ts";


type AdditionalGuestPayload = {
  id: number | null;
  name: string;
};

type SubmitRsvpBody = {
  guestId: number;
  isComing: number;
  partySize: number;
  additionalGuests: AdditionalGuestPayload[];
};

export const submitRsvp = (req: Request, res: Response) => {
  const {
    guestId,
    isComing,
    partySize,
    additionalGuests = [],
  } = req.body as SubmitRsvpBody;

  if (!guestId || (isComing !== 0 && isComing !== 1)) {
    return res.status(400).json({
      error: "Invalid RSVP payload.",
    });
  }

  if (typeof partySize !== "number" || partySize < 1) {
    return res.status(400).json({
      error: "Invalid party size.",
    });
  }

  if (!Array.isArray(additionalGuests)) {
    return res.status(400).json({
      error: "Invalid additional guests.",
    });
  }

  try {
    const transaction = db.transaction(() => {
      const updateGuest = db.prepare(`
        UPDATE Guests
        SET is_coming = ?, updated_at = datetime('now','localtime')
        WHERE id = ?
      `);

      const deleteOldPlusOnes = db.prepare(`
        DELETE FROM plus_one_guests
        WHERE guest_id = ?
      `);

      const insertPlusOne = db.prepare(`
        INSERT INTO plus_one_guests (guest_id, name, is_coming)
        VALUES (?, ?, ?)
      `);

      const updateResult = updateGuest.run(isComing, guestId);

      if (updateResult.changes === 0) {
        throw new Error("Guest not found.");
      }

      deleteOldPlusOnes.run(guestId);

      if (isComing === 1) {
        for (const extraGuest of additionalGuests) {
          if (!extraGuest.name || !extraGuest.name.trim()) {
            throw new Error("Additional guest name is required.");
          }

          insertPlusOne.run(guestId, extraGuest.name.trim(), 1);
        }
      }
    });

    transaction();

    return res.status(200).json({
      success: true,
      message: "RSVP submitted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to submit RSVP.",
    });
  }
};


