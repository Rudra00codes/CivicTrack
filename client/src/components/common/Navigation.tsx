/**
 * Enhanced Navigation components with better UX and accessibility
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logger from '../../utils/logger';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ChevronDownIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
}

interface NavigationProps {
  items: NavItem[];
  brand?: {
    name: string;
    logo?: React.ReactNode;
    href: string;
  };
  userMenu?: {
    avatar?: string;
    name: string;
    email?: string;
    items: NavItem[];
  };
  variant?: 'horizontal' | 'vertical';
  sticky?: boolean;
  className?: string;
}

export const Navigation = ({
  items,
  brand,
  userMenu,
  variant = 'horizontal',
  sticky = true,
  className = ''
}: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isActiveLink = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.href ? isActiveLink(item.href) : false;
    const isDropdownOpen = activeDropdown === item.label;

    const baseClasses = `
      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${item.disabled 
        ? 'text-gray-400 cursor-not-allowed' 
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
      }
      ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : ''}
      ${isMobile ? 'w-full justify-start' : ''}
    `;

    const content = (
      <>
        {item.icon && (
          <div className="h-5 w-5 flex-shrink-0">
            {item.icon}
          </div>
        )}
        <span className="truncate">{item.label}</span>
        {item.badge && (
          <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <ChevronDownIcon 
            className={`h-4 w-4 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} 
          />
        )}
      </>
    );

    if (item.disabled) {
      return (
        <div key={item.label} className={baseClasses}>
          {content}
        </div>
      );
    }

    if (hasChildren) {
      return (
        <div key={item.label} className="relative" ref={dropdownRef}>
          <button
            onClick={() => setActiveDropdown(isDropdownOpen ? null : item.label)}
            className={baseClasses}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            {content}
          </button>
          
          {isDropdownOpen && (
            <div className={`
              absolute z-50 mt-1 w-56 rounded-lg bg-white border border-gray-200 shadow-lg
              ${isMobile ? 'relative w-full mt-0 border-0 shadow-none pl-4' : 'left-0'}
            `}>
              <div className="py-1">
                {item.children!.map((child) => renderNavItem(child, isMobile))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (item.onClick) {
      return (
        <button
          key={item.label}
          onClick={item.onClick}
          className={baseClasses}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.href!}
        className={baseClasses}
      >
        {content}
      </Link>
    );
  };

  const UserMenuComponent = () => {
    if (!userMenu) return null;

    const [isOpen, setIsOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {userMenu.avatar ? (
            <img 
              src={userMenu.avatar} 
              alt={userMenu.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
          )}
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-900">{userMenu.name}</div>
            {userMenu.email && (
              <div className="text-xs text-gray-500">{userMenu.email}</div>
            )}
          </div>
          <ChevronDownIcon 
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg bg-white border border-gray-200 shadow-lg">
            <div className="py-1">
              {userMenu.items.map((item) => renderNavItem(item))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (variant === 'vertical') {
    return (
      <nav className={`w-64 bg-white border-r border-gray-200 ${className}`}>
        {brand && (
          <div className="p-4 border-b border-gray-200">
            <Link to={brand.href} className="flex items-center space-x-2">
              {brand.logo}
              <span className="text-lg font-semibold text-gray-900">{brand.name}</span>
            </Link>
          </div>
        )}
        
        <div className="p-4 space-y-2">
          {items.map((item) => renderNavItem(item, true))}
        </div>

        {userMenu && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <UserMenuComponent />
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className={`
      bg-white border-b border-gray-200 
      ${sticky ? 'sticky top-0 z-40' : ''} 
      ${className}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          {brand && (
            <Link to={brand.href} className="flex items-center space-x-2">
              {brand.logo}
              <span className="text-lg font-semibold text-gray-900">{brand.name}</span>
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {items.map((item) => renderNavItem(item))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <UserMenuComponent />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {items.map((item) => renderNavItem(item, true))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Breadcrumb component for better navigation context
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronDownIcon className="h-4 w-4 text-gray-400 mx-2 rotate-[-90deg]" />
            )}
            {item.current ? (
              <span className="text-sm font-medium text-gray-900" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href!}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Default navigation items for CivicTrack
export const defaultNavItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <HomeIcon className="h-5 w-5" />
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Cog6ToothIcon className="h-5 w-5" />
  },
  {
    label: 'Report Issue',
    href: '/report',
    icon: <ExclamationTriangleIcon className="h-5 w-5" />
  }
];

export const defaultUserMenuItems: NavItem[] = [
  {
    label: 'Profile',
    href: '/profile',
    icon: <UserIcon className="h-5 w-5" />
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Cog6ToothIcon className="h-5 w-5" />
  },
  {
    label: 'Sign Out',
    onClick: () => {
      // Handle sign out
      logger.debug('Sign out action triggered', 'Navigation');
    },
    icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />
  }
];
