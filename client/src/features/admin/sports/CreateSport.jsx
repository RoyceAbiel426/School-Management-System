import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../../components/common/Alert";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Loader from "../../../components/common/Loader";
import Select from "../../../components/common/Select";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

export default function CreateSport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [formData, setFormData] = useState({
    sportName: "",
    coach: "",
    captain: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    fetchCoaches();
    fetchStudents();
  }, []);

  const fetchCoaches = async () => {
    try {
      setLoadingCoaches(true);
      const response = await adminService.getAllCoaches({ status: "active" });

      if (response.data) {
        const coachesData = Array.isArray(response.data)
          ? response.data
          : response.data.coaches || [];
        setCoaches(coachesData);
      }
    } catch (err) {
      console.error("Error fetching coaches:", err);
    } finally {
      setLoadingCoaches(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await adminService.getAllStudents({ status: "active" });

      if (response.data) {
        const studentsData = Array.isArray(response.data)
          ? response.data
          : response.data.students || [];
        setStudents(studentsData);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleParticipantToggle = (studentId) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sportName.trim()) {
      newErrors.sportName = "Sport name is required";
    }

    if (!formData.coach) {
      newErrors.coach = "Coach is required";
    }

    if (!formData.captain) {
      newErrors.captain = "Captain is required";
    }

    if (selectedParticipants.length === 0) {
      newErrors.participants = "At least one participant is required";
    }

    if (formData.captain && !selectedParticipants.includes(formData.captain)) {
      newErrors.captain = "Captain must be one of the participants";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const sportData = {
        sportName: formData.sportName,
        coach: formData.coach,
        captain: formData.captain,
        participants: selectedParticipants,
      };

      const response = await adminService.createSport(sportData);

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.ADMIN_ROUTES.SPORTS);
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating sport:", err);
      setError(err.response?.data?.message || "Failed to create sport");
    } finally {
      setLoading(false);
    }
  };

  const getStudentDisplay = (student) => {
    return `${student.name}${
      student.studentID ? ` (${student.studentID})` : ""
    }${student.class ? ` - ${student.class}` : ""}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.SPORTS)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sports
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create New Sport</h1>
        <p className="text-muted-foreground">Add a new sport activity</p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert type="success">Sport created successfully! Redirecting...</Alert>
      )}

      {/* Error Message */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <Input
              label="Sport Name"
              name="sportName"
              value={formData.sportName}
              onChange={handleChange}
              error={errors.sportName}
              placeholder="e.g., Football, Basketball, Cricket"
              required
            />
          </div>
        </Card>

        {/* Coach Assignment */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Coach Assignment</h3>

            {loadingCoaches ? (
              <div className="flex items-center gap-2">
                <Loader size="sm" />
                <span className="text-sm text-muted-foreground">
                  Loading coaches...
                </span>
              </div>
            ) : (
              <Select
                label="Assign Coach"
                name="coach"
                value={formData.coach}
                onChange={handleChange}
                error={errors.coach}
                required
                options={[
                  { value: "", label: "Select Coach" },
                  ...coaches.map((coach) => ({
                    value: coach._id,
                    label: `${coach.name}${
                      coach.coachID ? ` (${coach.coachID})` : ""
                    }`,
                  })),
                ]}
              />
            )}
          </div>
        </Card>

        {/* Participants Selection */}
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Select Participants</h3>
              <p className="text-sm text-muted-foreground">
                Choose students to participate in this sport
              </p>
            </div>

            {loadingStudents ? (
              <div className="flex items-center gap-2">
                <Loader size="sm" />
                <span className="text-sm text-muted-foreground">
                  Loading students...
                </span>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No active students available
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                    {students.map((student) => (
                      <label
                        key={student._id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedParticipants.includes(student._id)
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-accent border-border"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(student._id)}
                          onChange={() => handleParticipantToggle(student._id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">
                          {getStudentDisplay(student)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {errors.participants && (
                  <p className="text-sm text-destructive">
                    {errors.participants}
                  </p>
                )}

                {selectedParticipants.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-info/10 rounded-lg">
                    <Badge variant="info">
                      {selectedParticipants.length} participants selected
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setSelectedParticipants([])}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Captain Selection */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Captain</h3>

            <Select
              label="Select Captain"
              name="captain"
              value={formData.captain}
              onChange={handleChange}
              error={errors.captain}
              required
              disabled={selectedParticipants.length === 0}
              helperText={
                selectedParticipants.length === 0
                  ? "Select participants first"
                  : "Captain must be one of the participants"
              }
              options={[
                { value: "", label: "Select Captain" },
                ...students
                  .filter((student) =>
                    selectedParticipants.includes(student._id)
                  )
                  .map((student) => ({
                    value: student._id,
                    label: getStudentDisplay(student),
                  })),
              ]}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.SPORTS)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              "Creating..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Sport
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
