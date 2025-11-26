import { AlertCircle, Bell, CheckCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";

/**
 * NotificationBell Component
 * Real-time notification bell with badge and dropdown
 *
 * Features:
 * - Real-time notification updates via WebSocket
 * - Badge showing unread count
 * - Dropdown notification list
 * - Mark as read functionality
 * - Clear all notifications
 * - Notification types (info, success, warning, error)
 * - Click to view details
 * - Auto-close on outside click
 *
 * @param {Object} props
 * @param {Function} props.onNotificationClick - Callback when notification is clicked
 * @param {number} props.maxVisible - Max notifications to show (default: 5)
 * @param {string} props.className - Additional CSS classes
 */
const NotificationBell = ({
  onNotificationClick,
  maxVisible = 5,
  className = "",
}) => {
  const { on, emit, isConnected } = useWebSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!isConnected) return;

    const handleNewNotification = (notification) => {
      console.log("🔔 New notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleNotificationUpdate = (updatedNotification) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === updatedNotification.id ? updatedNotification : notif
        )
      );
    };

    const handleNotificationDelete = (notificationId) => {
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    // Subscribe to WebSocket events
    const unsubscribeNew = on("notification:new", handleNewNotification);
    const unsubscribeUpdate = on(
      "notification:update",
      handleNotificationUpdate
    );
    const unsubscribeDelete = on(
      "notification:delete",
      handleNotificationDelete
    );

    // Request initial notifications
    emit("notifications:get", { limit: 20 }, (response) => {
      if (response.success) {
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
      }
    });

    return () => {
      unsubscribeNew();
      unsubscribeUpdate();
      unsubscribeDelete();
    };
  }, [isConnected, on, emit]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    emit("notification:read", { notificationId }, (response) => {
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    emit("notifications:read-all", {}, (response) => {
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
      }
    });
  };

  // Clear all notifications
  const clearAll = () => {
    emit("notifications:clear-all", {}, (response) => {
      if (response.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    });
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setIsOpen(false);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case "warning":
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      case "error":
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}

        {/* Connection indicator */}
        {!isConnected && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.slice(0, maxVisible).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        p-4 hover:bg-gray-50 cursor-pointer transition-colors
                        ${!notification.read ? "bg-blue-50" : ""}
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {timeAgo(notification.createdAt)}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > maxVisible && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
