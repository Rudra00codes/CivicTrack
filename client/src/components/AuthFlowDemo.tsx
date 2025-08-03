import { useAuth } from '../context/AuthContext';

const AuthFlowDemo = () => {
  const { user, isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">🔄 Authentication Loading...</h3>
        <p className="text-blue-700">Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-green-800 mb-2">
        🔐 Authentication Status: {isSignedIn ? '✅ Signed In' : '❌ Not Signed In'}
      </h3>
      
      {isSignedIn ? (
        <div className="text-green-700">
          <p><strong>User ID:</strong> {user?.uid}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Display Name:</strong> {user?.displayName || 'Not set'}</p>
          <div className="mt-2 p-2 bg-green-100 rounded text-sm">
            ✅ You can now click "Report Issue" to go directly to the report page!
          </div>
        </div>
      ) : (
        <div className="text-green-700">
          <p>Click "Report Issue" to test the authentication flow:</p>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>You'll be redirected to the login page</li>
            <li>After signing in, you'll return to the Report Issue page</li>
            <li>Test credentials: john@example.com / password123</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AuthFlowDemo;
