import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Badge,
  Loader,
  Alert,
  Table,
  Input,
} from "../../../components/common";
import { coachService } from "../../../services/coachService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { Users, Search, Plus, UserMinus } from "lucide-react";

function ParticipantsList() {
  const [searchParams] = useSearchParams();
  const sportId = searchParams.get("sport");

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchParticipants();
  }, [sportId]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await coachService.getParticipants(sportId);
      setParticipants(response.data || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load participants";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (!confirm("Are you sure you want to remove this participant?")) return;

    try {
      await coachService.removeParticipant(sportId, participantId);
      showSuccess("Participant removed successfully");
      fetchParticipants();
    } catch (err) {
      showError("Failed to remove participant");
    }
  };

  const columns = [
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
          <p className="text-xs text-gray-600">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Class",
      accessor: "class",
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
      cell: (value) => <Badge variant="info">{value || "Good"}</Badge>,
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (value) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`${ROUTES.COACH_PARTICIPANTS}/${value}`)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveParticipant(value)}
            icon={<UserMinus className="h-4 w-4" />}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const filteredParticipants = participants.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Participants">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Participants" subtitle="Manage sport participants">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="mb-6 flex justify-between items-center">
        <Input
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-5 w-5" />}
          className="w-64"
        />
        <Button
          onClick={() =>
            navigate(
              `${ROUTES.COACH_PARTICIPANTS}/add${
                sportId ? `?sport=${sportId}` : ""
              }`
            )
          }
          icon={<Plus className="h-4 w-4" />}
        >
          Add Participant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {participants.length}
            </p>
            <p className="text-sm text-gray-600">Total Participants</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-800">
              {participants.filter((p) => (p.attendance || 0) >= 75).length}
            </p>
            <p className="text-sm text-gray-600">Active (≥75%)</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-800">
              {participants.filter((p) => (p.attendance || 0) < 75).length}
            </p>
            <p className="text-sm text-gray-600">Needs Attention</p>
          </div>
        </Card>
      </div>

      <Card>
        {filteredParticipants.length > 0 ? (
          <Table columns={columns} data={filteredParticipants} />
        ) : (
          <div className="text-center py-8 text-gray-600">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p>No participants found</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default ParticipantsList;
