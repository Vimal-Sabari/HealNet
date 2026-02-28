import express from 'express';
import { searchExperiences } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchExperiences as any);

export default router;
