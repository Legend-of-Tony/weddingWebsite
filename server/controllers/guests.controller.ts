import { Request, Response } from 'express';
import db from "../database/db.ts";

export const getAllGuests = async (req:Request,res:Response) => {
    try {
        const guests = await db.prepare('SELECT * FROM Guests').all();
        res.status(200).json({success:true, data:guests });
        console.log(guests);
    }catch(error){
        console.error(error);
    }
}

export const getGuestById = async (req:Request,res:Response) => {
    const {id} = req.params;
    try {
        const guest = await db.prepare('SELECT * FROM Guests WHERE id = ?').get(id);
        if(guest){
            res.status(200).json({success:true, data:guest });
        } else {
            res.status(404).json({message: 'Guest not found'});
        }
    }catch(error){
        console.error(error);
    }
}

export const createGuest = async (req:Request,res:Response) => {
    const {name} = req.body;
    try {
        const newGuest = await db.prepare('INSERT INTO Guests (name) VALUES (?)').run(name);
        res.status(201).json({success:true, data:newGuest})
    }catch(error){
        console.error(error);
    }
}

export const updateGuest = async (req:Request,res:Response) => {
    const {id} = req.params;
    const {name,has_plus_one, is_coming } = req.body;

    try {
        const updatedGuest = await db.prepare('UPDATE Guests SET name = ?, has_plus_one = ?, is_coming = ? where id = ?').run(name, has_plus_one, is_coming, id);
        if (updatedGuest.changes === 0){
            res.status(404).json({message:'Guest not found'})
        } else {
            res.status(200).json({success:true, data:updatedGuest})
        }
    }catch(error){
        console.error(error);
    }
}

export const deleteGuest = async (req:Request, res:Response) => {
    const {id} = req.params;

    try {
        const deletedGuest = await db.prepare('DELETE FROM Guests WHERE id = ?').run(id);
        if (deletedGuest.changes === 0){
            res.status(404).json({message:'Guest not found'})
        } else {
            res.status(200).json({success:true, data:deletedGuest})
        }
    }catch(error){
        console.error(error);
    }
}
