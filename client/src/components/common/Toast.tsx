/**
 * Toast notification system for better user feedback
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Alert from './Alert';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export const ToastProvider = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      autoClose: true,
      autoCloseDelay: 5000,
      ...toastData,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Limit the number of toasts
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      
      {/* Toast Container */}
      <div 
        className={`fixed z-50 ${positionClasses[position]} space-y-2 max-w-sm w-full`}
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="transform transition-all duration-300 ease-in-out"
          >
            <Alert
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
              autoClose={toast.autoClose}
              autoCloseDelay={toast.autoCloseDelay}
              persistent={toast.persistent}
              actions={toast.actions}
              className="shadow-lg"
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Convenience hook for common toast patterns
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (message: string, title?: string) => 
      addToast({ type: 'success', message, title }),
    
    error: (message: string, title?: string) => 
      addToast({ type: 'error', message, title, persistent: true }),
    
    warning: (message: string, title?: string) => 
      addToast({ type: 'warning', message, title }),
    
    info: (message: string, title?: string) => 
      addToast({ type: 'info', message, title }),

    loading: (message: string, title?: string) => 
      addToast({ 
        type: 'info', 
        message, 
        title, 
        persistent: true,
        autoClose: false 
      }),

    promise: async <T,>(
      promise: Promise<T>,
      {
        loading = 'Loading...',
        success = 'Success!',
        error = 'Something went wrong'
      }: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: any) => string);
      } = {}
    ) => {
      addToast({
        type: 'info',
        message: loading,
        persistent: true,
        autoClose: false
      });

      try {
        const result = await promise;
        addToast({
          type: 'success',
          message: typeof success === 'function' ? success(result) : success
        });
        return result;
      } catch (err) {
        addToast({
          type: 'error',
          message: typeof error === 'function' ? error(err) : error,
          persistent: true
        });
        throw err;
      }
    }
  };
};
