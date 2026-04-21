import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  generateDefaultTables,
} from '../controllers/tableController.js';

const router = express.Router();

router.get('/', getTables);
router.get('/:id', getTableById);

router.post('/generate-defaults', protectAdmin, generateDefaultTables);
router.post('/', protectAdmin, createTable);
router.put('/:id', protectAdmin, updateTable);
router.delete('/:id', protectAdmin, deleteTable);

export default router;
