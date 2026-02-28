import express from 'express';
import {
    createExperience, getExperiences, getExperienceById,
    getExperiencesFeed, toggleHelpful, getMyExperiences, getCommunityFeed
} from '../controllers/experienceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific named routes must come before /:id
router.get('/feed', getExperiencesFeed as any);
router.get('/me', protect as any, getMyExperiences as any);
router.get('/community', getCommunityFeed as any);

router.route('/')
    .post(protect as any, createExperience as any)
    .get(getExperiences as any);

router.post('/:id/helpful', protect as any, toggleHelpful as any);
router.get('/:id', getExperienceById as any);

export default router;
