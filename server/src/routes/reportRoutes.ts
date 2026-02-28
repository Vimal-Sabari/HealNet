import express from 'express';
import { createReport, getReports, updateReportStatus } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect as any, createReport as any);
router.get('/', protect as any, admin as any, getReports as any);
router.put('/:id', protect as any, admin as any, updateReportStatus as any);

export default router;
