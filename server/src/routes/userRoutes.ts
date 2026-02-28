import express from 'express';
import { getUserProfile, toggleAnonymousMode } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect as any, getUserProfile as any);
router.patch('/anonymous-mode', protect as any, toggleAnonymousMode as any);

export default router;
