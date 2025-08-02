import { Outlet } from "react-router-dom";
import { Navigation, defaultNavItems, defaultUserMenuItems } from "./common/Navigation";
import { HelpButton } from "./common/HelpSystem";
import { useToastHelpers } from "./common/Toast";

const Layout = () => {
  const { success } = useToastHelpers();

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
    </div>
  );
};

export default Layout;
