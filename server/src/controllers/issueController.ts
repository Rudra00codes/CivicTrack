import { Response, Request } from 'express';
import mongoose from 'mongoose';
import Issue from '../models/Issue';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendIssueStatusNotification } from './emailController';

export const createIssue = async (req: AuthRequest, res: Response) => {
    const { title, description, category, location, images, is_anonymous } = req.body;

    try {
        console.log('=== Issue Creation Debug ===');
        console.log('Received category:', category);
        console.log('Category type:', typeof category);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('========================');

        const issue = new Issue({
            title,
            description,
            category,
            location,
            images,
            is_anonymous,
            user: req.user!._id,
        });

        const createdIssue = await issue.save();
        res.status(201).json(createdIssue);
    } catch (error: any) {
        console.error('Issue creation error:', error.message);
        if (error.name === 'ValidationError') {
            console.error('Validation errors:', error.errors);
        }
        res.status(500).json({ message: error.message });
    }
};

export const getIssues = async (req: Request, res: Response) => {
    const { lat, lng, radius = 5000, category, status, page = 1, limit = 10 } = req.query;

    try {
        const query: any = {};

        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
                    },
                    $maxDistance: parseInt(radius as string),
                },
            };
        }

        if (category) {
            query.category = category;
        }

        if (status) {
            query.status = status;
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const issues = await Issue.find(query)
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Issue.countDocuments(query);

        res.json({
            issues,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalIssues: total,
                hasNext: pageNum < Math.ceil(total / limitNum),
                hasPrev: pageNum > 1
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getIssueById = async (req: Request, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id).populate('user', 'username');
        if (issue) {
            res.json(issue);
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateIssueStatus = async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    try {
        const issue = await Issue.findById(req.params.id);

        if (issue) {
            const oldStatus = issue.status;
            issue.status = status;
            const updatedIssue = await issue.save();

            // Send notification if status changed
            if (oldStatus !== status) {
                // Don't await this to avoid blocking the response
                sendIssueStatusNotification(req.params.id, status).catch(error => {
                    console.error('Failed to send status notification:', error);
                });
            }

            res.json(updatedIssue);
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const upvoteIssue = async (req: AuthRequest, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id);
        
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        const userId = new mongoose.Types.ObjectId(req.user!._id);
        const hasUpvoted = issue.upvotes.some(id => id.toString() === userId.toString());

        if (hasUpvoted) {
            // Remove upvote
            issue.upvotes = issue.upvotes.filter(id => id.toString() !== userId.toString());
        } else {
            // Add upvote
            issue.upvotes.push(userId);
        }

        const updatedIssue = await issue.save();
        res.json(updatedIssue);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Get issues by user ID
export const getUserIssues = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    try {
        const query: any = { user: userId };
        
        if (status) {
            query.status = status;
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const issues = await Issue.find(query)
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Issue.countDocuments(query);

        res.json({
            issues,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalIssues: total,
                hasNext: pageNum < Math.ceil(total / limitNum),
                hasPrev: pageNum > 1
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Update issue details
export const updateIssue = async (req: AuthRequest, res: Response) => {
    const { title, description, category, images } = req.body;

    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if user owns the issue or is admin
        if (issue.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this issue' });
        }

        issue.title = title || issue.title;
        issue.description = description || issue.description;
        issue.category = category || issue.category;
        issue.images = images || issue.images;

        const updatedIssue = await issue.save();
        res.json(updatedIssue);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Delete issue
export const deleteIssue = async (req: AuthRequest, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if user owns the issue or is admin
        if (issue.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this issue' });
        }

        await Issue.findByIdAndDelete(req.params.id);
        res.json({ message: 'Issue deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Get nearby issues (enhanced location service)
export const getNearbyIssues = async (req: Request, res: Response) => {
    const { lat, lng, radius = 1000 } = req.query;

    try {
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const issues = await Issue.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
                    },
                    $maxDistance: parseInt(radius as string),
                },
            },
        })
        .populate('user', 'username')
        .select('title category status location upvotes createdAt')
        .sort({ createdAt: -1 })
        .limit(20);

        res.json(issues);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
