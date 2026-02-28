import { Request, Response } from 'express';
import SavedInsight from '../models/SavedInsight.js';
import Experience from '../models/Experience.js';

// @desc    Save an insight (experience)
// @route   POST /api/insights/save
// @access  Private
export const saveInsight = async (req: any, res: Response): Promise<void> => {
    try {
        const { experienceId } = req.body;
        const userId = req.user.id;

        const existing = await SavedInsight.findOne({ userId, experienceId });
        if (existing) {
            // Already saved — unsave it (toggle)
            await SavedInsight.deleteOne({ userId, experienceId });
            res.status(200).json({ saved: false });
            return;
        }

        await SavedInsight.create({ userId, experienceId });
        res.status(201).json({ saved: true });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get current user's saved insights
// @route   GET /api/insights/me
// @access  Private
export const getMySavedInsights = async (req: any, res: Response): Promise<void> => {
    try {
        const saved = await SavedInsight.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'experienceId',
                populate: { path: 'userId', select: 'name isAnonymous' }
            });

        res.status(200).json(saved.map(s => s.experienceId));
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a saved insight
// @route   DELETE /api/insights/:id
// @access  Private
export const deleteInsight = async (req: any, res: Response): Promise<void> => {
    try {
        await SavedInsight.deleteOne({ userId: req.user.id, experienceId: req.params.id });
        res.status(200).json({ saved: false });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
