import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.get('/me', protect as any, getMe as any);

export default router;
