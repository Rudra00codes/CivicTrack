# CivicTrack Frontend - Vercel Deployment Guide

## 🚀 Deployment Configuration

This frontend is optimized for deployment on Vercel with the following configurations:

### Environment Variables Required

Set these environment variables in your Vercel dashboard:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)
VITE_API_URL=https://your-backend-api.herokuapp.com/api
```

### Build Optimizations

The app includes the following Vercel optimizations:

1. **Code Splitting**: Automatic vendor chunking for better caching
2. **Static Asset Caching**: Optimized cache headers for static files
3. **SPA Routing**: Proper rewrites for single-page application routing
4. **Environment Management**: Centralized environment configuration
5. **Error Handling**: Production-ready error boundaries and API error handling

### Performance Features

- **Bundle Optimization**: Vendor libraries are chunked separately
- **Tree Shaking**: Unused code is eliminated in production builds
- **Lazy Loading**: Components are loaded on-demand where possible
- **Asset Optimization**: Images and static assets are optimized for web delivery

### Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment**: Add all required environment variables
3. **Set Build Command**: `npm run build` (configured in vercel.json)
4. **Deploy**: Vercel will automatically build and deploy

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test Firebase authentication
- [ ] Verify API connectivity to backend
- [ ] Test all major user flows
- [ ] Check console for any errors
- [ ] Verify responsive design on mobile devices

### Custom Domain Setup

1. Add your custom domain in Vercel dashboard
2. Configure DNS records as instructed by Vercel
3. SSL certificates are automatically provisioned

### Monitoring and Analytics

Consider adding:
- Vercel Analytics for performance monitoring
- Firebase Analytics for user behavior tracking
- Error tracking service (Sentry, LogRocket, etc.)

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Project Structure

```
client/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── config/       # Configuration files
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Application pages
│   ├── services/     # API service layer
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── vercel.json       # Vercel deployment configuration
└── vite.config.ts    # Vite build configuration
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Ensure all VITE_ prefixed variables are set in Vercel
   - Restart deployment after adding new variables

2. **404 on Page Refresh**
   - Verify vercel.json rewrites configuration
   - Ensure SPA routing is properly configured

3. **API Connection Issues**
   - Check VITE_API_URL is set correctly
   - Verify CORS configuration on backend
   - Ensure backend is deployed and accessible

4. **Firebase Authentication Issues**
   - Verify all Firebase config variables are correct
   - Check Firebase console for authorized domains
   - Ensure Vercel domain is added to Firebase authorized domains

For additional support, check Vercel documentation or open an issue in the repository.
