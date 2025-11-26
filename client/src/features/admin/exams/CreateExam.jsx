import { Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Input, Select } from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

/**
 * Create Exam Page
 * Create and schedule examinations
 */
function CreateExam() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    examName: "",
    examType: "UNIT_TEST",
    grade: "",
    course: "",
    date: "",
    startTime: "",
    endTime: "",
    totalMarks: 100,
    passingMarks: 40,
    duration: 60,
    instructions: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      await adminService.createExam(formData);
      navigate(ROUTES.ADMIN_EXAMS);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Exam" subtitle="Schedule a new examination">
      <div className="max-w-4xl mx-auto">
        <Card>
          {error && <Alert type="error" message={error} className="mb-6" />}

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <FileText className="h-6 w-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Exam Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Exam Name *"
                value={formData.examName}
                onChange={(e) => handleChange("examName", e.target.value)}
                placeholder="e.g., Mid-Term Examination"
                required
              />

              <Select
                label="Exam Type *"
                value={formData.examType}
                onChange={(e) => handleChange("examType", e.target.value)}
                required
              >
                <option value="UNIT_TEST">Unit Test</option>
                <option value="MID_TERM">Mid-Term</option>
                <option value="FINAL">Final Exam</option>
                <option value="QUIZ">Quiz</option>
                <option value="PRACTICAL">Practical</option>
              </Select>

              <Select
                label="Grade *"
                value={formData.grade}
                onChange={(e) => handleChange("grade", e.target.value)}
                required
              >
                <option value="">Select Grade</option>
                {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Grade {num}
                  </option>
                ))}
              </Select>

              <Input
                label="Course/Subject *"
                value={formData.course}
                onChange={(e) => handleChange("course", e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <Calendar className="h-6 w-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Date *"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />

              <Input
                label="Start Time *"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                required
              />

              <Input
                label="End Time *"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Total Marks *"
                type="number"
                value={formData.totalMarks}
                onChange={(e) =>
                  handleChange("totalMarks", parseInt(e.target.value))
                }
                required
              />

              <Input
                label="Passing Marks *"
                type="number"
                value={formData.passingMarks}
                onChange={(e) =>
                  handleChange("passingMarks", parseInt(e.target.value))
                }
                required
              />

              <Input
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  handleChange("duration", parseInt(e.target.value))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="4"
                value={formData.instructions}
                onChange={(e) => handleChange("instructions", e.target.value)}
                placeholder="Enter exam instructions..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.ADMIN_EXAMS)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Exam"}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default CreateExam;
