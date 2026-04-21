import express from 'express';
import { loginAdmin } from '../controllers/adminController.js';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/admin/login', loginAdmin);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
