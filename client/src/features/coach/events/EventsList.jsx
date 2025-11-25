import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Badge, Loader, Alert } from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { Calendar, Trophy, Plus, ChevronRight } from "lucide-react";

function EventsList() {
  const [searchParams] = useSearchParams();
  const sportId = searchParams.get("sport");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchEvents();
  }, [sportId, filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await coachService.getEvents(sportId, filter);
      setEvents(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load events";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Events">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Events"
      subtitle="Manage sports events and competitions"
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="mb-6 flex justify-between items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <Button
          onClick={() =>
            navigate(
              `${ROUTES.COACH_EVENTS}/create${
                sportId ? `?sport=${sportId}` : ""
              }`
            )
          }
          icon={<Plus className="h-4 w-4" />}
        >
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{events.length}</p>
            <p className="text-sm text-gray-600">Total Events</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-info-800">
              {events.filter((e) => e.status === "upcoming").length}
            </p>
            <p className="text-sm text-gray-600">Upcoming</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-800">
              {events.filter((e) => e.status === "completed").length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-800">
              {events.filter((e) => e.status === "today").length}
            </p>
            <p className="text-sm text-gray-600">Today</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`${ROUTES.COACH_EVENTS}/${event._id}`)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Trophy className="h-5 w-5 text-primary-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {event.name}
                    </h3>
                    <Badge
                      variant={
                        event.status === "completed"
                          ? "success"
                          : event.status === "upcoming"
                          ? "info"
                          : event.status === "today"
                          ? "warning"
                          : "default"
                      }
                      className="ml-2"
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-info-500" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    {event.venue && (
                      <div className="text-gray-600">
                        <span className="font-medium">Venue:</span>{" "}
                        {event.venue}
                      </div>
                    )}
                    {event.participants && (
                      <div className="text-gray-600">
                        <span className="font-medium">Participants:</span>{" "}
                        {event.participants}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ChevronRight className="h-4 w-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`${ROUTES.COACH_EVENTS}/${event._id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No events found</p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default EventsList;
