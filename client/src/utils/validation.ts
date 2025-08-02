/**
 * Validation utility functions for form inputs and business logic
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validators = {
  /**
   * Validates email format
   */
  email: (email: string): ValidationResult => {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validates password strength
   */
  password: (password: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validates that passwords match
   */
  passwordMatch: (password: string, confirmPassword: string): ValidationResult => {
    const errors: string[] = [];
    
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validates issue title
   */
  issueTitle: (title: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!title) {
      errors.push('Title is required');
    } else if (title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    } else if (title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validates issue description
   */
  issueDescription: (description: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!description) {
      errors.push('Description is required');
    } else if (description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    } else if (description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validates issue category
   */
  issueCategory: (category: string): ValidationResult => {
    const validCategories = ['Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Obstructions'];
    const errors: string[] = [];
    
    if (!category) {
      errors.push('Category is required');
    } else if (!validCategories.includes(category)) {
      errors.push('Please select a valid category');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validates file uploads
   */
  imageFiles: (files: File[]): ValidationResult => {
    const errors: string[] = [];
    const maxFiles = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} images allowed`);
    }
    
    files.forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File ${index + 1}: Only JPEG, PNG, and WebP images are allowed`);
      }
      if (file.size > maxFileSize) {
        errors.push(`File ${index + 1}: File size must be less than 5MB`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validates coordinates
   */
  coordinates: (lat: number, lng: number): ValidationResult => {
    const errors: string[] = [];
    
    if (lat < -90 || lat > 90) {
      errors.push('Invalid latitude coordinates');
    }
    if (lng < -180 || lng > 180) {
      errors.push('Invalid longitude coordinates');
    }
    
    return { isValid: errors.length === 0, errors };
  }
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = {
  /**
   * Basic HTML sanitization
   */
  html: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Sanitizes text input
   */
  text: (input: string): string => {
    return input.trim().replace(/\s+/g, ' ');
  }
};
