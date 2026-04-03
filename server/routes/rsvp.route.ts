import express from 'express';
import { submitRsvp } from '../controllers/rsvp.controller';

const router = express.Router();

router.put('/', submitRsvp);

export default router;

