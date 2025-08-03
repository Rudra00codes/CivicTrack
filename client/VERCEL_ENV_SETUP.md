# Vercel Environment Variables Setup

## 🚀 Required Environment Variables for Vercel Deployment

Add these environment variables in your Vercel project dashboard:

### 📍 How to Add Environment Variables in Vercel:
1. Go to [vercel.com](https://vercel.com) and navigate to your project
2. Click on **Settings** tab
3. Click on **Environment Variables** in the sidebar
4. Add each variable below

### 🔥 Firebase Configuration Variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### 🌐 API Configuration:
```
VITE_API_URL=https://your-backend-api-url.herokuapp.com/api
```

### 🔧 Environment Settings:
- Set **Environment** to: `Production`, `Preview`, and `Development`
- All variables should be available in all environments

## 🔥 Getting Firebase Configuration:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Click on **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** and select **Web**
6. Copy the configuration values from the Firebase SDK snippet

Example Firebase config object:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123DEF" // Optional for Google Analytics
};
```

## 🚨 Important Notes:

1. **VITE_ Prefix**: All environment variables for Vite must start with `VITE_`
2. **No Quotes**: Don't wrap values in quotes in Vercel dashboard
3. **Redeploy**: After adding variables, trigger a new deployment
4. **Security**: Firebase API keys are safe to expose in frontend (they're restricted by Firebase security rules)

## 🔧 Troubleshooting:

If you see "Missing required environment variables" error:
1. Double-check all variable names (case-sensitive)
2. Ensure all variables are set for the correct environment
3. Trigger a new deployment after adding variables
4. Check the Vercel deployment logs for more details

## 🌐 Backend API URL:

Set `VITE_API_URL` to your deployed backend API URL. Common options:
- Heroku: `https://your-app-name.herokuapp.com/api`
- Railway: `https://your-app-name.railway.app/api`
- Render: `https://your-app-name.onrender.com/api`

If you haven't deployed the backend yet, you can temporarily use a placeholder or the development URL.
