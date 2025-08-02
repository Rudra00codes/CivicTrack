/**
 * Reusable Loading component with different variants
 */

interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loading = ({ 
  variant = 'spinner', 
  size = 'md', 
  text, 
  className = '' 
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div 
          className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <p className="mt-2 text-sm text-gray-600">{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        {text && (
          <span className="ml-3 text-sm text-gray-600">{text}</span>
        )}
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
      <div className="bg-gray-200 rounded h-4 w-1/2 mb-2" />
      <div className="bg-gray-200 rounded h-4 w-5/6" />
    </div>
  );
};

export default Loading;
