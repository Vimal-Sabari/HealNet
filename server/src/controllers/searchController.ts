import { Request, Response } from 'express';
import Experience from '../models/Experience.js';

// @desc    Search experiences
// @route   GET /api/search
// @access  Public
export const searchExperiences = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, condition, hospital, outcome, sort } = req.query;

        let query: any = {};

        // Text Search
        if (q) {
            query.$text = { $search: q as string };
        }

        // Filters
        if (condition) {
            query.condition = { $regex: condition, $options: 'i' };
        }
        if (hospital) {
            query.hospital = { $regex: hospital, $options: 'i' };
        }
        if (outcome) {
            query.outcome = outcome;
        }

        // Sorting
        let sortOption: any = { createdAt: -1 }; // Default: Newest first
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'relevance' && q) {
            sortOption = { score: { $meta: 'textScore' } };
        }

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const total = await Experience.countDocuments(query);
        const experiences = await Experience.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name');

        res.status(200).json({
            results: experiences,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
