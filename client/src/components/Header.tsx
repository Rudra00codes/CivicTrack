import { Link } from "react-router-dom";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Header = () => {
  // Bypass authentication for testing - show all navigation
  const isSignedIn = true; // Mock signed in state for testing

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          CivicTrack
        </Link>
        
        <nav className="flex items-center space-x-6">
          {isSignedIn && (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/report-issue" className="text-gray-700 hover:text-blue-600">
                Report Issue
              </Link>
            </>
          )}
          
          <div className="ml-4">
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Test User</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  TU
                </div>
              </div>
            ) : (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Sign In
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;