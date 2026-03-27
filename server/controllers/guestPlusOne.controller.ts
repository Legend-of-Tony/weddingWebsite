import { Request, Response } from 'express';
import db from "../database/db.ts";

export const getAllPlusOnes = async (req:Request,res:Response) => {
    try {
        const plusOnes = await db.prepare("SELECT * FROM plus_one_guests").all();
        res.json(plusOnes)
    } catch (error) {
        res.status(500).json({ message: "Error fetching plus ones", error })
    }
}

export const getPlusOneById = async (req:Request,res:Response) => {
    const {id} = req.params;

    try{
        const plusOne = await db.prepare("SELECT * FROM plus_one_guests WHERE id = ?").get(id);
        if (plusOne) {
            res.json(plusOne);
        } else {
            res.status(404).json({ message: "Plus one not found" });
        }
    }catch(error){
        res.status(500).json({ message: "Error fetching plus one", error })
    }
}

export const createPlusOne = async (req:Request,res:Response) => {
    
    const {name} = req.body;
    const guest = db.prepare('SELECT Id, has_plus_one FROM Guests WHERE name = ?').get(name) as {Id:number, has_plus_one:number} | undefined;
   
    if (!name) {
    return res.status(400).json({ message: 'Guest name is required' });
  }

    if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
    }
    
    if (!guest.has_plus_one) {
        return res.status(400).json({ message: "Guest does not have a plus one" });
    } 

    try {
        const newPluseOne = await db.prepare("INSERT INTO plus_one_guests (guest_id) VALUES (?)").run(guest.Id)
        res.status(201).json({ message: "Plus one created successfully", plusOne: newPluseOne });
    } catch (error) {
        res.status(500).json({ message: "Error creating plus one", error });
    }
}

export const updatePlusOne = async (req:Request,res:Response) => {
    const {id} = req.params;
    const {name} = req.body;

    try {
        const result = await db.prepare("UPDATE plus_one_guests SET name = ? WHERE id = ?").run(name, id);
        if (result.changes > 0) {
            res.json({ message: "Plus one updated successfully" });
        } else {
            res.status(404).json({ message: "Plus one not found" });
        }
    }catch(error){
        res.status(500).json({ message: "Error updating plus one", error })
    }
}

export const deletePlusOne = async (req:Request,res:Response) => {
    const {id} = req.params;

    try {
        const result = await db.prepare("DELETE FROM plus_one_guests WHERE id = ?").run(id);
        if (result.changes > 0) {
            res.json({ message: "Plus one deleted successfully" });
        } else {
            res.status(404).json({ message: "Plus one not found" });
        }
    }catch(error){
        res.status(500).json({ message: "Error deleting plus one", error })
    }
}
