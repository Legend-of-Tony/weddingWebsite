import express from "express";
import { getAllGuests, getGuestById, createGuest, updateGuest, deleteGuest } from "../controllers/guests.controller";


const router = express.Router();

router.get('/', getAllGuests);

router.get('/:id', getGuestById);

router.post('/', createGuest);

router.put('/:id', updateGuest);

router.delete('/:id', deleteGuest);

export default router;