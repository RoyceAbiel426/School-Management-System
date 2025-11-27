import { Bell, BellOff, Download, Trash2, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import {
  clearAllCaches,
  formatCacheSize,
  getCacheSize,
  getDisplayMode,
  getPushSubscription,
  isOnline,
  isPWAInstalled,
  isPushNotificationSupported,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "../../utils/pwaHelpers";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";

/**
 * PWASettings Component
 *
 * Displays PWA settings and management options.
 * Allows users to:
 * - View install status
 * - Manage notifications
 * - Clear cache
 * - View cache size
 * - View connection status
 *
 * Usage:
 * <PWASettings />
 */

const PWASettings = () => {
  const [installed, setInstalled] = useState(false);
  const [displayMode, setDisplayMode] = useState("browser");
  const [online, setOnline] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState("default");
  const [cacheSize, setCacheSize] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check install status
    setInstalled(isPWAInstalled());
    setDisplayMode(getDisplayMode());

    // Check online status
    setOnline(isOnline());

    // Check notification permission
    if (isPushNotificationSupported()) {
      setNotificationPermission(Notification.permission);
      checkNotificationStatus();
    }

    // Get cache size
    updateCacheSize();

    // Listen for online/offline events
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const subscription = await getPushSubscription();
      setNotificationsEnabled(!!subscription);
    } catch (error) {
      console.error("Error checking notification status:", error);
    }
  };

  const updateCacheSize = async () => {
    try {
      const size = await getCacheSize();
      setCacheSize(size);
    } catch (error) {
      console.error("Error getting cache size:", error);
    }
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        // In production, replace with your actual VAPID public key
        const vapidKey = "YOUR_VAPID_PUBLIC_KEY_HERE";

        try {
          const subscription = await subscribeToPushNotifications(vapidKey);
          console.log("Push subscription:", subscription);
          setNotificationsEnabled(true);

          // TODO: Send subscription to server
          // await api.post('/notifications/subscribe', { subscription });
        } catch (error) {
          console.error("Error subscribing to push:", error);
        }
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    try {
      const success = await unsubscribeFromPushNotifications();
      if (success) {
        setNotificationsEnabled(false);

        // TODO: Remove subscription from server
        // await api.post('/notifications/unsubscribe');
      }
    } catch (error) {
      console.error("Error disabling notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all cached data? The app will reload."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await clearAllCaches();
      setCacheSize(0);

      // Reload the page to ensure fresh content
      window.location.reload();
    } catch (error) {
      console.error("Error clearing cache:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Install Status */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            App Status
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Installation Status
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {installed ? "Installed as app" : "Running in browser"}
                </p>
              </div>
              <Badge variant={installed ? "success" : "warning"}>
                {installed ? "Installed" : "Not Installed"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Mode
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {displayMode}
                </p>
              </div>
              <Badge variant="info" className="capitalize">
                {displayMode}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Connection Status
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {online ? "Connected to internet" : "Offline mode"}
                </p>
              </div>
              <Badge variant={online ? "success" : "danger"}>
                {online ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      {isPushNotificationSupported() && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Push Notifications
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Receive updates about attendance, results, and announcements
                  </p>
                </div>
                <Button
                  onClick={
                    notificationsEnabled
                      ? handleDisableNotifications
                      : handleEnableNotifications
                  }
                  variant={notificationsEnabled ? "danger" : "primary"}
                  size="sm"
                  disabled={loading || notificationPermission === "denied"}
                >
                  {notificationsEnabled ? (
                    <>
                      <BellOff className="h-4 w-4 mr-1" />
                      Disable
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-1" />
                      Enable
                    </>
                  )}
                </Button>
              </div>

              {notificationPermission === "denied" && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    Notifications are blocked. Please enable them in your
                    browser settings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Cache Management */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Storage & Cache
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cache Size
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCacheSize(cacheSize)} of cached data
                </p>
              </div>
              <Button
                onClick={handleClearCache}
                variant="outline"
                size="sm"
                disabled={loading || cacheSize === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Cache
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Cached data allows the app to work offline. Clearing the cache
                will require re-downloading data.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Install Instructions */}
      {!installed && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Install Edu-Pro
            </h3>

            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Install Edu-Pro as an app for:
              </p>

              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Quick access from home screen
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Offline support
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Native app experience
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  Push notifications
                </li>
              </ul>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Look for the install button in your browser's menu, or wait
                  for the install prompt to appear.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PWASettings;
