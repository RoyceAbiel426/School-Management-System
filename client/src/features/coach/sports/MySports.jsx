import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Badge,
  Loader,
  Alert,
  Input,
} from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import {
  Trophy,
  Users,
  Calendar,
  TrendingUp,
  Search,
  ChevronRight,
} from "lucide-react";

/**
 * My Sports Page
 * View all sports managed by the coach
 */
function MySports() {
  const [sports, setSports] = useState([]);
  const [filteredSports, setFilteredSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    filterSports();
  }, [searchTerm, sports]);

  const fetchSports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await coachService.getMySports();
      const sportsData = response.data || [];

      setSports(sportsData);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load sports";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filterSports = () => {
    let filtered = [...sports];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sport) =>
          sport.name?.toLowerCase().includes(search) ||
          sport.category?.toLowerCase().includes(search)
      );
    }

    setFilteredSports(filtered);
  };

  const handleViewSport = (sportId) => {
    navigate(`${ROUTES.COACH_SPORTS}/${sportId}`);
  };

  const handleManageParticipants = (sportId) => {
    navigate(`${ROUTES.COACH_PARTICIPANTS}?sport=${sportId}`);
  };

  if (loading) {
    return (
      <DashboardLayout title="My Sports">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Sports"
      subtitle="Manage your assigned sports activities"
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Sports</h2>
          <p className="text-gray-600 mt-1">
            {filteredSports.length} sport
            {filteredSports.length !== 1 ? "s" : ""} assigned
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <Input
          placeholder="Search by sport name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {sports.length}
            </p>
            <p className="text-gray-600 mt-1">Total Sports</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">
              {sports.reduce((sum, s) => sum + (s.participantCount || 0), 0)}
            </p>
            <p className="text-gray-600 mt-1">Total Participants</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-info-600">
              {sports.reduce((sum, s) => sum + (s.upcomingEvents || 0), 0)}
            </p>
            <p className="text-gray-600 mt-1">Upcoming Events</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-warning-600">
              {sports.filter((s) => s.hasSessionToday).length}
            </p>
            <p className="text-gray-600 mt-1">Sessions Today</p>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      {filteredSports.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No Sports Found" : "No Sports Assigned"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "You don't have any sports assigned yet"}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </div>
        </Card>
      ) : (
        /* Sports Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSports.map((sport) => (
            <Card
              key={sport._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewSport(sport._id)}
            >
              {/* Sport Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Trophy className="h-5 w-5 text-primary-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {sport.name || "Untitled Sport"}
                    </h3>
                    {sport.hasSessionToday && (
                      <Badge variant="success" className="ml-2">
                        Today
                      </Badge>
                    )}
                  </div>
                  {sport.category && (
                    <p className="text-sm text-gray-600">{sport.category}</p>
                  )}
                </div>
              </div>

              {/* Sport Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-primary-500" />
                  <span>
                    <span className="font-medium">
                      {sport.participantCount || 0}
                    </span>{" "}
                    Participants
                  </span>
                </div>

                {sport.nextSession && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-info-500" />
                    <span>
                      {new Date(sport.nextSession).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {sport.venue && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Venue:</span> {sport.venue}
                  </div>
                )}

                {sport.schedule && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Schedule:</span>{" "}
                    {sport.schedule}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {sport.stats && (
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {sport.stats.avgAttendance || 0}%
                    </p>
                    <p className="text-xs text-gray-600">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {sport.stats.upcomingEvents || 0}
                    </p>
                    <p className="text-xs text-gray-600">Events</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {sport.stats.achievements || 0}
                    </p>
                    <p className="text-xs text-gray-600">Achievements</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewSport(sport._id);
                  }}
                  icon={<ChevronRight className="h-4 w-4" />}
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManageParticipants(sport._id);
                  }}
                  icon={<Users className="h-4 w-4" />}
                >
                  Participants
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MySports;
