import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Badge,
  Loader,
  Alert,
  Table,
} from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import {
  Trophy,
  Users,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Plus,
} from "lucide-react";

function SportDetail() {
  const { sportId } = useParams();
  const [sport, setSport] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchSportDetail();
  }, [sportId]);

  const fetchSportDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await coachService.getSportDetail(sportId);
      const data = response.data || {};

      setSport(data.sport || {});
      setParticipants(data.participants || []);
      setEvents(data.events || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load sport details";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const participantColumns = [
    {
      header: "Roll No.",
      accessor: "rollNumber",
      cell: (value) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Name",
      accessor: "name",
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-600">{row.class}</p>
        </div>
      ),
    },
    {
      header: "Attendance",
      accessor: "attendance",
      cell: (value) => {
        const percentage = value || 0;
        const variant =
          percentage >= 75 ? "success" : percentage >= 60 ? "warning" : "error";
        return <Badge variant={variant}>{percentage}%</Badge>;
      },
    },
    {
      header: "Performance",
      accessor: "performance",
      cell: (value) => <span className="font-medium">{value || "N/A"}</span>,
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (value) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`${ROUTES.COACH_PARTICIPANTS}/${value}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Sport Details">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  if (!sport) {
    return (
      <DashboardLayout title="Sport Details">
        <Alert type="error" message="Sport not found" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={sport.name || "Sport Details"}
      subtitle={sport.category || "Sport Category"}
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
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.COACH_SPORTS)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Sports
        </Button>
        <Button
          onClick={() =>
            navigate(`${ROUTES.COACH_EVENTS}/create?sport=${sportId}`)
          }
          icon={<Plus className="h-4 w-4" />}
        >
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {sport.participantCount || participants.length || 0}
            </p>
            <p className="text-sm text-gray-600">Participants</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {sport.avgAttendance || 0}%
            </p>
            <p className="text-sm text-gray-600">Avg Attendance</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto text-info-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {events.length || 0}
            </p>
            <p className="text-sm text-gray-600">Events</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Trophy className="h-8 w-8 mx-auto text-warning-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {sport.achievements || 0}
            </p>
            <p className="text-sm text-gray-600">Achievements</p>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "participants", label: "Participants" },
              { id: "events", label: "Events" },
              { id: "schedule", label: "Schedule" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sport Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium text-gray-800">
                  {sport.category || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Venue</p>
                <p className="font-medium text-gray-800">
                  {sport.venue || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Schedule</p>
                <p className="font-medium text-gray-800">
                  {sport.schedule || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-medium text-gray-800">
                  {sport.level || "N/A"}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Performance Summary
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Average Attendance</span>
                  <span className="font-medium">
                    {sport.avgAttendance || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-success-500 h-2 rounded-full"
                    style={{ width: `${sport.avgAttendance || 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Active Participants</span>
                  <span className="font-medium">
                    {sport.activeParticipants || 0}/
                    {sport.participantCount || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-info-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((sport.activeParticipants || 0) /
                          (sport.participantCount || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "participants" && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Participants List
            </h3>
            <Button
              size="sm"
              onClick={() =>
                navigate(`${ROUTES.COACH_PARTICIPANTS}/add?sport=${sportId}`)
              }
            >
              Add Participant
            </Button>
          </div>
          {participants.length > 0 ? (
            <Table columns={participantColumns} data={participants} />
          ) : (
            <div className="text-center py-8 text-gray-600">
              No participants enrolled in this sport
            </div>
          )}
        </Card>
      )}

      {activeTab === "events" && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Upcoming Events
            </h3>
            <Button
              size="sm"
              onClick={() =>
                navigate(`${ROUTES.COACH_EVENTS}/create?sport=${sportId}`)
              }
            >
              Create Event
            </Button>
          </div>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{event.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} at{" "}
                      {event.time || "TBD"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        event.status === "completed" ? "success" : "info"
                      }
                    >
                      {event.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate(`${ROUTES.COACH_EVENTS}/${event._id}`)
                      }
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No events scheduled
            </div>
          )}
        </Card>
      )}

      {activeTab === "schedule" && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Training Schedule
          </h3>
          {sport.scheduleDetails ? (
            <div className="space-y-3">
              {sport.scheduleDetails.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {schedule.day}
                      </p>
                      <p className="text-sm text-gray-600">{schedule.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{schedule.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No schedule information available</p>
            </div>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}

export default SportDetail;
