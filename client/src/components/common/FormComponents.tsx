/**
 * Enhanced form components with validation and better UX
 */

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef, useState } from 'react';
import { ExclamationCircleIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Base input component with enhanced validation feedback
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  hint,
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  loading = false,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    default: 'border border-gray-300 bg-white',
    filled: 'border-0 bg-gray-100',
    outlined: 'border-2 border-gray-300 bg-transparent'
  };

  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : success 
    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
    : 'focus:border-blue-500 focus:ring-blue-500';

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            block w-full rounded-lg shadow-sm transition-colors duration-200
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${stateClasses}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || type === 'password' ? 'pr-10' : ''}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
          disabled={loading || props.disabled}
          {...props}
        />
        
        {(rightIcon || type === 'password') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            ) : (
              <div className="h-5 w-5 text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      
      {(error || success || hint) && (
        <div className="flex items-start space-x-1 mt-1">
          {(error || success) && (
            <div className="flex-shrink-0 mt-0.5">
              {error ? (
                <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              )}
            </div>
          )}
          <span className={`text-xs ${
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
          }`}>
            {error || success || hint}
          </span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Enhanced Textarea component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  showCharCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  success,
  hint,
  resize = 'vertical',
  showCharCount = false,
  maxLength,
  className = '',
  value = '',
  ...props
}, ref) => {
  const charCount = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && charCount > maxLength * 0.9;
  const isOverLimit = maxLength && charCount > maxLength;

  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : success 
    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        maxLength={maxLength}
        value={value}
        className={`
          block w-full rounded-lg border shadow-sm px-4 py-2.5 text-sm
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${stateClasses}
          ${resizeClasses[resize]}
          ${className}
        `}
        {...props}
      />
      
      {(showCharCount || error || success || hint) && (
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-1">
            {(error || success) && (
              <div className="flex-shrink-0 mt-0.5">
                {error ? (
                  <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
            {(error || success || hint) && (
              <span className={`text-xs ${
                error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
              }`}>
                {error || success || hint}
              </span>
            )}
          </div>
          
          {showCharCount && maxLength && (
            <span className={`text-xs ${
              isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'
            }`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Enhanced Select component
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  placeholder?: string;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  success,
  hint,
  placeholder,
  options,
  className = '',
  ...props
}, ref) => {
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : success 
    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        className={`
          block w-full rounded-lg border shadow-sm px-4 py-2.5 text-sm
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${stateClasses}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {(error || success || hint) && (
        <div className="flex items-start space-x-1 mt-1">
          {(error || success) && (
            <div className="flex-shrink-0 mt-0.5">
              {error ? (
                <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              )}
            </div>
          )}
          <span className={`text-xs ${
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
          }`}>
            {error || success || hint}
          </span>
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
