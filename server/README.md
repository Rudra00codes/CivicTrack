# CivicTrack Server

A comprehensive backend API for civic issue reporting and management.

## 🚀 Features Implemented

### ✅ Core Features
- **User Authentication** - JWT-based auth with role management
- **Issue Management** - Full CRUD operations with geospatial queries
- **File Upload System** - Cloudinary integration with image optimization
- **Email System** - Verification, password reset, and notifications
- **Flagging System** - Community moderation for inappropriate content
- **Analytics & Statistics** - Comprehensive dashboard and trend analysis
- **User Profile Management** - Complete profile and location management

### 🔧 Technical Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: Cloudinary with multer
- **Email**: Nodemailer with HTML templates
- **Geospatial**: MongoDB 2dsphere indexing

## 📦 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build Project**
   ```bash
   npm run build
   ```

4. **Seed Test Data**
   ```bash
   npm run seed-full
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Issues
- `GET /api/issues` - List issues with filters
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get issue details
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `GET /api/issues/user/:userId` - Get user's issues
- `GET /api/issues/nearby` - Get nearby issues

### File Upload
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images
- `DELETE /api/upload/:publicId` - Delete image

### Email System
- `POST /api/email/send-verification` - Send verification email
- `POST /api/email/verify` - Verify email address
- `POST /api/email/forgot-password` - Request password reset
- `POST /api/email/reset-password` - Reset password

### Flagging System
- `POST /api/flags/issues/:id/flag` - Flag an issue
- `GET /api/flags/admin` - Get all flags (admin)
- `PUT /api/flags/admin/:id/review` - Review flag (admin)

### Analytics
- `GET /api/statistics/dashboard` - Dashboard stats (admin)
- `GET /api/statistics/trends` - Trend analysis (admin)
- `GET /api/statistics/location` - Location-based stats
- `GET /api/statistics/user` - User activity stats

## 🔑 Environment Variables

```env
# Database
MONGO_URI=mongodb://localhost:27017/civictrack

# JWT
JWT_SECRET=your_secret_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

See [API_TESTING.md](./API_TESTING.md) for comprehensive testing guide.

Test credentials:
- Admin: `admin@civictrack.com` / `password123`
- User: `john@example.com` / `password123`

## 📁 Project Structure

```
src/
├── config/
│   ├── db.ts              # Database connection
│   ├── cloudinary.ts      # File upload config
│   └── email.ts           # Email service config
├── controllers/
│   ├── userController.ts  # User management
│   ├── issueController.ts # Issue management
│   ├── uploadController.ts# File upload
│   ├── emailController.ts # Email operations
│   ├── flagController.ts  # Flagging system
│   └── statisticsController.ts # Analytics
├── models/
│   ├── User.ts           # User schema
│   ├── Issue.ts          # Issue schema
│   └── Flag.ts           # Flag schema
├── routes/
│   ├── userRoutes.ts     # User endpoints
│   ├── issueRoutes.ts    # Issue endpoints
│   ├── uploadRoutes.ts   # Upload endpoints
│   ├── emailRoutes.ts    # Email endpoints
│   ├── flagRoutes.ts     # Flag endpoints
│   └── statisticsRoutes.ts # Statistics endpoints
├── middleware/
│   └── authMiddleware.ts # JWT authentication
└── index.ts              # App entry point
```

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based authorization
- Input validation and sanitization
- File type and size validation
- Rate limiting ready (middleware can be added)

## 🔄 Database Indexing

- Geospatial indexing for location-based queries
- Text indexing for search functionality
- Compound indexes for optimal performance

## 📈 Performance Features

- Pagination on all list endpoints
- Image optimization via Cloudinary
- Efficient aggregation pipelines
- Connection pooling with Mongoose

## 🚀 Deployment Ready

- TypeScript compilation
- Environment-based configuration
- Docker-ready structure
- Health check endpoint
- Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the ISC License.
