import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { deleteImage, extractPublicId } from '../config/cloudinary';

// Upload single image
export const uploadImage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // The file is automatically uploaded to Cloudinary by multer middleware
        const imageUrl = req.file.path;
        const publicId = extractPublicId(imageUrl);

        res.status(201).json({
            message: 'Image uploaded successfully',
            imageUrl,
            publicId,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Upload multiple images
export const uploadMultipleImages = async (req: AuthRequest, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No image files provided' });
        }

        const uploadedImages = files.map(file => ({
            imageUrl: file.path,
            publicId: extractPublicId(file.path),
            originalName: file.originalname,
            size: file.size
        }));

        res.status(201).json({
            message: `${files.length} images uploaded successfully`,
            images: uploadedImages,
            totalSize: files.reduce((total, file) => total + file.size, 0)
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete image
export const deleteUploadedImage = async (req: AuthRequest, res: Response) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({ message: 'Public ID is required' });
        }

        const result = await deleteImage(publicId);

        if (result.result === 'ok') {
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get upload stats for user
export const getUploadStats = async (req: AuthRequest, res: Response) => {
    try {
        // This would typically query your database for user's upload history
        // For now, we'll return basic info
        res.json({
            userId: req.user!._id,
            message: 'Upload stats retrieved successfully',
            limits: {
                maxFileSize: '5MB',
                allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                maxFilesPerUpload: 5
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
