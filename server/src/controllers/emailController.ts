import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendEmail, emailTemplates } from '../config/email';
import User from '../models/User';
import Issue from '../models/Issue';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Send email verification
export const sendEmailVerification = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user!._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Generate verification token
        const verificationToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        // Save token to user
        user.verification_token = verificationToken;
        user.verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        // Send verification email
        const template = emailTemplates.verifyEmail(user.username, verificationToken);
        await sendEmail(user.email, template);

        res.json({ message: 'Verification email sent successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Verify email
export const verifyEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Verification token is required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Check if token matches and hasn't expired
        if (user.verification_token !== token) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }

        if (user.verification_token_expires && user.verification_token_expires < new Date()) {
            return res.status(400).json({ message: 'Verification token has expired' });
        }

        // Update user verification status
        user.is_verified = true;
        user.verification_token = undefined;
        user.verification_token_expires = undefined;
        await user.save();

        // Send welcome email
        const welcomeTemplate = emailTemplates.welcomeEmail(user.username);
        await sendEmail(user.email, welcomeTemplate);

        res.json({ message: 'Email verified successfully' });
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid verification token' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Send password reset email
export const sendPasswordReset = async (req: AuthRequest, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Save token to user
        user.password_reset_token = resetToken;
        user.password_reset_expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Send reset email
        const template = emailTemplates.resetPassword(user.username, resetToken);
        await sendEmail(user.email, template);

        res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Reset password
export const resetPassword = async (req: AuthRequest, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({
            password_reset_token: token,
            password_reset_expires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update password
        user.password = newPassword; // This will be hashed by the pre-save middleware
        user.password_reset_token = undefined;
        user.password_reset_expires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Send issue status notification
export const sendIssueStatusNotification = async (issueId: string, newStatus: string) => {
    try {
        const issue = await Issue.findById(issueId).populate('user', 'username email');
        
        if (!issue || !issue.user) {
            throw new Error('Issue or user not found');
        }

        const user = issue.user as any;
        
        // Only send notification if user wants to receive them
        // You can add a notification preference field to User model
        const template = emailTemplates.issueStatusUpdate(
            user.username,
            issue.title,
            newStatus,
            issueId
        );

        await sendEmail(user.email, template);
        console.log(`Status notification sent for issue ${issueId} to ${user.email}`);
    } catch (error) {
        console.error('Error sending issue status notification:', error);
        // Don't throw error to avoid breaking the main operation
    }
};

// Test email functionality
export const testEmail = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user!._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const template = {
            subject: 'CivicTrack Test Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Test Email</h2>
                    <p>Hello ${user.username},</p>
                    <p>This is a test email to verify that the CivicTrack email system is working correctly.</p>
                    <p>Sent at: ${new Date().toLocaleString()}</p>
                </div>
            `
        };

        await sendEmail(user.email, template);
        res.json({ message: 'Test email sent successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
