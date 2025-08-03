import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from './env';

// Check if Firebase configuration is available
const isFirebaseConfigured = config.firebase.apiKey && 
                             config.firebase.authDomain && 
                             config.firebase.projectId;

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase
    app = initializeApp(config.firebase);
    
    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  console.warn('Firebase configuration is incomplete. Some features may not work.');
  console.warn('Please check your environment variables in Vercel dashboard.');
}

// Export with fallbacks
export { auth, db, storage };
export default app;
