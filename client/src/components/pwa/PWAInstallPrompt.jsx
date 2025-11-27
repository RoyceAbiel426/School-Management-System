import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../common/Button";

/**
 * PWAInstallPrompt Component
 *
 * Displays a custom install prompt for Progressive Web App.
 * Listens for the beforeinstallprompt event and shows a custom UI.
 *
 * Features:
 * - Custom install prompt (instead of browser default)
 * - Install success tracking
 * - Dismissible with localStorage persistence
 * - Mobile and desktop support
 * - Smooth animations
 *
 * Usage:
 * <PWAInstallPrompt />
 */

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState("desktop");

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed the prompt
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed =
      (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt again after 7 days
    if (daysSinceDismissed < 7) {
      return;
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
      setPlatform("ios");
    } else if (isAndroid) {
      setPlatform("android");
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default prompt
      e.preventDefault();

      // Store the event for later use
      setDeferredPrompt(e);

      // Show custom prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000); // Show after 3 seconds
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);

      // Track installation
      if (window.gtag) {
        window.gtag("event", "pwa_install", {
          event_category: "PWA",
          event_label: "App Installed",
        });
      }

      // Show success message
      console.log("PWA installed successfully!");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");

      // Track acceptance
      if (window.gtag) {
        window.gtag("event", "pwa_install_accepted", {
          event_category: "PWA",
          event_label: "Install Accepted",
        });
      }
    } else {
      console.log("User dismissed the install prompt");

      // Track dismissal
      if (window.gtag) {
        window.gtag("event", "pwa_install_dismissed", {
          event_category: "PWA",
          event_label: "Install Dismissed",
        });
      }
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);

    // Store dismissal time
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());

    // Track dismissal
    if (window.gtag) {
      window.gtag("event", "pwa_prompt_dismissed", {
        event_category: "PWA",
        event_label: "Prompt Dismissed",
      });
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if prompt is not available
  if (!showPrompt) {
    return null;
  }

  // iOS specific instructions
  if (platform === "ios") {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl border-t-2 border-primary-500 p-4 z-50 animate-slide-up">
        <div className="max-w-md mx-auto">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <Smartphone className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Install Edu-Pro
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Install Edu-Pro on your iPhone for a better experience:
          </p>

          <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              Tap the Share button{" "}
              <span className="mx-1 inline-flex items-center justify-center w-5 h-5 bg-primary-100 text-primary-600 rounded">
                ↑
              </span>{" "}
              at the bottom
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              Scroll down and tap "Add to Home Screen"
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              Tap "Add" in the top right corner
            </li>
          </ol>

          <Button onClick={handleDismiss} variant="outline" className="w-full">
            Got it
          </Button>
        </div>
      </div>
    );
  }

  // Android and Desktop (standard install prompt)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl border-t-2 border-primary-500 p-4 z-50 animate-slide-up">
      <div className="max-w-md mx-auto">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <Download className="h-6 w-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Install Edu-Pro
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Install Edu-Pro for quick access, offline support, and a native app
          experience. Works like a regular app!
        </p>

        <div className="flex gap-3">
          <Button
            onClick={handleInstallClick}
            variant="primary"
            className="flex-1"
          >
            Install Now
          </Button>
          <Button onClick={handleDismiss} variant="outline" className="flex-1">
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
