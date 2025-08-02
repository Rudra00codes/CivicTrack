import { Component, ErrorInfo, ReactNode } from 'react';
import Alert from './common/Alert';
import Button from './common/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      // Add error reporting service here (e.g., Sentry)
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-6xl font-bold text-gray-400 mb-4">😔</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>
            </div>

            <Alert 
              type="error" 
              message="An unexpected error occurred while loading the application."
              className="mb-6"
            />

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="secondary"
                className="w-full"
              >
                Reload Page
              </Button>

              <Button
                onClick={() => window.location.href = '/'}
                variant="ghost"
                className="w-full"
              >
                Go to Home
              </Button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 p-4 bg-red-50 rounded-lg">
                <summary className="cursor-pointer text-red-800 font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                If this problem persists, please{' '}
                <a 
                  href="mailto:support@civictrack.com" 
                  className="text-blue-600 hover:underline"
                >
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
