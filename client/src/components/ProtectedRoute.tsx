import { Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { RedirectToSignIn } from "@clerk/clerk-react";

/**
 * ProtectedRoute component that ensures user is authenticated before accessing protected pages
 * Redirects to sign-in page if user is not authenticated
 */
const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if user is not authenticated
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Render protected content if user is authenticated
  return <Outlet />;
};

export default ProtectedRoute;
