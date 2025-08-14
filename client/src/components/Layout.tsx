import { Outlet, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { HelpButton } from "./common/HelpSystem";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Layout = () => {
  const { scrollToTop } = useSmoothScroll();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
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

  // Detect background color behind navbar to adjust text color
  useEffect(() => {
    const detectBackgroundColor = () => {
      // Get element directly behind the navbar center
      const navbarHeight = 80;
      const centerX = window.innerWidth / 2;
      const elementBehind = document.elementFromPoint(centerX, navbarHeight);
      
      if (elementBehind) {
        const styles = window.getComputedStyle(elementBehind);
        const bgColor = styles.backgroundColor;
        const parentBg = window.getComputedStyle(elementBehind.parentElement || document.body).backgroundColor;
        
        // Check for dark backgrounds
        const isDark = 
          // Check for explicit dark colors
          bgColor.includes('rgb(0, 0, 0)') ||
          bgColor.includes('rgba(0, 0, 0') ||
          parentBg.includes('rgb(0, 0, 0)') ||
          parentBg.includes('rgba(0, 0, 0') ||
          // Check for dark CSS classes
          elementBehind.classList.contains('bg-black') ||
          elementBehind.classList.contains('bg-gray-900') ||
          elementBehind.classList.contains('bg-gray-800') ||
          // Check for gradient backgrounds (often dark)
          styles.background?.includes('gradient') ||
          styles.backgroundImage?.includes('gradient') ||
          // Check parent for dark gradients
          elementBehind.parentElement?.style.background?.includes('gradient') ||
          // Check for shader/dark backgrounds
          elementBehind.closest('[class*="shader"]') !== null ||
          elementBehind.closest('[class*="dark"]') !== null;
        
        setIsDarkSection(isDark);
      }
    };

    // Initial check
    detectBackgroundColor();
    
    // Check on scroll
    const handleScroll = () => {
      detectBackgroundColor();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', detectBackgroundColor);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', detectBackgroundColor);
    };
  }, []);

  // Dynamic text color classes based on background
  const textColorClass = isDarkSection ? 'text-white' : 'text-gray-800';
  const hoverTextColorClass = isDarkSection ? 'hover:text-blue-200' : 'hover:text-blue-600';
  const logoTextClass = isDarkSection 
    ? 'text-white' 
    : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent';

  return (
    <div className="min-h-screen">
      {/* True Glassmorphism Navbar - Fully Transparent with Backdrop Blur */}
      <header className={`
        fixed top-0 left-0 right-0 z-50
        bg-transparent backdrop-blur-lg
        border-b border-white/10
        shadow-lg shadow-black/5
        transition-all duration-300 ease-in-out
      `}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ${isDarkSection ? 'shadow-white/20' : 'shadow-blue-500/30'}`}>
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <span className={`text-2xl font-bold transition-all duration-300 ${logoTextClass}`}>
                CivicTrack
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`${textColorClass} ${hoverTextColorClass} font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm`}
              >
                Home
              </Link>
              <SignedIn>
                <Link 
                  to="/dashboard" 
                  className={`${textColorClass} ${hoverTextColorClass} font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/report-issue" 
                  className={`${textColorClass} ${hoverTextColorClass} font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm`}
                >
                  Report Issue
                </Link>
                {user?.primaryEmailAddress?.emailAddress?.includes('admin') && (
                  <Link 
                    to="/admin" 
                    className={`${textColorClass} ${hoverTextColorClass} font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm`}
                  >
                    Admin
                  </Link>
                )}
              </SignedIn>
              <HelpButton className={`${textColorClass} ${hoverTextColorClass} px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all`} />
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  userProfileMode="modal"
                  appearance={{
                    elements: {
                      avatarBox: `h-10 w-10 ring-2 ${isDarkSection ? 'ring-white/20 hover:ring-white/40' : 'ring-blue-500/20 hover:ring-blue-500/40'} transition-all duration-300`,
                      userButtonPopoverCard: "backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl",
                      userButtonPopoverActionButton: "hover:bg-blue-50/50 transition-colors duration-200"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => navigate('/sign-in')}
                  className={`${textColorClass} ${hoverTextColorClass} font-medium transition-all duration-300 px-4 py-2 rounded-lg border ${isDarkSection ? 'border-white/30 hover:border-white/50 hover:bg-white/10' : 'border-gray-300/50 hover:border-blue-600/50 hover:bg-white/20'} backdrop-blur-sm`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/sign-up')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 backdrop-blur-sm hover:from-blue-700 hover:to-purple-700"
                >
                  Sign Up
                </button>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>
      
      <main>
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
