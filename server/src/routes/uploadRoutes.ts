import express from 'express';
import {
    uploadImage,
    uploadMultipleImages,
    deleteUploadedImage,
    getUploadStats
} from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Protected routes (require authentication)
router.get('/stats', protect, getUploadStats);
router.post('/single', protect, upload.single('image'), uploadImage);
router.post('/multiple', protect, upload.array('images', 5), uploadMultipleImages);
router.delete('/:publicId', protect, deleteUploadedImage);

export default router;
