import express from 'express';
import { searchHospitals, getAllHospitals, addHospital } from '../controllers/hospitalController.js';
import { getHospitalTrustScores } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Trust score route (as specified in the template)
router.get('/trust-score', getHospitalTrustScores as any);

router.get('/', searchHospitals as any);
router.get('/all', protect as any, getAllHospitals as any);
router.post('/', protect as any, addHospital as any);

export default router;
