import { Outlet } from "react-router-dom";
// import { useAuth } from "@clerk/clerk-react";

const ProtectedRoute = () => {
  // Bypass authentication for testing
  // const { isLoaded, isSignedIn } = useAuth();
  // const location = useLocation();

  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading your session...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!isSignedIn) {
  //   // Store the attempted URL for redirecting after sign in
  //   sessionStorage.setItem('redirectUrl', location.pathname);
  //   return <Navigate to="/sign-in" state={{ from: location }} replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
