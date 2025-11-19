# 🏙️ CivicTrack: Empowering Communities, One Report at a Time

![CivicTrack Banner](./client/src/assets/main.png) *<!-- Add your banner image here -->*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

<div align="center">
  <h3>🚀 Production-Ready Full-Stack Civic Engagement Platform</h3>
  <p><em>Bridging Communities and Government Through Technology</em></p>
  
  ![GitHub last commit](https://img.shields.io/github/last-commit/Rudra00codes/CivicTrack)
  ![GitHub code size](https://img.shields.io/github/languages/code-size/Rudra00codes/CivicTrack)
  ![GitHub top language](https://img.shields.io/github/languages/top/Rudra00codes/CivicTrack)
</div>

### 📊 **Project Achievements**
- ✅ **40+ API Endpoints** implemented and tested
- ✅ **15+ React Components** with TypeScript
- ✅ **5 Database Models** with geospatial indexing
- ✅ **Complete Authentication System** with Clerk
- ✅ **Security Hardened** with XSS protection and input sanitization
- ✅ **Production Deployment Ready** with comprehensive documentation
- ✅ **84 Files** committed across frontend and backend
- ✅ **2,500+ Lines of Code** written in 8 hours + extended development  

## ❓ Problem Statement
Modern cities face numerous civic challenges that often go unreported or unaddressed due to inefficient reporting mechanisms. Citizens need a simple, transparent way to report issues like potholes, broken streetlights, or garbage collection problems, while local authorities require a streamlined system to track and resolve these issues effectively.

## 💡 Our Solution
CivicTrack is a modern, user-friendly platform that bridges the gap between citizens and local authorities. Our solution enables:

- 📱 **Easy Issue Reporting**: Intuitive mobile-first interface for quick reporting
- 📍 **Location-Based Tracking**: Pinpoint issues precisely on an interactive map
- 📸 **Visual Documentation**: Support for multiple image uploads
- 🔍 **Transparent Tracking**: Real-time status updates on reported issues
- 🤝 **Community Engagement**: Upvote and comment on local issues
- 🏛️ **Government Integration**: Streamlined workflow for authorities

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React SPA<br/>TypeScript + Vite]
        B[Clerk Authentication<br/>User Management]
        C[Admin Dashboard<br/>Statistics & Moderation]
        D[Glassmorphism UI<br/>Dynamic Background Detection]
    end
    
    subgraph "UI Components"
        E[BackgroundWrapper<br/>Dots, Grid, Shader Variants]
        F[Layout Component<br/>Transparent Navbar]
        G[Protected Routes<br/>Role-based Access]
        H[Form Components<br/>Input Sanitization]
    end
    
    subgraph "Backend Services"
        I[Express.js API Server<br/>TypeScript + Node.js]
        J[Email Service<br/>SMTP + Templates]
        K[File Upload Service<br/>Cloudinary + Multer]
        L[Authentication Middleware<br/>Clerk Integration]
    end
    
    subgraph "Data Layer"
        M[(MongoDB Atlas<br/>User & Issue Data)]
        N[(Cloudinary<br/>Media Storage)]
        O[Clerk Backend<br/>User Authentication]
    end
    
    subgraph "Security & Monitoring"
        P[Input Sanitization<br/>XSS Protection]
        Q[Rate Limiting<br/>CORS Security]
        R[Secure Logging<br/>Production Safe]
        S[Dynamic Color Detection<br/>Accessibility Features]
    end
    
    A -->|HTTPS/REST API| I
    B -->|Auth Tokens| L
    C -->|Admin Operations| I
    D -->|Background Detection| S
    E -->|UI Rendering| D
    F -->|Navbar State| D
    G -->|Route Protection| B
    H -->|Form Validation| P
    I -->|Geospatial Queries| M
    I -->|Image Processing| K
    K -->|Media Upload| N
    I -->|Notifications| J
    L -->|User Verification| O
    I -->|Security Layer| P
    I -->|Security Policies| Q
    I -->|Audit Logging| R
    
    classDef frontend fill:#e1f5fe
    classDef ui fill:#f8bbd9
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef security fill:#fff3e0
    
    class A,B,C,D frontend
    class E,F,G,H ui
    class I,J,K,L backend
    class M,N,O database
    class P,Q,R,S security
```

## 🔄 Component Relationships

- **Frontend**: React 19 + TypeScript + Vite 7 with modern UI patterns
- **Authentication**: Clerk React SDK v5.38.1 with UserButton and session management
- **State Management**: React Context API + Clerk hooks for auth state
- **Styling**: Tailwind CSS with custom glassmorphism effects and backdrop-blur
- **UI Components**: 
  - **BackgroundWrapper**: Dots, grid, shader, and subtle variants for different page themes
  - **Layout**: Transparent glassmorphism navbar with dynamic text color adaptation
  - **Protected Routes**: Clerk-based route protection with role verification
- **Backend**: Express.js with TypeScript + MongoDB with geospatial indexing
- **File Storage**: Cloudinary with image optimization and upload handling
- **Email System**: SMTP with HTML templates for notifications
- **Security**: 
  - Input sanitization with selective field processing
  - XSS protection with Content Security Policy
  - Dynamic background detection for accessibility
  - Clerk security features with JWT token validation
- **Maps Integration**: OpenStreetMap with Leaflet for geolocation features
- **Admin Panel**: Role-based access control with Clerk permissions

## 🛠️ Technology Stack

<details>
<summary><strong>💻 Complete Technology Stack Details</strong> (Click to expand)</summary>

### Frontend
- **⚛️ Framework**: React 18.2
- **📘 Language**: TypeScript 5.0
- **⚡ Build Tool**: Vite 4.4
- **🎨 Styling**: Tailwind CSS 3.3
- **🔐 Authentication**: Clerk
- **🗂️ State Management**: React Context API
- **🧭 Routing**: React Router 6.14
- **📝 Form Handling**: React Hook Form 7.45
- **🎯 UI Components**: Headless UI, Heroicons
- **🗺️ Maps**: OpenStreetMap, Leaflet
- **🔒 Security**: Input sanitization, XSS protection

### Backend
- **🚀 Runtime**: Node.js 18+ with TypeScript
- **🏗️ Framework**: Express.js 4.18
- **🗄️ Database**: MongoDB with Mongoose ODM
- **🔑 Authentication**: JWT with bcrypt
- **📧 Email Service**: Nodemailer with SMTP
- **☁️ Storage**: Cloudinary with Multer
- **🔍 Search**: MongoDB text & geospatial indexing
- **📊 Analytics**: Custom aggregation pipelines
- **🛡️ Security**: Rate limiting, CORS, validation

### DevOps & Deployment
- **🔧 Development**: Concurrently, Nodemon
- **📦 Package Manager**: npm
- **🌐 Deployment**: Vercel (Frontend and Backend)
- **📝 Documentation**: Markdown, API testing guides
- **🔄 Version Control**: Git with semantic commits

</details>

## 🚀 Getting Started

<details>
<summary><strong>📋 Prerequisites & Installation Guide</strong> (Click to expand)</summary>

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/civictrack.git
   cd CivicTrack
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the client directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # API Configuration
   VITE_API_URL=http://localhost:5000/api
   ```

   Create a `.env` file in the server directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/civictrack
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**
   
   Frontend:
   ```bash
   cd client
   npm run dev
   ```
   
   Backend:
   ```bash
   cd server
   npm run dev
   ```

5. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed-full
   ```

6. **Open in your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

</details>

## 🔌 **API Overview**

<details>
<summary><strong>🔗 Complete API Endpoints Reference</strong> (Click to expand)</summary>

### **Core Endpoints Implemented**
```
🔐 Authentication
POST   /api/users/register          - User registration with email verification
POST   /api/users/login             - JWT-based authentication
GET    /api/users/profile           - Get user profile
PUT    /api/users/profile           - Update user profile

📝 Issue Management  
GET    /api/issues                  - List issues with geospatial filtering
POST   /api/issues                  - Create new issue with location
GET    /api/issues/:id              - Get detailed issue information
PUT    /api/issues/:id              - Update issue (owner/admin only)
DELETE /api/issues/:id              - Delete issue (owner/admin only)
PUT    /api/issues/:id/upvote       - Upvote issue
GET    /api/issues/nearby           - Find nearby issues with radius

🚩 Community Moderation
POST   /api/flags/issues/:id/flag   - Flag inappropriate content
GET    /api/flags/admin             - Admin flag review (admin only)
PUT    /api/flags/admin/:id/review  - Review flagged content (admin only)

📧 Email System
POST   /api/email/send-verification - Send email verification
POST   /api/email/verify            - Verify email address
POST   /api/email/forgot-password   - Password reset request
POST   /api/email/reset-password    - Reset password with token

📊 Analytics & Statistics
GET    /api/statistics/dashboard    - Admin dashboard stats
GET    /api/statistics/trends       - Trend analysis data
GET    /api/statistics/location     - Location-based statistics
GET    /api/statistics/user         - User activity statistics

☁️ File Management
POST   /api/upload/single           - Upload single image
POST   /api/upload/multiple         - Upload multiple images (max 5)
DELETE /api/upload/:publicId        - Delete uploaded image
```

📚 **[Complete API Documentation](./server/API_TESTING.md)** - 200+ test cases included

</details>

## 🌐 Deployment Links

- **🎯 Live Demo**: [CivicTrack Production App](https://civictrack-frontend.vercel.app) *(Coming Soon)*
- **🖥️ Frontend**: [Vercel Deployment](https://vercel.com/civictrack-frontend)
- **⚡ Backend API**: [Railway Deployment](https://civictrack-api.railway.app) *(Coming Soon)*
- **📚 API Documentation**: [Complete API Testing Guide](./server/API_TESTING.md)
- **🔒 Security Guide**: [Frontend Security Documentation](./client/SECURITY.md)
- **📖 Deployment Guide**: [Frontend Deployment Instructions](./client/DEPLOYMENT.md)

## ✨ Key Features

<details>
<summary><strong>🏛️ Current Implementation Status: PRODUCTION READY</strong> (Click to expand)</summary>

#### 🖥️ **Frontend Application**
- ✅ **Modern React SPA** with TypeScript and Vite
- ✅ **Responsive Dashboard** with issue filtering and statistics
- ✅ **Interactive Map Integration** with OpenStreetMap
- ✅ **Secure Authentication** with Firebase Auth
- ✅ **Admin Panel** with role-based access control
- ✅ **Real-time Issue Tracking** with status updates

#### 📝 **Issue Management System**
- ✅ **Comprehensive Reporting Form** with validation
- ✅ **Multiple Image Upload** with Cloudinary integration
- ✅ **Geolocation Detection** with manual override
- ✅ **Anonymous Reporting** option for sensitive issues
- ✅ **Category-based Organization** (9 predefined categories)
- ✅ **Issue Upvoting** and community engagement

#### � **Security & Performance**
- ✅ **Production-grade Security** with XSS protection
- ✅ **Input Sanitization** across all forms
- ✅ **Secure Token Storage** with base64 encoding
- ✅ **Content Security Policy** headers
- ✅ **Rate Limiting** and CORS protection
- ✅ **Audit Logging** with sensitive data filtering

#### 🗄️ **Backend API (Full-Stack)**
- ✅ **Complete REST API** with 40+ endpoints
- ✅ **MongoDB Integration** with geospatial indexing
- ✅ **Email System** with verification and notifications
- ✅ **File Upload Service** with image optimization
- ✅ **Flagging System** for community moderation
- ✅ **Analytics Dashboard** with trend analysis

</details>

## 📸 Application Screenshots

### 🖥️ **Production Application Interface**

| **🏠 Landing Page** | **📊 Dashboard** | **📝 Report Issue** |
|---------------------|------------------|---------------------|
| ![Home](https://ik.imagekit.io/s5z5osyjg/Civic%20Track%20Project%20Assets/screencapture-civic-track-lime-vercel-app-2025-08-16-01_08_15.png) | ![Dashboard](https://ik.imagekit.io/s5z5osyjg/Civic%20Track%20Project%20Assets/screencapture-civic-track-lime-vercel-app-dashboard-2025-08-16-01_09_09.png) | ![Report](https://ik.imagekit.io/s5z5osyjg/Civic%20Track%20Project%20Assets/screencapture-civic-track-lime-vercel-app-report-issue-2025-11-20-00_20_18.png) |
| Modern landing with authentication | Interactive dashboard with filtering | Comprehensive reporting form |

| **🔍 Issue Details** | **🗺️ Map Integration** | **👑 Admin Panel** |
|---------------------|----------------------|---------------------|
| ![Details](https://ik.imagekit.io/s5z5osyjg/Civic%20Track%20Project%20Assets/ScreenShot%20Tool%20-20251120002414.png) | ![Map](https://ik.imagekit.io/s5z5osyjg/Civic%20Track%20Project%20Assets/screencapture-civic-track-lime-vercel-app-2025-08-16-01_08_15.png) | ![Admin](https://ik.imagekit.io/s5z5osyjg/Civic%20Track%20Project%20Assets/Screenshot%202025-11-20%20002700.png) |
| Detailed issue view with actions | OpenStreetMap with location pins | Admin dashboard |

### 🎯 **Key Visual Features**
- 📱 **Mobile-First Responsive Design** - Works seamlessly across all devices
- 🎨 **Modern UI/UX** - Clean, intuitive interface with Tailwind CSS
- 🗺️ **Interactive Maps** - Real-time location plotting with custom markers  
- 📊 **Data Visualization** - Charts and statistics for civic insights
- 🔐 **Secure Authentication** - Firebase-powered login with role management
- 🌙 **Accessibility Ready** - Prepared for dark mode and screen readers

## 🚀 Future Scope & USPs

<details>
<summary><strong>🎯 Our Unique Selling Propositions (USPs)</strong> (Click to expand)</summary>

#### 🏘️ **USP 1: "Hyperlocal Verified Community Action"**
- **Community-Driven Verification**: Multi-tier citizen verification system (email, phone, ID document, biometric)
- **Neighborhood-Specific Insights**: Hyperlocal analytics and trending issues within specific areas
- **Verified Reporter Badge System**: Trust levels based on successful report verification
- **Community Moderation**: Citizen-led flagging and review system for accurate reporting
- **Local Government Integration**: Direct municipal worker assignment and response tracking

#### 📍 **USP 2: "Report. Locate. React: Real-time Geo-Aware Incident Tracking"**
- **Instant Geospatial Intelligence**: Advanced location-based issue discovery and clustering
- **Real-time Status Broadcasting**: Live updates on issue resolution progress with push notifications
- **Predictive Issue Mapping**: AI-powered hotspot prediction based on historical data
- **Multi-Modal Reporting**: Voice-to-text, image recognition, and quick-tap category selection
- **Emergency Response Integration**: Priority routing for critical infrastructure issues

</details>

<details>
<summary><strong>🔮 Planned Enhancements</strong> (Click to expand)</summary>

- [ ] **🤖 AI-Powered Issue Categorization** with image recognition
- [ ] **📱 Progressive Web App (PWA)** for offline reporting
- [ ] **🔔 Smart Notification System** with SMS/Email/Push integration
- [ ] **🎮 Gamification & Civic Rewards** for active community members
- [ ] **📊 Advanced Predictive Analytics** for municipal planning
- [ ] **🌍 Multi-language Support** for diverse communities
- [ ] **🚨 Emergency Response Integration** with local authorities
- [ ] **🏆 Civic Engagement Leaderboards** and community recognition

</details>

## 🙏 Acknowledgements

<details>
<summary><strong>🌟 Technology Partners & Special Thanks</strong> (Click to expand)</summary>

- **🔥 [Clerk](https://clerk.dev/)** for seamless authentication and real-time features
- **🎨 [Tailwind CSS](https://tailwindcss.com/)** for beautiful, responsive styling
- **🎯 [React Icons](https://react-icons.github.io/react-icons/)** for comprehensive icon library
- **⚡ [Vite](https://vitejs.dev/)** for lightning-fast development experience
- **🗄️ [MongoDB](https://www.mongodb.com/)** for flexible, scalable data storage
- **☁️ [Cloudinary](https://cloudinary.com/)** for intelligent media management
- **🗺️ [OpenStreetMap](https://www.openstreetmap.org/)** for open-source mapping solutions
- **🏆 [Odoo x CGC Hackathon 2025](https://www.odoo.com/de_DE/event/cgc-mohali-8573/register)** for this incredible opportunity to innovate

### 🌟 **Special Thanks**
- **Open Source Community** for the amazing tools and libraries
- **Municipal Technology Partners** for inspiration and civic engagement insights
- **Beta Testers** who helped us identify and resolve critical issues

</details>

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

<details>
<summary><strong>🔄 Development Workflow & Contribution Guidelines</strong> (Click to expand)</summary>

We welcome contributions from the community! Here's how you can help:

### 🔄 **Development Workflow**
1. **Fork the repository** and create your feature branch
2. **Follow our coding standards**: TypeScript, ESLint, Prettier
3. **Write comprehensive tests** for new features
4. **Update documentation** for any API changes
5. **Submit a pull request** with detailed description

### 🐛 **Reporting Issues**
- Use our **issue reporting system** to report bugs in the actual app
- For development issues, create a GitHub issue with:
  - Clear problem description
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable

### 💡 **Feature Requests**
- Check existing issues before creating new ones
- Provide detailed use cases and user stories
- Consider civic engagement best practices

</details>

---

<div align="center">
  <h2>🌟 Star us on GitHub if CivicTrack helps your community! 🌟</h2>
  <p><em>Together, we're building stronger, more connected communities</em></p>
</div>

---

<div align="center">
 <img width="1300" height="259" alt="footer" src="https://github.com/user-attachments/assets/b35e0782-c1ca-4009-9263-203a039b1d6b" />
</div>
