import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Badge,
  Input,
  Loader,
  Alert,
} from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { Trophy, Save, ArrowLeft } from "lucide-react";

function EventResults() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await coachService.getEventDetails(eventId);
      const data = response.data || {};

      setEvent(data.event || {});
      setParticipants(data.participants || []);

      const initialResults = {};
      data.participants?.forEach((p) => {
        initialResults[p._id] = data.results?.[p._id] || {
          position: "",
          performance: "",
          notes: "",
        };
      });
      setResults(initialResults);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load event details";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (participantId, field, value) => {
    setResults((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const resultsData = {
        eventId,
        results: Object.entries(results).map(([participantId, data]) => ({
          participantId,
          ...data,
        })),
      };

      await coachService.submitEventResults(resultsData);
      showSuccess("Event results submitted successfully");

      setTimeout(() => {
        navigate(ROUTES.COACH_EVENTS);
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to submit results";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Event Results">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Event Results" subtitle={event?.name || "Event"}>
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
          onClick={() => navigate(ROUTES.COACH_EVENTS)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Events
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          icon={<Save className="h-4 w-4" />}
        >
          {submitting ? "Saving..." : "Save Results"}
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Event Date</p>
            <p className="font-medium text-gray-800">
              {event?.date ? new Date(event.date).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Venue</p>
            <p className="font-medium text-gray-800">{event?.venue || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Participants</p>
            <p className="font-medium text-gray-800">{participants.length}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Enter Results
        </h3>
        {participants.length > 0 ? (
          <div className="space-y-4">
            {participants.map((participant) => (
              <div
                key={participant._id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center mb-3">
                  <Trophy className="h-5 w-5 text-primary-500 mr-2" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {participant.name}
                    </p>
                    <p className="text-sm text-gray-600">{participant.class}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Position/Rank
                    </label>
                    <Input
                      type="number"
                      value={results[participant._id]?.position || ""}
                      onChange={(e) =>
                        handleResultChange(
                          participant._id,
                          "position",
                          e.target.value
                        )
                      }
                      placeholder="1st, 2nd, 3rd..."
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Performance Rating
                    </label>
                    <select
                      value={results[participant._id]?.performance || ""}
                      onChange={(e) =>
                        handleResultChange(
                          participant._id,
                          "performance",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select rating</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="average">Average</option>
                      <option value="needs-improvement">
                        Needs Improvement
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <Input
                      value={results[participant._id]?.notes || ""}
                      onChange={(e) =>
                        handleResultChange(
                          participant._id,
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">
            No participants for this event
          </p>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default EventResults;
