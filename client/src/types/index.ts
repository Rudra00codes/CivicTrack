export interface IUser {
    _id: string;
    username: string;
    email: string;
    token: string;
}

export interface IIssue {
    _id: string;
    title: string;
    description: string;
    category: string;
    location: {
        type: string;
        coordinates: number[];
    };
    images: string[];
    status: string;
    user: {
        _id: string;
        username: string;
    };
    is_anonymous: boolean;
    upvotes: string[];
    createdAt: string;
    updatedAt: string;
}
