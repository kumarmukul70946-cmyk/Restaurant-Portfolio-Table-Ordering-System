import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import {
  createOrder,
  getOrdersByTable,
  getAllOrders,
  updateOrderStatus,
  getOrderAnalytics,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/table/:tableId', getOrdersByTable);

router.get('/admin/all', protectAdmin, getAllOrders);
router.patch('/admin/:id/status', protectAdmin, updateOrderStatus);
router.get('/admin/analytics', protectAdmin, getOrderAnalytics);

export default router;
