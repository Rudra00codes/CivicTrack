import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation, defaultNavItems, defaultUserMenuItems } from "./common/Navigation";
import { HelpButton } from "./common/HelpSystem";
import { useToastHelpers } from "./common/Toast";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

const Layout = () => {
  const { success } = useToastHelpers();
  const { scrollToTop } = useSmoothScroll();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced navigation items with help integration
  const navItems = [
    ...defaultNavItems,
    {
      label: 'Help',
      onClick: () => {
        // This will be handled by the HelpButton component
      },
      component: <HelpButton />
    }
  ];

  // Enhanced user menu with sign out functionality
  const userMenuItems = [
    ...defaultUserMenuItems.slice(0, -1), // Remove the default sign out
    {
      label: 'Sign Out',
      onClick: () => {
        // Handle sign out with toast notification
        success('Successfully signed out', 'See you soon!');
        // Add actual sign out logic here
      },
      icon: defaultUserMenuItems[defaultUserMenuItems.length - 1].icon
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        brand={{
          name: 'CivicTrack',
          href: '/',
          logo: (
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
          )
        }}
        items={navItems}
        userMenu={{
          name: 'John Doe', // This should come from auth context
          email: 'john@example.com',
          items: userMenuItems
        }}
        sticky={true}
        className="shadow-sm"
      />
      
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
