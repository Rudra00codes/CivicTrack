import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendEmail, emailTemplates } from '../config/email';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            // Generate verification token
            const verificationToken = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            // Save verification token to user
            user.verification_token = verificationToken;
            user.verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            await user.save();

            // Send verification email (don't block registration if email fails)
            try {
                const template = emailTemplates.verifyEmail(user.username, verificationToken);
                await sendEmail(user.email, template);
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError);
            }

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                is_verified: user.is_verified,
                message: 'Registration successful. Please check your email to verify your account.',
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                    expiresIn: '30d',
                }),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password!))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                    expiresIn: '30d',
                }),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Get user profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user!._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Update user profile
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    const { username, email, location, verification_level } = req.body;

    try {
        const user = await User.findById(req.user!._id);

        if (user) {
            // Check if email is already taken by another user
            if (email && email !== user.email) {
                const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
                if (emailExists) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
            }

            // Check if username is already taken by another user
            if (username && username !== user.username) {
                const usernameExists = await User.findOne({ username, _id: { $ne: user._id } });
                if (usernameExists) {
                    return res.status(400).json({ message: 'Username already in use' });
                }
            }

            user.username = username || user.username;
            user.email = email || user.email;
            user.location = location || user.location;
            user.verification_level = verification_level || user.verification_level;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                location: updatedUser.location,
                is_verified: updatedUser.is_verified,
                verification_level: updatedUser.verification_level,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Update user location
export const updateUserLocation = async (req: AuthRequest, res: Response) => {
    const { coordinates } = req.body; // [longitude, latitude]

    try {
        if (!coordinates || coordinates.length !== 2) {
            return res.status(400).json({ message: 'Invalid coordinates format. Expected [longitude, latitude]' });
        }

        const user = await User.findById(req.user!._id);

        if (user) {
            user.location = {
                type: 'Point',
                coordinates: coordinates
            };

            const updatedUser = await user.save();
            res.json({
                message: 'Location updated successfully',
                location: updatedUser.location
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Change password
export const changePassword = async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user!._id);

        if (user && (await bcrypt.compare(currentPassword, user.password!))) {
            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters long' });
            }

            user.password = newPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Current password is incorrect' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
