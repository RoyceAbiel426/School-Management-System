import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

/**
 * WebSocket Context
 * Provides real-time communication across the application
 *
 * Features:
 * - Auto-connect on mount
 * - Auto-reconnect on disconnect
 * - Event listeners management
 * - Connection status tracking
 * - Room join/leave functionality
 * - Emit events with acknowledgment
 */

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("studentToken") ||
      localStorage.getItem("teacherToken") ||
      localStorage.getItem("coachToken") ||
      localStorage.getItem("librarianToken");

    if (!token) {
      console.warn(
        "No authentication token found. WebSocket connection skipped."
      );
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("✅ WebSocket connected:", socketInstance.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ WebSocket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log(`🔄 WebSocket reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      setConnectionError(null);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("❌ WebSocket reconnection failed");
      setConnectionError("Failed to reconnect to server");
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log("🔌 Disconnecting WebSocket...");
      socketInstance.disconnect();
    };
  }, []);

  // Join a room
  const joinRoom = useCallback(
    (room) => {
      if (socket && isConnected) {
        socket.emit("join-room", room);
        console.log(`📥 Joined room: ${room}`);
      }
    },
    [socket, isConnected]
  );

  // Leave a room
  const leaveRoom = useCallback(
    (room) => {
      if (socket && isConnected) {
        socket.emit("leave-room", room);
        console.log(`📤 Left room: ${room}`);
      }
    },
    [socket, isConnected]
  );

  // Emit event with optional acknowledgment
  const emit = useCallback(
    (event, data, callback) => {
      if (socket && isConnected) {
        if (callback) {
          socket.emit(event, data, callback);
        } else {
          socket.emit(event, data);
        }
      } else {
        console.warn("Cannot emit event. Socket not connected.");
      }
    },
    [socket, isConnected]
  );

  // Subscribe to event
  const on = useCallback(
    (event, callback) => {
      if (socket) {
        socket.on(event, callback);
        return () => socket.off(event, callback);
      }
      return () => {};
    },
    [socket]
  );

  // Unsubscribe from event
  const off = useCallback(
    (event, callback) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    [socket]
  );

  const value = {
    socket,
    isConnected,
    connectionError,
    joinRoom,
    leaveRoom,
    emit,
    on,
    off,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
