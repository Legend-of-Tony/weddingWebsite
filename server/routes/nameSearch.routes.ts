import express from 'express';
import { searchGuestsByName } from '../controllers/nameSearch.controller';

const router = express.Router();

router.get('/search', searchGuestsByName);

export default router;