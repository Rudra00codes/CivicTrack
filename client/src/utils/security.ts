/**
 * Security utilities for frontend application
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (content: string): string => {
  const div = document.createElement('div');
  div.textContent = content;
  return div.innerHTML;
};

/**
 * Validate and sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate a random string for CSRF tokens
 */
export const generateRandomString = (length: number = 32): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * Validate file uploads
 */
export const validateFileUpload = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only images are allowed.'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File too large. Maximum size is 5MB.'
    };
  }
  
  return { isValid: true };
};

/**
 * Secure localStorage wrapper with encryption-like obfuscation
 */
export class SecureStorage {
  private static encode(value: string): string {
    return btoa(encodeURIComponent(value));
  }
  
  private static decode(value: string): string {
    try {
      return decodeURIComponent(atob(value));
    } catch {
      return '';
    }
  }
  
  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, this.encode(value));
    } catch (error) {
      console.error('Failed to store item securely:', error);
    }
  }
  
  static getItem(key: string): string | null {
    try {
      const item = localStorage.getItem(key);
      return item ? this.decode(item) : null;
    } catch (error) {
      console.error('Failed to retrieve item securely:', error);
      return null;
    }
  }
  
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  
  static clear(): void {
    localStorage.clear();
  }
}

/**
 * Content Security Policy helper
 */
export const setCSPHeaders = (): void => {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://apis.google.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.github.com https://*.firebase.com https://*.googleapis.com",
    "frame-src 'self' https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');
  
  document.head.appendChild(meta);
};

/**
 * Rate limiting helper for client-side
 */
export class RateLimiter {
  private static requests: Map<string, number[]> = new Map();
  
  static isAllowed(key: string, maxRequests: number = 10, timeWindow: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove expired requests
    const validRequests = requests.filter(timestamp => now - timestamp < timeWindow);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}
