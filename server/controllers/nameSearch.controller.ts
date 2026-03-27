import { Request, Response } from 'express';
import db from "../database/db.ts";

export const searchGuestsByName = async (req:Request,res:Response) => {
    const q = String(req.query.q || '').trim();

    if (!q) {
        return res.json([]);
    }

    try {
        const guests = db.prepare("SELECT * FROM Guests WHERE name LIKE ? ORDER BY name ASC LIMIT 10").all(`%${q}%`);
        return res.json(guests);
    } catch(error){
        res.status(500).json({ message: "Error searching guests", error });
    }
}