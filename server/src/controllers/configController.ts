import { Request, Response } from 'express';

// Get available categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = [
            "Roads and Transportation",
            "Street Lighting", 
            "Water Supply",
            "Waste Management",
            "Public Safety",
            "Parks and Recreation",
            "Building and Construction",
            "Noise Complaints",
            "Other"
        ];

        res.json({
            success: true,
            categories: categories,
            count: categories.length
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get available status values
export const getStatusValues = async (req: Request, res: Response) => {
    try {
        const statuses = [
            "Reported",
            "In Progress", 
            "Resolved"
        ];

        res.json({
            success: true,
            statuses: statuses,
            count: statuses.length
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get application configuration
export const getAppConfig = async (req: Request, res: Response) => {
    try {
        res.json({
            success: true,
            config: {
                categories: [
                    "Roads and Transportation",
                    "Street Lighting", 
                    "Water Supply",
                    "Waste Management",
                    "Public Safety",
                    "Parks and Recreation",
                    "Building and Construction",
                    "Noise Complaints",
                    "Other"
                ],
                statuses: [
                    "Reported",
                    "In Progress", 
                    "Resolved"
                ],
                priorities: [
                    "Low",
                    "Medium",
                    "High",
                    "Critical"
                ],
                roles: [
                    "citizen",
                    "admin", 
                    "municipal_worker"
                ]
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
