/**
 * Environment configuration for production deployment
 * This file helps manage environment variables across different deployment environments
 */

interface Config {
  apiUrl: string;
  clerk: {
    publishableKey: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  clerk: {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "",
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate required environment variables
const requiredEnvVars = [
  'VITE_CLERK_PUBLISHABLE_KEY',
];

// Always validate in all environments
const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  if (config.isProduction) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please set these environment variables in your deployment dashboard:');
    console.error('- Go to your deployment project settings');
    console.error('- Navigate to Environment Variables');
    console.error('- Add the missing Clerk configuration variables');
    
    // Don't throw error in production, just log warnings
    // This prevents the app from completely breaking
  } else {
    console.warn('Missing environment variables (development mode):', missingVars);
  }
}

export default config;
