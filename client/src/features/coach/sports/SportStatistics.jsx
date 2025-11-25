import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Badge, Loader, Alert } from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Trophy,
  Award,
  ArrowLeft,
} from "lucide-react";

function SportStatistics() {
  const { sportId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchStatistics();
  }, [sportId, selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await coachService.getSportStatistics(
        sportId,
        selectedPeriod
      );
      const data = response.data || {};

      setStats(data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load statistics";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Sport Statistics">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout title="Sport Statistics">
        <Alert type="error" message="Statistics not available" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Sport Statistics"
      subtitle={`${stats.sportName || "Sport"} Performance Analytics`}
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

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="semester">This Semester</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-primary-50 border-primary-200">
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary-600 mb-2" />
            <p className="text-2xl font-bold text-primary-700">
              {stats.totalParticipants || 0}
            </p>
            <p className="text-sm text-primary-600">Total Participants</p>
          </div>
        </Card>

        <Card className="bg-success-50 border-success-200">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-600 mb-2" />
            <p className="text-2xl font-bold text-success-700">
              {stats.avgAttendance || 0}%
            </p>
            <p className="text-sm text-success-600">Avg Attendance</p>
            {stats.attendanceTrend > 0 ? (
              <Badge variant="success" className="mt-1">
                +{stats.attendanceTrend}%
              </Badge>
            ) : stats.attendanceTrend < 0 ? (
              <Badge variant="error" className="mt-1">
                {stats.attendanceTrend}%
              </Badge>
            ) : null}
          </div>
        </Card>

        <Card className="bg-info-50 border-info-200">
          <div className="text-center">
            <Trophy className="h-8 w-8 mx-auto text-info-600 mb-2" />
            <p className="text-2xl font-bold text-info-700">
              {stats.eventsCompleted || 0}
            </p>
            <p className="text-sm text-info-600">Events Completed</p>
          </div>
        </Card>

        <Card className="bg-warning-50 border-warning-200">
          <div className="text-center">
            <Award className="h-8 w-8 mx-auto text-warning-600 mb-2" />
            <p className="text-2xl font-bold text-warning-700">
              {stats.achievements || 0}
            </p>
            <p className="text-sm text-warning-600">Achievements</p>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Attendance Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Excellent (≥90%)</span>
              <span className="font-semibold text-success-600">
                {stats.attendanceDistribution?.excellent || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full"
                style={{
                  width: `${
                    ((stats.attendanceDistribution?.excellent || 0) /
                      (stats.totalParticipants || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Good (75-89%)</span>
              <span className="font-semibold text-info-600">
                {stats.attendanceDistribution?.good || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-info-500 h-2 rounded-full"
                style={{
                  width: `${
                    ((stats.attendanceDistribution?.good || 0) /
                      (stats.totalParticipants || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Poor (&lt;75%)</span>
              <span className="font-semibold text-error-600">
                {stats.attendanceDistribution?.poor || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-error-500 h-2 rounded-full"
                style={{
                  width: `${
                    ((stats.attendanceDistribution?.poor || 0) /
                      (stats.totalParticipants || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance Trends
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {stats.attendanceTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-success-500 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-error-500 mr-2" />
                )}
                <span className="text-sm text-gray-600">Attendance Trend</span>
              </div>
              <Badge variant={stats.attendanceTrend >= 0 ? "success" : "error"}>
                {stats.attendanceTrend >= 0 ? "+" : ""}
                {stats.attendanceTrend || 0}%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {stats.participationTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-success-500 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-error-500 mr-2" />
                )}
                <span className="text-sm text-gray-600">
                  Participation Trend
                </span>
              </div>
              <Badge
                variant={stats.participationTrend >= 0 ? "success" : "error"}
              >
                {stats.participationTrend >= 0 ? "+" : ""}
                {stats.participationTrend || 0}%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sessions Conducted</span>
              <span className="font-semibold">
                {stats.sessionsCompleted || 0}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Events
          </h3>
          {stats.recentEvents && stats.recentEvents.length > 0 ? (
            <div className="space-y-2">
              {stats.recentEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={event.status === "completed" ? "success" : "info"}
                  >
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">No recent events</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="h-5 w-5 text-success-500 mr-2" />
            Top Performers
          </h3>
          {stats.topPerformers && stats.topPerformers.length > 0 ? (
            <div className="space-y-2">
              {stats.topPerformers.map((participant, index) => (
                <div
                  key={participant._id}
                  className="flex items-center justify-between p-2 bg-success-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {participant.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {participant.class}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">
                    {participant.performance || "Excellent"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">
              No performance data available
            </p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Session Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Sessions</span>
              <span className="font-semibold text-gray-800">
                {stats.totalSessions || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="font-semibold text-success-600">
                {stats.sessionsCompleted || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Upcoming</span>
              <span className="font-semibold text-info-600">
                {stats.upcomingSessions || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Avg Duration</span>
              <span className="font-semibold text-gray-800">
                {stats.avgDuration || "N/A"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default SportStatistics;
