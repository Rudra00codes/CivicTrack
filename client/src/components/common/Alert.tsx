/**
 * Enhanced Alert component with better UX and accessibility
 */

import { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { sanitizeHTML } from '../../utils/security';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

const Alert = ({ 
  type, 
  title, 
  message, 
  onClose, 
  className = '',
  autoClose = false,
  autoCloseDelay = 5000,
  persistent = false,
  actions = []
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && !persistent) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Allow for fade out animation
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, persistent, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const baseClasses = `p-4 rounded-lg border shadow-sm transition-all duration-300 ${
    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
  }`;
  
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const IconComponent = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }[type];

  const iconColorClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  if (!isVisible && !onClose) return null;

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]} ${className}`} 
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent 
            className={`h-5 w-5 ${iconColorClasses[type]}`} 
            aria-hidden="true" 
          />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h4 className="font-semibold mb-1 text-sm">{title}</h4>
          )}
          <div className="text-sm">
            {typeof message === 'string' ? (
              <p>{message}</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(message) }} />
            )}
          </div>

          {actions.length > 0 && (
            <div className="mt-3 space-x-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded ${
                    action.variant === 'primary' 
                      ? 'text-current' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {onClose && !persistent && (
          <div className="ml-auto pl-3">
            <button
              onClick={handleClose}
              className="inline-flex text-current hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded-full p-1.5"
              aria-label="Close alert"
            >
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {autoClose && !persistent && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-current h-1 rounded-full"
              style={{
                width: '100%',
                transformOrigin: 'left',
                animation: `shrinkWidth ${autoCloseDelay}ms linear forwards`,
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Alert;
