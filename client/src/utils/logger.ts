/**
 * Production-safe logging utility
 * Prevents sensitive information from being logged in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private isDevelopment: boolean;
  private sensitivePatterns: RegExp[];

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.sensitivePatterns = [
      /password/i,
      /token/i,
      /api[_-]?key/i,
      /secret/i,
      /auth/i,
      /bearer/i,
      /cookie/i,
      /session/i,
      /firebase/i,
      /email.*@/i,
      /credit.*card/i,
      /ssn/i,
      /social.*security/i,
    ];
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    if (typeof data === 'string') {
      // Check if string contains sensitive information
      if (this.sensitivePatterns.some(pattern => pattern.test(data))) {
        return '[REDACTED]';
      }
      return data;
    }
    
    if (typeof data === 'object') {
      const sanitized: any = Array.isArray(data) ? [] : {};
      
      for (const [key, value] of Object.entries(data)) {
        // Check if key contains sensitive information
        if (this.sensitivePatterns.some(pattern => pattern.test(key))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      
      return sanitized;
    }
    
    return data;
  }

  private createLogEntry(level: LogLevel, message: string, context?: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data: this.isDevelopment ? data : this.sanitizeData(data),
    };
  }

  private formatMessage(entry: LogEntry): string {
    const contextStr = entry.context ? `[${entry.context}]` : '';
    const dataStr = entry.data ? ` - ${JSON.stringify(entry.data)}` : '';
    return `${entry.timestamp} ${contextStr} ${entry.message}${dataStr}`;
  }

  debug(message: string, context?: string, data?: any): void {
    if (!this.isDevelopment) return;
    
    const entry = this.createLogEntry('debug', message, context, data);
    console.debug(this.formatMessage(entry));
  }

  info(message: string, context?: string, data?: any): void {
    const entry = this.createLogEntry('info', message, context, data);
    console.info(this.formatMessage(entry));
  }

  warn(message: string, context?: string, data?: any): void {
    const entry = this.createLogEntry('warn', message, context, data);
    console.warn(this.formatMessage(entry));
  }

  error(message: string, context?: string, data?: any): void {
    const entry = this.createLogEntry('error', message, context, data);
    console.error(this.formatMessage(entry));
    
    // In production, you might want to send errors to an external service
    if (!this.isDevelopment) {
      this.sendToErrorService(entry);
    }
  }

  private sendToErrorService(entry: LogEntry): void {
    // Implement error reporting service integration
    // Example: Sentry, LogRocket, etc.
    try {
      // This is where you'd send to your error reporting service
      // For now, we'll just store in sessionStorage as an example
      const errors = JSON.parse(sessionStorage.getItem('app_errors') || '[]');
      errors.push(entry);
      
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      
      sessionStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (error) {
      // Silently fail - don't break the application
    }
  }

  // Performance logging
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  // Group logging for better organization
  group(title: string): void {
    if (this.isDevelopment) {
      console.group(title);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

// Export individual methods for convenience
export const { debug, info, warn, error, time, timeEnd, group, groupEnd } = logger;
