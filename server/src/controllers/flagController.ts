import { Response } from 'express';
import Flag from '../models/Flag';
import Issue from '../models/Issue';
import { AuthRequest } from '../middleware/authMiddleware';

// Flag an issue
export const flagIssue = async (req: AuthRequest, res: Response) => {
    const { reason, description } = req.body;
    const { id: issueId } = req.params;

    try {
        // Check if issue exists
        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if user has already flagged this issue
        const existingFlag = await Flag.findOne({
            issue: issueId,
            flagged_by: req.user!._id
        });

        if (existingFlag) {
            return res.status(400).json({ message: 'You have already flagged this issue' });
        }

        const flag = new Flag({
            issue: issueId,
            flagged_by: req.user!._id,
            reason,
            description
        });

        const savedFlag = await flag.save();
        await savedFlag.populate(['issue', 'flagged_by']);

        res.status(201).json(savedFlag);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get all flags (Admin only)
export const getAllFlags = async (req: AuthRequest, res: Response) => {
    const { status = 'pending', page = 1, limit = 10 } = req.query;

    try {
        const query: any = {};
        
        if (status !== 'all') {
            query.status = status;
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const flags = await Flag.find(query)
            .populate('issue', 'title description category')
            .populate('flagged_by', 'username email')
            .populate('reviewed_by', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Flag.countDocuments(query);

        res.json({
            flags,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalFlags: total,
                hasNext: pageNum < Math.ceil(total / limitNum),
                hasPrev: pageNum > 1
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Review a flag (Admin only)
export const reviewFlag = async (req: AuthRequest, res: Response) => {
    const { action, review_notes } = req.body; // action: 'approved' | 'rejected'
    const { id: flagId } = req.params;

    try {
        const flag = await Flag.findById(flagId);
        if (!flag) {
            return res.status(404).json({ message: 'Flag not found' });
        }

        if (flag.status !== 'pending') {
            return res.status(400).json({ message: 'Flag has already been reviewed' });
        }

        flag.status = action === 'approve' ? 'approved' : 'rejected';
        flag.reviewed_by = req.user!._id as any;
        flag.reviewed_at = new Date();
        flag.review_notes = review_notes;

        // If flag is approved, we might want to take action on the issue
        if (action === 'approve') {
            const issue = await Issue.findById(flag.issue);
            if (issue) {
                // Example actions: remove the issue, mark as inappropriate, etc.
                // This depends on your business logic
                issue.status = 'closed'; // or 'removed', 'flagged', etc.
                await issue.save();
            }
        }

        const updatedFlag = await flag.save();
        await updatedFlag.populate(['issue', 'flagged_by', 'reviewed_by']);

        res.json(updatedFlag);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get flags for a specific issue
export const getIssueFlagsCount = async (req: AuthRequest, res: Response) => {
    const { id: issueId } = req.params;

    try {
        const flagCount = await Flag.countDocuments({ 
            issue: issueId,
            status: { $in: ['pending', 'approved'] }
        });

        res.json({ issueId, flagCount });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's flags
export const getUserFlags = async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const flags = await Flag.find({ flagged_by: req.user!._id })
            .populate('issue', 'title category status')
            .populate('reviewed_by', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Flag.countDocuments({ flagged_by: req.user!._id });

        res.json({
            flags,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalFlags: total,
                hasNext: pageNum < Math.ceil(total / limitNum),
                hasPrev: pageNum > 1
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
