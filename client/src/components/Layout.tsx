import { Outlet, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { HelpButton } from "./common/HelpSystem";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Layout = () => {
  const { scrollToTop } = useSmoothScroll();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CivicTrack</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <SignedIn>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/report-issue" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Report Issue
                </Link>
                {user?.primaryEmailAddress?.emailAddress?.includes('admin') && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
                  >
                    Admin
                  </Link>
                )}
              </SignedIn>
              <HelpButton className="text-gray-700 hover:text-blue-600" />
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  userProfileMode="modal"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => navigate('/sign-in')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-600"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/sign-up')}
                  className="bg-blue-600 text-white font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2024 CivicTrack. Making communities better, one report at a time.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <HelpButton className="text-gray-600" />
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Back to top"
        >
          <ChevronUpIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Layout;
