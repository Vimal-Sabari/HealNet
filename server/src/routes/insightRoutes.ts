import express from 'express';
import { saveInsight, getMySavedInsights, deleteInsight } from '../controllers/insightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', protect as any, saveInsight as any);
router.get('/me', protect as any, getMySavedInsights as any);
router.delete('/:id', protect as any, deleteInsight as any);

export default router;
