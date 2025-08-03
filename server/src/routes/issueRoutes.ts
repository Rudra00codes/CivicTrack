import express from 'express';
import { 
    createIssue, 
    getIssues, 
    getIssueById, 
    updateIssueStatus, 
    upvoteIssue, 
    getUserIssues,
    updateIssue,
    deleteIssue,
    getNearbyIssues
} from '../controllers/issueController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getIssues);
router.get('/nearby', getNearbyIssues);
router.get('/user/:userId', getUserIssues);
router.get('/:id', getIssueById);

// Protected routes (require authentication)
router.post('/', protect, createIssue);
router.put('/:id/upvote', protect, upvoteIssue);
router.put('/:id', protect, updateIssue);
router.delete('/:id', protect, deleteIssue);

// Admin routes
router.put('/:id/status', protect, admin, updateIssueStatus);

export default router;
