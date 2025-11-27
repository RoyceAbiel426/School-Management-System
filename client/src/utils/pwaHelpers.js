/**
 * PWA Utilities
 *
 * Helper functions for Progressive Web App features including:
 * - Service worker registration
 * - Push notifications
 * - Background sync
 * - Cache management
 * - Install detection
 */

/**
 * Check if app is installed as PWA
 * @returns {boolean} True if installed
 */
export const isPWAInstalled = () => {
  // Check if running in standalone mode
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  // Check if running as installed app (iOS)
  if (window.navigator.standalone === true) {
    return true;
  }

  return false;
};

/**
 * Check if PWA install is supported
 * @returns {boolean} True if supported
 */
export const isPWAInstallSupported = () => {
  return "beforeinstallprompt" in window;
};

/**
 * Check if service workers are supported
 * @returns {boolean} True if supported
 */
export const isServiceWorkerSupported = () => {
  return "serviceWorker" in navigator;
};

/**
 * Check if push notifications are supported
 * @returns {boolean} True if supported
 */
export const isPushNotificationSupported = () => {
  return "PushManager" in window && "Notification" in window;
};

/**
 * Check if background sync is supported
 * @returns {boolean} True if supported
 */
export const isBackgroundSyncSupported = () => {
  return "serviceWorker" in navigator && "SyncManager" in window;
};

/**
 * Request notification permission
 * @returns {Promise<NotificationPermission>} Permission state
 */
export const requestNotificationPermission = async () => {
  if (!isPushNotificationSupported()) {
    throw new Error("Push notifications not supported");
  }

  const permission = await Notification.requestPermission();
  return permission;
};

/**
 * Subscribe to push notifications
 * @param {string} vapidPublicKey - VAPID public key from server
 * @returns {Promise<PushSubscription>} Push subscription
 */
export const subscribeToPushNotifications = async (vapidPublicKey) => {
  if (!isPushNotificationSupported()) {
    throw new Error("Push notifications not supported");
  }

  // Request permission first
  const permission = await requestNotificationPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission denied");
  }

  // Get service worker registration
  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push manager
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  return subscription;
};

/**
 * Unsubscribe from push notifications
 * @returns {Promise<boolean>} Success state
 */
export const unsubscribeFromPushNotifications = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const success = await subscription.unsubscribe();
    return success;
  }

  return false;
};

/**
 * Get current push subscription
 * @returns {Promise<PushSubscription|null>} Current subscription or null
 */
export const getPushSubscription = async () => {
  if (!isPushNotificationSupported()) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  return subscription;
};

/**
 * Show local notification
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 * @returns {Promise<void>}
 */
export const showNotification = async (title, options = {}) => {
  if (!isPushNotificationSupported()) {
    console.warn("Notifications not supported");
    return;
  }

  const permission = await requestNotificationPermission();

  if (permission !== "granted") {
    console.warn("Notification permission not granted");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  await registration.showNotification(title, {
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    ...options,
  });
};

/**
 * Register background sync
 * @param {string} tag - Sync tag identifier
 * @returns {Promise<void>}
 */
export const registerBackgroundSync = async (tag) => {
  if (!isBackgroundSyncSupported()) {
    throw new Error("Background sync not supported");
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register(tag);
};

/**
 * Clear all caches
 * @returns {Promise<void>}
 */
export const clearAllCaches = async () => {
  if (!("caches" in window)) {
    return;
  }

  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
};

/**
 * Get cache size
 * @returns {Promise<number>} Total cache size in bytes
 */
export const getCacheSize = async () => {
  if (!("caches" in window)) {
    return 0;
  }

  let totalSize = 0;
  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
};

/**
 * Format cache size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatCacheSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Convert VAPID key from base64 to Uint8Array
 * @param {string} base64String - Base64 encoded VAPID key
 * @returns {Uint8Array} Uint8Array for push subscription
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

/**
 * Check connection status
 * @returns {boolean} True if online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Listen for online/offline events
 * @param {Function} onOnline - Callback when going online
 * @param {Function} onOffline - Callback when going offline
 * @returns {Function} Cleanup function
 */
export const listenToConnectionStatus = (onOnline, onOffline) => {
  const handleOnline = () => onOnline?.();
  const handleOffline = () => onOffline?.();

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};

/**
 * Track PWA install event
 * @param {Function} callback - Callback when app is installed
 * @returns {Function} Cleanup function
 */
export const trackPWAInstall = (callback) => {
  const handleInstall = () => callback?.();
  window.addEventListener("appinstalled", handleInstall);

  return () => {
    window.removeEventListener("appinstalled", handleInstall);
  };
};

/**
 * Get display mode
 * @returns {string} Display mode (standalone, fullscreen, minimal-ui, browser)
 */
export const getDisplayMode = () => {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return "standalone";
  }
  if (window.matchMedia("(display-mode: fullscreen)").matches) {
    return "fullscreen";
  }
  if (window.matchMedia("(display-mode: minimal-ui)").matches) {
    return "minimal-ui";
  }
  return "browser";
};

/**
 * PWA Analytics
 */
export const pwaAnalytics = {
  /**
   * Track PWA install
   */
  trackInstall: () => {
    if (window.gtag) {
      window.gtag("event", "pwa_install", {
        event_category: "PWA",
        event_label: "App Installed",
      });
    }
  },

  /**
   * Track PWA usage
   */
  trackUsage: () => {
    const displayMode = getDisplayMode();
    if (window.gtag) {
      window.gtag("event", "pwa_usage", {
        event_category: "PWA",
        event_label: `Display Mode: ${displayMode}`,
      });
    }
  },

  /**
   * Track offline usage
   */
  trackOffline: () => {
    if (window.gtag) {
      window.gtag("event", "pwa_offline", {
        event_category: "PWA",
        event_label: "Offline Usage",
      });
    }
  },
};

export default {
  isPWAInstalled,
  isPWAInstallSupported,
  isServiceWorkerSupported,
  isPushNotificationSupported,
  isBackgroundSyncSupported,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getPushSubscription,
  showNotification,
  registerBackgroundSync,
  clearAllCaches,
  getCacheSize,
  formatCacheSize,
  isOnline,
  listenToConnectionStatus,
  trackPWAInstall,
  getDisplayMode,
  pwaAnalytics,
};
