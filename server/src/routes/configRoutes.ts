import express from 'express';
import {
    getCategories,
    getStatusValues,
    getAppConfig
} from '../controllers/configController';

const router = express.Router();

// Public routes (no authentication required for config)
router.get('/categories', getCategories);
router.get('/statuses', getStatusValues);
router.get('/app', getAppConfig);

export default router;
