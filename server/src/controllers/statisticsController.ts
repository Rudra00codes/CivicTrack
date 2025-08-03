import { Response } from 'express';
import Issue from '../models/Issue';
import User from '../models/User';
import Flag from '../models/Flag';
import { AuthRequest } from '../middleware/authMiddleware';

// Get dashboard statistics
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        // Total counts
        const totalIssues = await Issue.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalFlags = await Flag.countDocuments();

        // Issue status breakdown
        const issuesByStatus = await Issue.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Issues by category
        const issuesByCategory = await Issue.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentIssues = await Issue.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        const recentUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Most active users (by issue count)
        const topReporters = await Issue.aggregate([
            {
                $group: {
                    _id: '$user',
                    issueCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    username: '$user.username',
                    issueCount: 1
                }
            },
            {
                $sort: { issueCount: -1 }
            },
            {
                $limit: 5
            }
        ]);

        // Issues resolution rate
        const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
        const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;

        res.json({
            overview: {
                totalIssues,
                totalUsers,
                totalFlags,
                resolutionRate: Math.round(resolutionRate * 100) / 100
            },
            issueBreakdown: {
                byStatus: issuesByStatus,
                byCategory: issuesByCategory
            },
            recentActivity: {
                newIssues: recentIssues,
                newUsers: recentUsers
            },
            topReporters
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get trend data
export const getTrendData = async (req: AuthRequest, res: Response) => {
    const { period = '30', type = 'issues' } = req.query;

    try {
        const days = parseInt(period as string);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        let model;
        switch (type) {
            case 'users':
                model = User;
                break;
            case 'flags':
                model = Flag;
                break;
            default:
                model = Issue;
        }

        const trendData = await model.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                    '_id.day': 1
                }
            }
        ]);

        // Fill in missing dates with 0 counts
        const filledData = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            
            const existingData = trendData.find(item => 
                item._id.year === date.getFullYear() &&
                item._id.month === date.getMonth() + 1 &&
                item._id.day === date.getDate()
            );

            filledData.push({
                date: date.toISOString().split('T')[0],
                count: existingData ? existingData.count : 0
            });
        }

        res.json({
            period: `${days} days`,
            type,
            data: filledData
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get location-based statistics
export const getLocationStats = async (req: AuthRequest, res: Response) => {
    const { lat, lng, radius = 5000 } = req.query;

    try {
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const centerPoint = {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
        };

        // Issues within radius
        const nearbyIssues = await Issue.find({
            location: {
                $near: {
                    $geometry: centerPoint,
                    $maxDistance: parseInt(radius as string)
                }
            }
        });

        // Statistics for nearby issues
        const statusBreakdown: { [key: string]: number } = {};
        const categoryBreakdown: { [key: string]: number } = {};
        
        nearbyIssues.forEach(issue => {
            // Status breakdown
            statusBreakdown[issue.status] = (statusBreakdown[issue.status] || 0) + 1;
            
            // Category breakdown
            categoryBreakdown[issue.category] = (categoryBreakdown[issue.category] || 0) + 1;
        });

        // Get most reported location (approximate)
        const hotspots = await Issue.aggregate([
            {
                $match: {
                    location: {
                        $near: {
                            $geometry: centerPoint,
                            $maxDistance: parseInt(radius as string)
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        // Group by approximate coordinates (rounded to reduce precision)
                        lat: { $round: [{ $arrayElemAt: ['$location.coordinates', 1] }, 3] },
                        lng: { $round: [{ $arrayElemAt: ['$location.coordinates', 0] }, 3] }
                    },
                    count: { $sum: 1 },
                    issues: { $push: '$$ROOT' }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);

        res.json({
            location: {
                latitude: parseFloat(lat as string),
                longitude: parseFloat(lng as string),
                radius: parseInt(radius as string)
            },
            summary: {
                totalIssues: nearbyIssues.length,
                statusBreakdown,
                categoryBreakdown
            },
            hotspots: hotspots.map(spot => ({
                coordinates: {
                    lat: spot._id.lat,
                    lng: spot._id.lng
                },
                issueCount: spot.count
            }))
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get user activity statistics
export const getUserActivityStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!._id;

        // User's issues
        const userIssues = await Issue.find({ user: userId });
        const issuesByStatus: { [key: string]: number } = {};
        userIssues.forEach(issue => {
            issuesByStatus[issue.status] = (issuesByStatus[issue.status] || 0) + 1;
        });

        // User's flags
        const userFlags = await Flag.countDocuments({ flagged_by: userId });

        // User's upvotes given
        const upvotesGiven = await Issue.countDocuments({
            upvotes: userId
        });

        // Total upvotes received on user's issues
        const upvotesReceived = userIssues.reduce((total, issue) => total + issue.upvotes.length, 0);

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentIssues = await Issue.countDocuments({
            user: userId,
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            issuesReported: {
                total: userIssues.length,
                byStatus: issuesByStatus,
                recent: recentIssues
            },
            community: {
                flagsSubmitted: userFlags,
                upvotesGiven,
                upvotesReceived
            },
            engagement: {
                totalUpvotesReceived: upvotesReceived,
                averageUpvotesPerIssue: userIssues.length > 0 ? Math.round((upvotesReceived / userIssues.length) * 100) / 100 : 0
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
