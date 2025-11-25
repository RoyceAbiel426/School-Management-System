import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Input, Alert, Loader } from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { UserPlus, ArrowLeft, Search } from "lucide-react";

function AddParticipant() {
  const [searchParams] = useSearchParams();
  const sportId = searchParams.get("sport");

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchAvailableStudents();
  }, [sportId]);

  const fetchAvailableStudents = async () => {
    try {
      setLoading(true);
      const response = await coachService.getAvailableStudents(sportId);
      setStudents(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load students";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      setError("Please select at least one student");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await coachService.addParticipants(sportId, selectedStudents);
      showSuccess(
        `${selectedStudents.length} participant(s) added successfully`
      );

      setTimeout(() => {
        navigate(`${ROUTES.COACH_PARTICIPANTS}?sport=${sportId}`);
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to add participants";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Add Participants">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Add Participants"
      subtitle="Select students to add to the sport"
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
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || selectedStudents.length === 0}
          icon={<UserPlus className="h-4 w-4" />}
        >
          {submitting
            ? "Adding..."
            : `Add ${selectedStudents.length} Participant(s)`}
        </Button>
      </div>

      <Card className="mb-6">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Available Students ({filteredStudents.length})
        </h3>
        {filteredStudents.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => (
              <label
                key={student._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center flex-1">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleToggleStudent(student._id)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      {student.rollNumber} • {student.class}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">
            No available students found
          </p>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default AddParticipant;
