import { RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import Button from "../common/Button";

/**
 * PWAUpdatePrompt Component
 *
 * Displays a prompt when a new version of the app is available.
 * Uses virtual:pwa-register from vite-plugin-pwa.
 *
 * Features:
 * - Detects new service worker updates
 * - Prompts user to reload for new version
 * - Manual reload button
 * - Automatic update option
 * - Skip update option
 *
 * Usage:
 * <PWAUpdatePrompt />
 */

const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered:", r);
    },
    onRegisterError(error) {
      console.log("SW registration error:", error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowPrompt(false);
  };

  // Show offline ready message
  if (offlineReady && !needRefresh) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-slide-up">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
              <svg
                className="h-5 w-5 text-green-600 dark:text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">
                App Ready to Work Offline
              </h4>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                You can now use Edu-Pro offline!
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-green-400 hover:text-green-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Show update prompt
  if (!showPrompt || !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-sm z-50 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
            <RefreshCw className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              New Version Available
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              A new version of Edu-Pro is ready
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          onClick={handleUpdate}
          variant="primary"
          size="sm"
          className="flex-1"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Update Now
        </Button>
        <Button
          onClick={handleClose}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Later
        </Button>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;
