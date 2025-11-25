import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Input, Alert } from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { Save, ArrowLeft } from "lucide-react";

function CreateEvent() {
  const [searchParams] = useSearchParams();
  const sportId = searchParams.get("sport");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    sportId: sportId || "",
    eventType: "competition",
  });
  const [sports, setSports] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await coachService.getMySports();
      setSports(response.data || []);
    } catch (err) {
      showError("Failed to load sports");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.sportId || !formData.date) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await coachService.createEvent(formData);
      showSuccess("Event created successfully");

      setTimeout(() => {
        navigate(ROUTES.COACH_EVENTS);
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create event";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Event"
      subtitle="Create a new sports event or competition"
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

      <div className="max-w-3xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Name <span className="text-error-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter event name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="sportId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sport <span className="text-error-500">*</span>
              </label>
              <select
                id="sportId"
                name="sportId"
                value={formData.sportId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a sport</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="eventType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Type
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="competition">Competition</option>
                <option value="tournament">Tournament</option>
                <option value="practice">Practice Match</option>
                <option value="friendly">Friendly Match</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date <span className="text-error-500">*</span>
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Time
                </label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="venue"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Venue
              </label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter event venue"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event description..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                icon={<Save className="h-4 w-4" />}
              >
                {submitting ? "Creating..." : "Create Event"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default CreateEvent;
