import express from 'express';
import { createBooking, getBookings } from '../controllers/bookingController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', protectAdmin, getBookings);

export default router;
