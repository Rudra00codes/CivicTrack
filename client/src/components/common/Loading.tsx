/**
 * Reusable Loading component with different variants
 */

import { memo } from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const Loading = memo<LoadingProps>(({ 
  variant = 'spinner', 
  size = 'md', 
  text, 
  className = '',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  if (variant === 'spinner') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="flex flex-col items-center">
          <div 
            className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
            role="status"
            aria-label="Loading"
          />
          {text && (
            <p className="mt-2 text-sm text-gray-600 animate-pulse">{text}</p>
          )}
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="flex items-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`bg-blue-600 rounded-full animate-bounce ${
                size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
          {text && (
            <span className="ml-3 text-sm text-gray-600">{text}</span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className={`animate-pulse bg-gray-300 rounded ${sizeClasses[size]}`} />
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className={`animate-pulse space-y-4 w-full max-w-md ${className}`}>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      {text && (
        <p className="text-sm text-gray-600 text-center">{text}</p>
      )}
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
