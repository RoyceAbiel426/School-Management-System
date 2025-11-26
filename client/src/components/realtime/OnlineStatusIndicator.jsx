import { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";

/**
 * OnlineStatusIndicator Component
 * Shows user's online/offline status with real-time updates
 *
 * Features:
 * - Real-time status updates via WebSocket
 * - Dot indicator (green=online, gray=offline, yellow=away)
 * - Optional text label
 * - Custom sizes
 * - Pulse animation for online status
 *
 * @param {Object} props
 * @param {string} props.userId - User ID to track
 * @param {boolean} props.showLabel - Show status text (default: false)
 * @param {string} props.size - Size: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} props.position - Position: 'inline' | 'absolute' (default: 'inline')
 * @param {string} props.className - Additional CSS classes
 */
const OnlineStatusIndicator = ({
  userId,
  showLabel = false,
  size = "md",
  position = "inline",
  className = "",
}) => {
  const { on, emit, isConnected } = useWebSocket();
  const [status, setStatus] = useState("offline"); // 'online' | 'offline' | 'away'
  const [lastSeen, setLastSeen] = useState(null);

  // Size configurations
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  // Status configurations
  const statusConfig = {
    online: {
      color: "bg-green-500",
      label: "Online",
      pulse: true,
    },
    away: {
      color: "bg-yellow-500",
      label: "Away",
      pulse: false,
    },
    offline: {
      color: "bg-gray-400",
      label: "Offline",
      pulse: false,
    },
  };

  // Subscribe to user status updates
  useEffect(() => {
    if (!isConnected || !userId) return;

    const handleStatusUpdate = (data) => {
      if (data.userId === userId) {
        setStatus(data.status);
        setLastSeen(data.lastSeen);
      }
    };

    // Subscribe to WebSocket events
    const unsubscribe = on("user:status-update", handleStatusUpdate);

    // Request current status
    emit("user:get-status", { userId }, (response) => {
      if (response.success) {
        setStatus(response.status);
        setLastSeen(response.lastSeen);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, userId, on, emit]);

  // Format last seen time
  const formatLastSeen = (date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const config = statusConfig[status];
  const dotSize = sizes[size];

  if (position === "absolute") {
    return (
      <span
        className={`absolute bottom-0 right-0 block ${dotSize} ${
          config.color
        } rounded-full border-2 border-white ${
          config.pulse ? "animate-pulse" : ""
        } ${className}`}
        title={`${config.label}${
          status === "offline" && lastSeen
            ? ` - Last seen ${formatLastSeen(lastSeen)}`
            : ""
        }`}
      />
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span
        className={`inline-block ${dotSize} ${config.color} rounded-full ${
          config.pulse ? "animate-pulse" : ""
        }`}
        title={config.label}
      />
      {showLabel && (
        <span className="ml-2 text-sm text-gray-600">
          {config.label}
          {status === "offline" && lastSeen && (
            <span className="text-gray-400 ml-1">
              • Last seen {formatLastSeen(lastSeen)}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default OnlineStatusIndicator;
