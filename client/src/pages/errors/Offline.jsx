import { Activity, Globe, RefreshCw, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

/**
 * Offline Page
 *
 * Displayed when the user loses internet connection.
 * Automatically detects when connection is restored.
 */
const Offline = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically retry after connection is restored
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkConnection = async () => {
    setChecking(true);
    setLastChecked(new Date());

    try {
      // Try to fetch a small resource to verify actual connectivity
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-cache",
      });

      if (response.ok) {
        setIsOnline(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      setIsOnline(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center">
            <WifiOff
              className="w-32 h-32 text-gray-400 animate-pulse"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full ${
              isOnline
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <Activity
              className={`w-4 h-4 mr-2 ${isOnline ? "animate-pulse" : ""}`}
            />
            <span className="font-medium">
              {isOnline ? "Connection Restored!" : "No Internet Connection"}
            </span>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {isOnline ? "Back Online!" : "You're Offline"}
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          {isOnline
            ? "Your internet connection has been restored."
            : "It looks like you've lost your internet connection."}
        </p>
        <p className="text-gray-500 mb-8">
          {isOnline
            ? "Redirecting you back..."
            : "Please check your network connection and try again."}
        </p>

        {/* Action Buttons */}
        {!isOnline && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              variant="primary"
              onClick={checkConnection}
              icon={checking ? RefreshCw : Globe}
              size="lg"
              disabled={checking}
              className={checking ? "animate-spin" : ""}
            >
              {checking ? "Checking..." : "Check Connection"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              icon={RefreshCw}
              size="lg"
            >
              Reload Page
            </Button>
          </div>
        )}

        {/* Last Checked */}
        {lastChecked && (
          <div className="mb-8">
            <p className="text-sm text-gray-500">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Troubleshooting Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
            <Globe className="w-5 h-5 mr-2 text-blue-500" />
            Troubleshooting Steps
          </h2>
          <div className="text-left space-y-3 text-gray-600">
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">1.</span>
              <p>
                <span className="font-semibold">Check Your Wi-Fi/Data:</span>{" "}
                Make sure you're connected to a network and the signal is
                strong.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">2.</span>
              <p>
                <span className="font-semibold">Restart Your Router:</span>{" "}
                Sometimes a quick router restart can resolve connectivity
                issues.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">3.</span>
              <p>
                <span className="font-semibold">Check Other Devices:</span>{" "}
                Verify if other devices can connect to the internet.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">4.</span>
              <p>
                <span className="font-semibold">Airplane Mode:</span> Toggle
                airplane mode on and off to reset your connection.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 mt-1">5.</span>
              <p>
                <span className="font-semibold">Contact Your ISP:</span> If the
                problem persists, contact your internet service provider.
              </p>
            </div>
          </div>
        </div>

        {/* Limited Functionality Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">⚠️ Limited Functionality:</span>{" "}
            Some features may be cached and available offline, but full
            functionality requires an internet connection.
          </p>
        </div>

        {/* Help Text */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Still having issues?</span>
            <br />
            Once back online, contact support at{" "}
            <a
              href="mailto:support@edupro.com"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              support@edupro.com
            </a>
          </p>
        </div>

        {/* Auto-retry Notice */}
        {!isOnline && (
          <p className="text-xs text-gray-400 mt-6">
            This page will automatically reload when connection is restored
          </p>
        )}
      </div>
    </div>
  );
};

export default Offline;
