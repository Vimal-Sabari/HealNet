import { Request, Response } from 'express';
import Report from '../models/Report.js';
import Experience from '../models/Experience.js';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req: any, res: Response): Promise<void> => {
    try {
        const { experienceId, reason, details } = req.body;

        const report = await Report.create({
            experienceId,
            reporterId: req.user._id,
            reason,
            details
        });

        res.status(201).json(report);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
export const getReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await Report.find()
            .populate('reporterId', 'name email')
            .populate('experienceId', 'title condition hospital')
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private/Admin
export const updateReportStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) {
            res.status(404).json({ message: 'Report not found' });
            return;
        }

        report.status = status;
        await report.save();

        res.status(200).json(report);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
