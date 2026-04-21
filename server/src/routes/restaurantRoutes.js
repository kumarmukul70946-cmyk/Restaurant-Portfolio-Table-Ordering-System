import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  generateDefaultRestaurants,
} from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

router.post('/generate-defaults', protectAdmin, generateDefaultRestaurants);
router.post('/', protectAdmin, createRestaurant);
router.put('/:id', protectAdmin, updateRestaurant);
router.delete('/:id', protectAdmin, deleteRestaurant);

export default router;
