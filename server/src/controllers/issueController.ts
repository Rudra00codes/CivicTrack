import { Response, Request } from 'express';
import mongoose from 'mongoose';
import Issue from '../models/Issue';
import { AuthRequest } from '../middleware/authMiddleware';

export const createIssue = async (req: AuthRequest, res: Response) => {
    const { title, description, category, location, images, is_anonymous } = req.body;

    try {
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
        res.status(500).json({ message: error.message });
    }
};

export const getIssues = async (req: Request, res: Response) => {
    const { lat, lng, radius = 5000, category, status } = req.query;

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

        const issues = await Issue.find(query).populate('user', 'username');
        res.json(issues);
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
            issue.status = status;
            const updatedIssue = await issue.save();
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
