import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Badge, Loader, Alert } from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { TrendingUp, Trophy, Calendar, ArrowLeft } from "lucide-react";

function ParticipantPerformance() {
  const { participantId } = useParams();
  const [participant, setParticipant] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchPerformance();
  }, [participantId]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await coachService.getParticipantPerformance(
        participantId
      );
      const data = response.data || {};
      setParticipant(data.participant || {});
      setPerformance(data.performance || {});
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
      <DashboardLayout title="Participant Performance">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Participant Performance"
      subtitle={participant?.name || "Participant"}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {performance?.attendance || 0}%
            </p>
            <p className="text-sm text-gray-600">Attendance</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Trophy className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {performance?.rating || "N/A"}
            </p>
            <p className="text-sm text-gray-600">Performance Rating</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {performance?.eventsParticipated || 0}
            </p>
            <p className="text-sm text-gray-600">Events Participated</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-800">
              {performance?.achievements || 0}
            </p>
            <p className="text-sm text-gray-600">Achievements</p>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Performance Trends
        </h3>
        {performance?.trends && performance.trends.length > 0 ? (
          <div className="space-y-3">
            {performance.trends.map((trend, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">{trend.skill}</span>
                  <Badge variant={trend.level >= 75 ? "success" : "warning"}>
                    {trend.level}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      trend.level >= 75 ? "bg-success-500" : "bg-warning-500"
                    }`}
                    style={{ width: `${trend.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-4">
            No performance trends available
          </p>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Event History
        </h3>
        {performance?.eventHistory && performance.eventHistory.length > 0 ? (
          <div className="space-y-2">
            {performance.eventHistory.map((event) => (
              <div
                key={event._id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-info-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">{event.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={event.result === "won" ? "success" : "info"}>
                  {event.result || event.position || "Participated"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-4">
            No event history found
          </p>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default ParticipantPerformance;
