/**
 * Custom error classes for better error handling and user experience
 */

import logger from './logger';

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class LocationError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'LocationError';
  }
}

/**
 * Error handling utility functions
 */
export const errorHandler = {
  /**
   * Handles authentication errors and returns user-friendly messages
   */
  handleAuthError: (error: any): string => {
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'No account found with this email address.';
        case 'auth/wrong-password':
          return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
          return 'An account with this email already exists.';
        case 'auth/weak-password':
          return 'Password should be at least 6 characters long.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later.';
        default:
          return error.message || 'Authentication failed. Please try again.';
      }
    }
    return error.message || 'An unexpected error occurred.';
  },

  /**
   * Handles network errors
   */
  handleNetworkError: (error: any): string => {
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network and try again.';
    }
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'You are not authorized to perform this action.';
        case 403:
          return 'Access denied. You do not have permission for this action.';
        case 404:
          return 'The requested resource was not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Network error (${error.response.status}). Please try again.`;
      }
    }
    
    return 'Network error. Please check your connection and try again.';
  },

  /**
   * Handles geolocation errors
   */
  handleLocationError: (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location services and refresh the page.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable. Using default location.';
      case error.TIMEOUT:
        return 'Location request timed out. Using default location.';
      default:
        return 'Unable to retrieve your location. Using default location.';
    }
  },

  /**
   * Generic error logger
   */
  logError: (error: Error, context?: string) => {
    logger.error(error.message, context, {
      name: error.name,
      stack: import.meta.env.DEV ? error.stack : undefined,
    });
  }
};
