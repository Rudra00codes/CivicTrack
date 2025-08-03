import React from 'react';

const ConfigurationError: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configuration Required
          </h1>
          <p className="text-gray-600 mb-6">
            CivicTrack needs to be configured with Firebase credentials to work properly.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Missing Environment Variables
          </h3>
          <p className="text-sm text-yellow-700">
            Please configure the following environment variables in your Vercel dashboard:
          </p>
          <ul className="text-xs text-yellow-600 mt-2 text-left">
            <li>• VITE_FIREBASE_API_KEY</li>
            <li>• VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>• VITE_FIREBASE_PROJECT_ID</li>
            <li>• VITE_FIREBASE_STORAGE_BUCKET</li>
            <li>• VITE_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>• VITE_FIREBASE_APP_ID</li>
          </ul>
        </div>

        <div className="space-y-3">
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Get Firebase Config
          </a>
          
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Vercel Dashboard
          </a>

          <button
            onClick={() => window.location.reload()}
            className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            CivicTrack - Empowering Communities, One Report at a Time
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationError;
