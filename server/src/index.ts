
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import issueRoutes from './routes/issueRoutes';
import flagRoutes from './routes/flagRoutes';
import statisticsRoutes from './routes/statisticsRoutes';
import uploadRoutes from './routes/uploadRoutes';
import emailRoutes from './routes/emailRoutes';
import configRoutes from './routes/configRoutes';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/config', configRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        services: {
            database: 'Connected',
            email: process.env.SMTP_USER ? 'Configured' : 'Not configured',
            fileUpload: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
