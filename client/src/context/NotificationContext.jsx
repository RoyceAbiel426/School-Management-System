import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-remove after duration
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods
  const success = (message, options = {}) => {
    addNotification({
      type: "success",
      message,
      ...options,
    });
  };

  const error = (message, options = {}) => {
    addNotification({
      type: "error",
      message,
      ...options,
    });
  };

  const warning = (message, options = {}) => {
    addNotification({
      type: "warning",
      message,
      ...options,
    });
  };

  const info = (message, options = {}) => {
    addNotification({
      type: "info",
      message,
      ...options,
    });
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export default NotificationContext;
