import { Clock, Home, Mail, RefreshCw, ServerCrash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

/**
 * ServerError (500) Page
 *
 * Displayed when the server encounters an internal error.
 * Provides retry functionality and helpful information.
 */
const ServerError = () => {
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = async () => {
    setRetrying(true);
    setRetryCount((prev) => prev + 1);

    // Simulate retry delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reload the page
    window.location.reload();
  };

  const handleReportIssue = () => {
    const subject = encodeURIComponent("Server Error Report - Edu-Pro LMS");
    const body = encodeURIComponent(
      `I encountered a server error while using Edu-Pro LMS:\n\n` +
        `URL: ${window.location.href}\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `User Agent: ${navigator.userAgent}\n\n` +
        `Please describe what you were doing when this error occurred:\n`
    );
    window.location.href = `mailto:support@edupro.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Server Error Icon */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center">
            <ServerCrash className="w-32 h-32 text-red-500" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl font-bold text-red-100 opacity-20 select-none">
              500
            </div>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Server Error
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Something went wrong on our end.
        </p>
        <p className="text-gray-500 mb-8">
          We're sorry for the inconvenience. Our team has been notified and is
          working to fix the issue.
        </p>

        {/* Retry Counter */}
        {retryCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 inline-block">
            <p className="text-sm text-blue-800">
              Retry attempts: {retryCount}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant="primary"
            onClick={handleRetry}
            icon={RefreshCw}
            size="lg"
            disabled={retrying}
            className={retrying ? "animate-spin" : ""}
          >
            {retrying ? "Retrying..." : "Try Again"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/")}
            icon={Home}
            size="lg"
          >
            Go to Home
          </Button>
          <Button
            variant="outline"
            onClick={handleReportIssue}
            icon={Mail}
            size="lg"
          >
            Report Issue
          </Button>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            What does this mean?
          </h2>
          <div className="text-left space-y-3 text-gray-600">
            <div className="flex items-start">
              <span className="text-red-500 mr-3 mt-1">•</span>
              <p>
                <span className="font-semibold">Server Issue:</span> Our server
                encountered an unexpected condition that prevented it from
                fulfilling your request.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-3 mt-1">•</span>
              <p>
                <span className="font-semibold">Not Your Fault:</span> This is
                an issue on our end, not something you did wrong.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-3 mt-1">•</span>
              <p>
                <span className="font-semibold">Temporary:</span> This error is
                usually temporary. Please try again in a few moments.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-3 mt-1">•</span>
              <p>
                <span className="font-semibold">We're On It:</span> Our
                technical team has been automatically notified and is working to
                resolve the issue.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            What you can do while we fix this
          </h2>
          <div className="text-left space-y-2 text-gray-600">
            <div className="flex items-start">
              <span className="text-blue-500 mr-3">✓</span>
              <p>Wait a few minutes and try refreshing the page</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3">✓</span>
              <p>Check our status page for any ongoing issues</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3">✓</span>
              <p>Clear your browser cache and cookies</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3">✓</span>
              <p>Try accessing the page from a different device or network</p>
            </div>
          </div>
        </div>

        {/* Status Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">⚠️ Persistent Issues?</span> If this
            error continues after several minutes, please contact our support
            team with the error ID below.
          </p>
        </div>

        {/* Help Text */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Need immediate assistance?</span>
            <br />
            Contact support at{" "}
            <a
              href="mailto:support@edupro.com"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              support@edupro.com
            </a>{" "}
            or call our helpline.
          </p>
        </div>

        {/* Error Code */}
        <p className="text-xs text-gray-400 mt-6">
          Error Code: 500 • Internal Server Error • Error ID:{" "}
          {Date.now().toString(36).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default ServerError;
