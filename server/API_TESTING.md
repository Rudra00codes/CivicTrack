# CivicTrack API Testing Guide

## 🚀 Quick Start

1. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env file with your credentials
   # MongoDB URI, JWT Secret, Email settings, Cloudinary settings
   ```

2. **Install Dependencies & Build**
   ```bash
   npm install
   npm run build
   ```

3. **Seed Test Data**
   ```bash
   npm run seed-full
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

## 📋 Test Credentials

| Role | Email | Password | Status |
|------|-------|----------|--------|
| Citizen | john@example.com | password123 | ✅ Verified |
| Admin | admin@civictrack.com | password123 | ✅ Verified |
| Municipal Worker | worker@city.gov | password123 | ✅ Verified |
| Unverified User | jane@example.com | password123 | ❌ Unverified |

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "new_user",
  "email": "user@example.com", 
  "password": "password123"
}
```

### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

## 📧 Email System Endpoints

### Send Email Verification
```http
POST /api/email/send-verification
Authorization: Bearer <token>
```

### Verify Email
```http
POST /api/email/verify
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

### Forgot Password
```http
POST /api/email/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /api/email/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

### Test Email
```http
POST /api/email/test
Authorization: Bearer <token>
```

## 📷 File Upload Endpoints

### Upload Single Image
```http
POST /api/upload/single
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
- image: [file]
```

### Upload Multiple Images
```http
POST /api/upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
- images: [file1, file2, file3]
```

### Delete Image
```http
DELETE /api/upload/:publicId
Authorization: Bearer <token>
```

### Get Upload Stats
```http
GET /api/upload/stats
Authorization: Bearer <token>
```

## 🏗️ Advanced Issue Endpoints

### Get User Issues
```http
GET /api/issues/user/:userId?page=1&limit=10&status=open
```

### Update Issue
```http
PUT /api/issues/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description", 
  "category": "road_maintenance",
  "images": ["url1", "url2"]
}
```

### Delete Issue
```http
DELETE /api/issues/:id
Authorization: Bearer <token>
```

### Get Nearby Issues
```http
GET /api/issues/nearby?lat=40.7128&lng=-74.006&radius=1000
```

## 🚩 Flagging System Endpoints

### Flag an Issue
```http
POST /api/flags/issues/:id/flag
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Inappropriate Content",
  "description": "This seems inappropriate"
}
```

### Get All Flags (Admin)
```http
GET /api/flags/admin?status=pending&page=1&limit=10
Authorization: Bearer <admin_token>
```

### Review Flag (Admin)
```http
PUT /api/flags/admin/:id/review
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "action": "approve",
  "review_notes": "Flag is valid"
}
```

### Get User Flags
```http
GET /api/flags/user?page=1&limit=10
Authorization: Bearer <token>
```

### Get Issue Flag Count
```http
GET /api/flags/issues/:id/count
Authorization: Bearer <token>
```

## 📊 Analytics & Statistics Endpoints

### Dashboard Statistics (Admin)
```http
GET /api/statistics/dashboard
Authorization: Bearer <admin_token>
```

### Trend Data (Admin)
```http
GET /api/statistics/trends?period=30&type=issues
Authorization: Bearer <admin_token>
```

### Location Statistics
```http
GET /api/statistics/location?lat=40.7128&lng=-74.006&radius=5000
Authorization: Bearer <token>
```

### User Activity Statistics
```http
GET /api/statistics/user
Authorization: Bearer <token>
```

## 👤 User Profile Endpoints

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "email": "new@example.com",
  "location": {
    "type": "Point",
    "coordinates": [-74.006, 40.7128]
  }
}
```

### Update Location
```http
PUT /api/users/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "coordinates": [-74.006, 40.7128]
}
```

### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## 🏥 Health Check

### Server Health
```http
GET /api/health
```

## 🧪 Testing with cURL Examples

### Login and Get Token
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Upload Image
```bash
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

### Send Test Email
```bash
curl -X POST http://localhost:5000/api/email/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Environment Variables Required

```env
# Database
MONGO_URI=mongodb://localhost:27017/civictrack

# JWT
JWT_SECRET=your_secret_key

# Email (Gmail example)
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

## 📝 Testing Checklist

- [ ] User registration with email verification
- [ ] Email verification flow
- [ ] Password reset flow  
- [ ] File upload (single & multiple)
- [ ] Image deletion
- [ ] Issue CRUD operations
- [ ] Issue flagging system
- [ ] Admin flag review
- [ ] Statistics endpoints
- [ ] Location-based queries
- [ ] User profile management
- [ ] Email notifications

## 🚨 Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description"
}
```

HTTP status codes used:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
