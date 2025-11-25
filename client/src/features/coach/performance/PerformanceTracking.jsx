import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout";
import { Card, Loader, Alert, Badge } from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { TrendingUp, Users, Trophy } from "lucide-react";

function PerformanceTracking() {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { error: showError } = useNotification();

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await coachService.getPerformanceOverview();
      setPerformance(response.data || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load performance data";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Performance Tracking">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Performance Tracking"
      subtitle="Track participant performance across all sports"
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {performance.reduce(
                (sum, p) => sum + (p.totalParticipants || 0),
                0
              )}
            </p>
            <p className="text-sm text-gray-600">Total Participants</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {performance.length > 0
                ? (
                    performance.reduce(
                      (sum, p) => sum + (p.avgPerformance || 0),
                      0
                    ) / performance.length
                  ).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-gray-600">Avg Performance</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Trophy className="h-8 w-8 mx-auto text-warning-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {performance.reduce((sum, p) => sum + (p.achievements || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Achievements</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {performance.map((sport) => (
          <Card key={sport.sportId}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {sport.sportName}
                </h3>
                <p className="text-sm text-gray-600">{sport.category}</p>
              </div>
              <Badge
                variant={sport.avgPerformance >= 75 ? "success" : "warning"}
              >
                {sport.avgPerformance}% avg
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-xl font-bold text-gray-800">
                  {sport.totalParticipants}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-xl font-bold text-gray-800">
                  {sport.avgAttendance}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Events</p>
                <p className="text-xl font-bold text-gray-800">
                  {sport.totalEvents || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-xl font-bold text-gray-800">
                  {sport.achievements || 0}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default PerformanceTracking;
