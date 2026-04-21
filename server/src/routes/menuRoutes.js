import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setSpecialOfTheDay,
} from '../controllers/menuController.js';

const router = express.Router();

router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

router.post('/', protectAdmin, upload.single('image'), createMenuItem);
router.put('/:id', protectAdmin, upload.single('image'), updateMenuItem);
router.delete('/:id', protectAdmin, deleteMenuItem);
router.patch('/:id/special', protectAdmin, setSpecialOfTheDay);

export default router;
