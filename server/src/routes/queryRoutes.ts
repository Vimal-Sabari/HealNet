import express from 'express';
import { analyzeSymptoms } from '../controllers/queryController.js';

const router = express.Router();

router.post('/', analyzeSymptoms as any);

export default router;
