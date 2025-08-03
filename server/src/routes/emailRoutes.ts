import express from 'express';
import {
    sendEmailVerification,
    verifyEmail,
    sendPasswordReset,
    resetPassword,
    testEmail
} from '../controllers/emailController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (no authentication required)
router.post('/verify', verifyEmail);
router.post('/forgot-password', sendPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.post('/send-verification', protect, sendEmailVerification);
router.post('/test', protect, testEmail);

export default router;
