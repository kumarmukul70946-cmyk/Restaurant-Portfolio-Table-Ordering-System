import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import { getMe, getDashboardMetrics } from '../controllers/adminController.js';
import { createRestaurant } from '../controllers/restaurantController.js';

const router = express.Router();
router.use(protectAdmin);
router.get('/me', getMe);
router.get('/dashboard', getDashboardMetrics);
router.post('/restaurant', createRestaurant);
export default router;
