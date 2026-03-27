import express from 'express';
import { getAllPlusOnes, getPlusOneById, createPlusOne, updatePlusOne, deletePlusOne } from '../controllers/guestPlusOne.controller';

const router = express.Router();

router.get('/', getAllPlusOnes);

router.get('/:id', getPlusOneById);

router.post('/', createPlusOne);

router.put('/:id', updatePlusOne);

router.delete('/:id', deletePlusOne);

export default router;