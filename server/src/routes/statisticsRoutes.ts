import express from 'express';
import {
    getDashboardStats,
    getTrendData,
    getLocationStats,
    getUserActivityStats
} from '../controllers/statisticsController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes (require authentication)
router.get('/user', protect, getUserActivityStats);
router.get('/location', protect, getLocationStats);

// Admin routes
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/trends', protect, admin, getTrendData);

export default router;
