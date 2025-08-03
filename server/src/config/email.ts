import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Email templates
export const emailTemplates = {
    verifyEmail: (username: string, verificationToken: string) => ({
        subject: 'Verify Your CivicTrack Account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to CivicTrack!</h2>
                <p>Hello ${username},</p>
                <p>Thank you for signing up for CivicTrack. Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}" 
                       style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}</p>
                <p>This verification link will expire in 24 hours.</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 14px;">
                    If you didn't create a CivicTrack account, please ignore this email.
                </p>
            </div>
        `
    }),

    resetPassword: (username: string, resetToken: string) => ({
        subject: 'Reset Your CivicTrack Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Password Reset Request</h2>
                <p>Hello ${username},</p>
                <p>You requested to reset your password for your CivicTrack account. Click the button below to reset it:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
                       style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${process.env.FRONTEND_URL}/reset-password?token=${resetToken}</p>
                <p>This reset link will expire in 1 hour.</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 14px;">
                    If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                </p>
            </div>
        `
    }),

    issueStatusUpdate: (username: string, issueTitle: string, newStatus: string, issueId: string) => ({
        subject: `Issue Status Updated: ${issueTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #059669;">Issue Status Update</h2>
                <p>Hello ${username},</p>
                <p>Your reported issue has been updated:</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #374151;">${issueTitle}</h3>
                    <p><strong>New Status:</strong> <span style="color: #059669; text-transform: capitalize;">${newStatus}</span></p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/issues/${issueId}" 
                       style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        View Issue Details
                    </a>
                </div>
                <p>Thank you for helping make your community better!</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 14px;">
                    You're receiving this email because you reported this issue on CivicTrack.
                </p>
            </div>
        `
    }),

    welcomeEmail: (username: string) => ({
        subject: 'Welcome to CivicTrack!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to CivicTrack!</h2>
                <p>Hello ${username},</p>
                <p>Your email has been verified successfully! Welcome to CivicTrack, your platform for civic engagement and community improvement.</p>
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1e40af;">What you can do with CivicTrack:</h3>
                    <ul style="color: #374151;">
                        <li>Report civic issues in your community</li>
                        <li>Track the status of your reported issues</li>
                        <li>Upvote issues that matter to you</li>
                        <li>Engage with your local government</li>
                    </ul>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/dashboard" 
                       style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Get Started
                    </a>
                </div>
                <p>Thank you for joining our community!</p>
            </div>
        `
    })
};

// Send email function
export const sendEmail = async (to: string, template: { subject: string; html: string }) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"CivicTrack" <${process.env.SMTP_USER}>`,
            to: to,
            subject: template.subject,
            html: template.html,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Bulk email function for notifications
export const sendBulkEmail = async (recipients: string[], template: { subject: string; html: string }) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"CivicTrack" <${process.env.SMTP_USER}>`,
            bcc: recipients, // Use BCC to hide other recipients
            subject: template.subject,
            html: template.html,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Bulk email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending bulk email:', error);
        throw error;
    }
};
