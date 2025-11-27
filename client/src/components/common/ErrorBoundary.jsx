import { AlertTriangle, Home, Mail, RefreshCw } from "lucide-react";
import React from "react";
import Button from "./Button";

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 *
 * Features:
 * - Error catching and logging
 * - User-friendly error messages
 * - Recovery options (retry, go home, report)
 * - Development vs Production error details
 * - Error tracking integration ready
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Update state with error details
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to external error tracking service (e.g., Sentry)
    if (window.logErrorToService) {
      window.logErrorToService(error, errorInfo);
    }

    // Track error in analytics
    if (window.gtag) {
      window.gtag("event", "exception", {
        description: error.toString(),
        fatal: true,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    const subject = encodeURIComponent("Error Report - Edu-Pro LMS");
    const body = encodeURIComponent(
      `I encountered an error while using Edu-Pro LMS:\n\n` +
        `Error: ${error?.toString()}\n\n` +
        `Component Stack: ${errorInfo?.componentStack}\n\n` +
        `User Agent: ${navigator.userAgent}\n` +
        `URL: ${window.location.href}\n` +
        `Timestamp: ${new Date().toISOString()}`
    );
    window.location.href = `mailto:support@edupro.com?subject=${subject}&body=${body}`;
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      const isDevelopment = process.env.NODE_ENV === "development";

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Oops! Something went wrong
                    </h1>
                    <p className="text-white/90 mt-1">
                      We apologize for the inconvenience
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Error Message */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    What happened?
                  </h2>
                  <p className="text-gray-600">
                    The application encountered an unexpected error and couldn't
                    continue.
                    {errorCount > 1 && (
                      <span className="text-orange-600 font-medium">
                        {" "}
                        This error has occurred {errorCount} times.
                      </span>
                    )}
                  </p>
                </div>

                {/* Development Error Details */}
                {isDevelopment && error && (
                  <div className="mb-6">
                    <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                        Error Details (Development Mode)
                      </summary>
                      <div className="mt-4 space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-700 mb-1">
                            Error Message:
                          </h3>
                          <pre className="bg-red-50 text-red-800 p-3 rounded text-sm overflow-x-auto">
                            {error.toString()}
                          </pre>
                        </div>
                        {errorInfo && (
                          <div>
                            <h3 className="font-medium text-gray-700 mb-1">
                              Component Stack:
                            </h3>
                            <pre className="bg-gray-100 text-gray-800 p-3 rounded text-xs overflow-x-auto max-h-64">
                              {errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                        {error.stack && (
                          <div>
                            <h3 className="font-medium text-gray-700 mb-1">
                              Stack Trace:
                            </h3>
                            <pre className="bg-gray-100 text-gray-800 p-3 rounded text-xs overflow-x-auto max-h-64">
                              {error.stack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                )}

                {/* What to do */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    What can you do?
                  </h2>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>
                        Try refreshing the page or clicking "Try Again" below
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>
                        Go back to the home page and try a different action
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Clear your browser cache and cookies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>
                        If the problem persists, please report it to support
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={this.handleReset}
                    icon={RefreshCw}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={this.handleGoHome}
                    icon={Home}
                  >
                    Go to Home
                  </Button>
                  <Button
                    variant="outline"
                    onClick={this.handleReportError}
                    icon={Mail}
                  >
                    Report Error
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Error ID: {Date.now().toString(36).toUpperCase()} • Timestamp:{" "}
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Need help? Contact us at{" "}
                <a
                  href="mailto:support@edupro.com"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  support@edupro.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
