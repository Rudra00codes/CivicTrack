/**
 * Reusable Alert component for displaying messages
 */

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert = ({ type, title, message, onClose, className = '' }: AlertProps) => {
  const baseClasses = 'p-4 rounded-lg border flex items-start';
  
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconClasses = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`} role="alert">
      <div className="flex-shrink-0 mr-3">
        <span className="text-lg" aria-hidden="true">
          {iconClasses[type]}
        </span>
      </div>
      
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        <p className="text-sm">{message}</p>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 text-current hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 rounded"
          aria-label="Close alert"
        >
          <span className="text-lg" aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
