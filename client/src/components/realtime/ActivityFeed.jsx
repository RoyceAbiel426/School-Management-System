import {
  Activity,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Edit,
  FileText,
  MessageSquare,
  Trophy,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";

/**
 * ActivityFeed Component
 * Real-time activity feed showing recent actions
 *
 * Features:
 * - Real-time activity updates via WebSocket
 * - Activity type icons and colors
 * - User avatars
 * - Time ago display
 * - Filter by activity type
 * - Load more pagination
 * - Auto-refresh
 *
 * @param {Object} props
 * @param {string} props.userId - Filter activities by user (optional)
 * @param {Array} props.types - Filter by activity types (optional)
 * @param {number} props.limit - Activities to show (default: 20)
 * @param {boolean} props.showFilters - Show filter buttons (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const ActivityFeed = ({
  userId,
  types,
  limit = 20,
  showFilters = true,
  className = "",
}) => {
  const { on, emit, isConnected } = useWebSocket();
  const [activities, setActivities] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Activity type configurations
  const activityTypes = {
    user_login: {
      icon: User,
      color: "text-blue-500",
      bg: "bg-blue-100",
      label: "Login",
    },
    user_logout: {
      icon: User,
      color: "text-gray-500",
      bg: "bg-gray-100",
      label: "Logout",
    },
    user_register: {
      icon: UserPlus,
      color: "text-green-500",
      bg: "bg-green-100",
      label: "Registration",
    },
    course_create: {
      icon: BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-100",
      label: "Course Created",
    },
    course_update: {
      icon: Edit,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
      label: "Course Updated",
    },
    assignment_submit: {
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-100",
      label: "Assignment",
    },
    attendance_mark: {
      icon: Check,
      color: "text-green-500",
      bg: "bg-green-100",
      label: "Attendance",
    },
    exam_create: {
      icon: Calendar,
      color: "text-red-500",
      bg: "bg-red-100",
      label: "Exam",
    },
    result_publish: {
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
      label: "Result",
    },
    message_send: {
      icon: MessageSquare,
      color: "text-indigo-500",
      bg: "bg-indigo-100",
      label: "Message",
    },
    notice_create: {
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-100",
      label: "Notice",
    },
    default: {
      icon: Activity,
      color: "text-gray-500",
      bg: "bg-gray-100",
      label: "Activity",
    },
  };

  // Subscribe to real-time activities
  useEffect(() => {
    if (!isConnected) return;

    const handleNewActivity = (activity) => {
      console.log("📊 New activity:", activity);
      setActivities((prev) => [activity, ...prev].slice(0, limit));
    };

    // Subscribe to WebSocket events
    const unsubscribe = on("activity:new", handleNewActivity);

    // Request initial activities
    loadActivities();

    return () => {
      unsubscribe();
    };
  }, [isConnected, userId, selectedType]);

  // Load activities
  const loadActivities = (offset = 0) => {
    setIsLoading(true);

    emit(
      "activities:get",
      {
        userId,
        type: selectedType === "all" ? undefined : selectedType,
        limit,
        offset,
      },
      (response) => {
        setIsLoading(false);
        if (response.success) {
          if (offset === 0) {
            setActivities(response.activities);
          } else {
            setActivities((prev) => [...prev, ...response.activities]);
          }
          setHasMore(response.hasMore);
        }
      }
    );
  };

  // Get activity config
  const getActivityConfig = (type) => {
    return activityTypes[type] || activityTypes.default;
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
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    return new Date(date).toLocaleDateString();
  };

  // Load more
  const handleLoadMore = () => {
    loadActivities(activities.length);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Activity Feed
            </h3>
          </div>

          {/* Connection Status */}
          <div className="flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                isConnected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedType === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {Object.entries(activityTypes)
              .slice(0, -1)
              .map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    selectedType === type
                      ? `${config.bg} ${config.color}`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {config.label}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {isLoading && activities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        ) : (
          <>
            {activities.map((activity) => {
              const config = getActivityConfig(activity.type);
              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}
                    >
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.user?.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          {activity.metadata && (
                            <div className="mt-2 text-xs text-gray-500">
                              {Object.entries(activity.metadata).map(
                                ([key, value]) => (
                                  <span key={key} className="mr-3">
                                    <strong>{key}:</strong> {value}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-400 ml-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {timeAgo(activity.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Load More */}
            {hasMore && (
              <div className="p-4 text-center border-t border-gray-200">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
