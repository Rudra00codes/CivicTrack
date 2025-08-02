import express from 'express';
import { createIssue, getIssues, getIssueById, updateIssueStatus, upvoteIssue } from '../controllers/issueController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createIssue).get(getIssues);
router.route('/:id').get(getIssueById);
router.route('/:id/status').put(protect, admin, updateIssueStatus);
router.route('/:id/upvote').put(protect, upvoteIssue);

export default router;
