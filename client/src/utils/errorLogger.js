/**
 * Error Logger Utility
 *
 * Centralized error logging for the application.
 * Supports multiple logging destinations (console, external services, analytics).
 *
 * Integration Options:
 * - Sentry (recommended for production)
 * - LogRocket
 * - Rollbar
 * - Custom backend endpoint
 *
 * Usage:
 * import { logError, logWarning, logInfo } from '@/utils/errorLogger';
 *
 * logError(error, { component: 'MyComponent', action: 'fetchData' });
 */

// Configuration
const config = {
  enableConsoleLogging: process.env.NODE_ENV === "development",
  enableSentry: process.env.REACT_APP_ENABLE_SENTRY === "true",
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  sentryDSN: process.env.REACT_APP_SENTRY_DSN,
  logToBackend: process.env.REACT_APP_LOG_TO_BACKEND === "true",
  backendLogEndpoint: process.env.REACT_APP_LOG_ENDPOINT || "/api/v1/logs",
};

// Error severity levels
export const ErrorSeverity = {
  FATAL: "fatal",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  DEBUG: "debug",
};

/**
 * Initialize error logging services
 * Call this once in your app's entry point (main.jsx)
 */
export const initializeErrorLogging = () => {
  // Initialize Sentry
  if (config.enableSentry && config.sentryDSN) {
    try {
      // Import Sentry dynamically to avoid bundling if not used
      import("@sentry/react").then((Sentry) => {
        Sentry.init({
          dsn: config.sentryDSN,
          environment: process.env.NODE_ENV,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
          ],
          // Performance Monitoring
          tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
          // Session Replay
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
          // Source maps
          beforeSend(event) {
            // Filter out sensitive data
            if (event.request) {
              delete event.request.cookies;
              delete event.request.headers;
            }
            return event;
          },
        });

        console.log("✅ Sentry initialized successfully");
      });
    } catch (error) {
      console.warn("⚠️ Failed to initialize Sentry:", error);
    }
  }

  // Set up global error handlers
  setupGlobalErrorHandlers();
};

/**
 * Set up global error handlers for unhandled errors
 */
const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);

    logError(event.reason || new Error("Unhandled Promise Rejection"), {
      type: "unhandledrejection",
      promise: event.promise,
    });

    // Prevent default browser error handling
    event.preventDefault();
  });

  // Handle global errors
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);

    logError(event.error || new Error(event.message), {
      type: "global",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
};

/**
 * Get user context for error logging
 */
const getUserContext = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Get device and browser information
 */
const getDeviceInfo = () => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  screenResolution: `${window.screen.width}x${window.screen.height}`,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  online: navigator.onLine,
  cookieEnabled: navigator.cookieEnabled,
});

/**
 * Format error for logging
 */
const formatError = (error, context = {}, severity = ErrorSeverity.ERROR) => {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  return {
    message: errorObj.message,
    name: errorObj.name,
    stack: errorObj.stack,
    severity,
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      url: window.location.href,
      referrer: document.referrer,
    },
    user: getUserContext(),
    device: getDeviceInfo(),
  };
};

/**
 * Log to console (development)
 */
const logToConsole = (formattedError) => {
  if (!config.enableConsoleLogging) return;

  const { severity, message, context, stack } = formattedError;

  const styles = {
    [ErrorSeverity.FATAL]:
      "color: white; background: #8B0000; padding: 2px 5px; border-radius: 3px;",
    [ErrorSeverity.ERROR]:
      "color: white; background: #DC2626; padding: 2px 5px; border-radius: 3px;",
    [ErrorSeverity.WARNING]:
      "color: white; background: #F59E0B; padding: 2px 5px; border-radius: 3px;",
    [ErrorSeverity.INFO]:
      "color: white; background: #3B82F6; padding: 2px 5px; border-radius: 3px;",
    [ErrorSeverity.DEBUG]:
      "color: white; background: #6B7280; padding: 2px 5px; border-radius: 3px;",
  };

  console.group(
    `%c${severity.toUpperCase()}`,
    styles[severity] || styles[ErrorSeverity.ERROR]
  );
  console.error(message);
  if (context && Object.keys(context).length > 0) {
    console.log("Context:", context);
  }
  if (stack) {
    console.log("Stack:", stack);
  }
  console.groupEnd();
};

/**
 * Log to Sentry
 */
const logToSentry = async (formattedError) => {
  if (!config.enableSentry) return;

  try {
    const Sentry = await import("@sentry/react");

    Sentry.withScope((scope) => {
      // Set severity
      scope.setLevel(formattedError.severity);

      // Set user context
      if (formattedError.user) {
        scope.setUser(formattedError.user);
      }

      // Set additional context
      scope.setContext("error_context", formattedError.context);
      scope.setContext("device", formattedError.device);

      // Capture exception
      Sentry.captureException(new Error(formattedError.message), {
        extra: formattedError,
      });
    });
  } catch (error) {
    console.warn("Failed to log to Sentry:", error);
  }
};

/**
 * Log to backend
 */
const logToBackend = async (formattedError) => {
  if (!config.logToBackend) return;

  try {
    const token = localStorage.getItem("token");

    await fetch(config.backendLogEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formattedError),
    });
  } catch (error) {
    console.warn("Failed to log to backend:", error);
  }
};

/**
 * Log to analytics
 */
const logToAnalytics = (formattedError) => {
  if (!config.enableAnalytics) return;

  try {
    // Google Analytics
    if (window.gtag) {
      window.gtag("event", "exception", {
        description: formattedError.message,
        fatal: formattedError.severity === ErrorSeverity.FATAL,
      });
    }

    // Custom analytics
    if (window.analytics) {
      window.analytics.track("Error Occurred", {
        message: formattedError.message,
        severity: formattedError.severity,
        component: formattedError.context.component,
      });
    }
  } catch (error) {
    console.warn("Failed to log to analytics:", error);
  }
};

/**
 * Main error logging function
 */
export const logError = (error, context = {}) => {
  const formattedError = formatError(error, context, ErrorSeverity.ERROR);

  logToConsole(formattedError);
  logToSentry(formattedError);
  logToBackend(formattedError);
  logToAnalytics(formattedError);

  return formattedError;
};

/**
 * Log fatal errors (application-breaking)
 */
export const logFatal = (error, context = {}) => {
  const formattedError = formatError(error, context, ErrorSeverity.FATAL);

  logToConsole(formattedError);
  logToSentry(formattedError);
  logToBackend(formattedError);
  logToAnalytics(formattedError);

  return formattedError;
};

/**
 * Log warnings
 */
export const logWarning = (message, context = {}) => {
  const formattedError = formatError(
    new Error(message),
    context,
    ErrorSeverity.WARNING
  );

  logToConsole(formattedError);
  logToSentry(formattedError);
  logToBackend(formattedError);

  return formattedError;
};

/**
 * Log info messages
 */
export const logInfo = (message, context = {}) => {
  const formattedError = formatError(
    new Error(message),
    context,
    ErrorSeverity.INFO
  );

  logToConsole(formattedError);

  return formattedError;
};

/**
 * Log debug messages (development only)
 */
export const logDebug = (message, context = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  const formattedError = formatError(
    new Error(message),
    context,
    ErrorSeverity.DEBUG
  );

  logToConsole(formattedError);

  return formattedError;
};

/**
 * Make errorLogger available globally for use in ErrorBoundary
 */
if (typeof window !== "undefined") {
  window.logErrorToService = logError;
}

/**
 * Export for use in components
 */
export default {
  init: initializeErrorLogging,
  logError,
  logFatal,
  logWarning,
  logInfo,
  logDebug,
  ErrorSeverity,
};
