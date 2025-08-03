import express from 'express';
import {
    flagIssue,
    getAllFlags,
    reviewFlag,
    getIssueFlagsCount,
    getUserFlags
} from '../controllers/flagController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes (require authentication)
router.post('/issues/:id/flag', protect, flagIssue);
router.get('/user', protect, getUserFlags);
router.get('/issues/:id/count', protect, getIssueFlagsCount);

// Admin routes
router.get('/admin', protect, admin, getAllFlags);
router.put('/admin/:id/review', protect, admin, reviewFlag);

export default router;
