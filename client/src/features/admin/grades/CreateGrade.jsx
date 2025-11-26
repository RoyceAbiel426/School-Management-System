import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Select,
} from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

/**
 * Create Grade Page
 * Create single or bulk grades with sections
 */
function CreateGrade() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("single"); // 'single' or 'bulk'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    gradeNumber: 1,
    sectionsCount: 5,
    studentsPerSection: 30,
    status: "ACTIVE",
  });

  const [bulkData, setBulkData] = useState({
    startGrade: 1,
    endGrade: 14,
    sectionsCount: 5,
    studentsPerSection: 30,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBulkChange = (field, value) => {
    setBulkData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (mode === "single") {
        await adminService.createGrade(formData);
      } else {
        await adminService.createBulkGrades(bulkData);
      }

      navigate(ROUTES.ADMIN_GRADES);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create grade(s)");
    } finally {
      setLoading(false);
    }
  };

  const sections = ["A", "B", "C", "D", "E"];

  return (
    <DashboardLayout
      title="Create Grade"
      subtitle="Add new grade(s) to your school"
    >
      <div className="max-w-3xl mx-auto">
        {/* Mode Selection */}
        <Card className="mb-6">
          <div className="flex gap-4 mb-6">
            <Button
              variant={mode === "single" ? "primary" : "outline"}
              onClick={() => setMode("single")}
              className="flex-1"
            >
              Single Grade
            </Button>
            <Button
              variant={mode === "bulk" ? "primary" : "outline"}
              onClick={() => setMode("bulk")}
              className="flex-1"
            >
              Bulk Create (All Grades)
            </Button>
          </div>

          {error && <Alert type="error" message={error} className="mb-6" />}

          {mode === "single" ? (
            // Single Grade Form
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <BookOpen className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Grade Information
                </h3>
              </div>

              <Select
                label="Grade Number *"
                value={formData.gradeNumber}
                onChange={(e) =>
                  handleChange("gradeNumber", parseInt(e.target.value))
                }
                required
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Grade {num}
                  </option>
                ))}
              </Select>

              <Input
                label="Number of Sections *"
                type="number"
                value={formData.sectionsCount}
                onChange={(e) =>
                  handleChange("sectionsCount", parseInt(e.target.value))
                }
                min="1"
                max="5"
                required
                helpText={`Will create sections: ${sections
                  .slice(0, formData.sectionsCount)
                  .join(", ")}`}
              />

              <Input
                label="Students per Section *"
                type="number"
                value={formData.studentsPerSection}
                onChange={(e) =>
                  handleChange("studentsPerSection", parseInt(e.target.value))
                }
                min="10"
                max="50"
                required
                helpText={`Total capacity: ${
                  formData.sectionsCount * formData.studentsPerSection
                } students`}
              />

              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>

              {/* Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium">
                      Grade {formData.gradeNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sections:</span>
                    <span className="font-medium">
                      {sections.slice(0, formData.sectionsCount).join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Capacity:</span>
                    <span className="font-medium">
                      {formData.sectionsCount * formData.studentsPerSection}{" "}
                      students
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Bulk Create Form
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Plus className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Bulk Grade Creation
                </h3>
              </div>

              <Alert
                type="info"
                message="This will create all grades from start to end with the same configuration."
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Start Grade *"
                  value={bulkData.startGrade}
                  onChange={(e) =>
                    handleBulkChange("startGrade", parseInt(e.target.value))
                  }
                  required
                >
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Grade {num}
                    </option>
                  ))}
                </Select>

                <Select
                  label="End Grade *"
                  value={bulkData.endGrade}
                  onChange={(e) =>
                    handleBulkChange("endGrade", parseInt(e.target.value))
                  }
                  required
                >
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Grade {num}
                    </option>
                  ))}
                </Select>
              </div>

              <Input
                label="Sections per Grade *"
                type="number"
                value={bulkData.sectionsCount}
                onChange={(e) =>
                  handleBulkChange("sectionsCount", parseInt(e.target.value))
                }
                min="1"
                max="5"
                required
              />

              <Input
                label="Students per Section *"
                type="number"
                value={bulkData.studentsPerSection}
                onChange={(e) =>
                  handleBulkChange(
                    "studentsPerSection",
                    parseInt(e.target.value)
                  )
                }
                min="10"
                max="50"
                required
              />

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grades to Create:</span>
                    <Badge variant="primary">
                      {bulkData.endGrade - bulkData.startGrade + 1} Grades
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sections:</span>
                    <Badge variant="info">
                      {(bulkData.endGrade - bulkData.startGrade + 1) *
                        bulkData.sectionsCount}{" "}
                      Sections
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Capacity:</span>
                    <Badge variant="success">
                      {(bulkData.endGrade - bulkData.startGrade + 1) *
                        bulkData.sectionsCount *
                        bulkData.studentsPerSection}{" "}
                      Students
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.ADMIN_GRADES)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              icon={<Plus className="h-4 w-4" />}
            >
              {loading
                ? "Creating..."
                : mode === "single"
                ? "Create Grade"
                : "Create All Grades"}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default CreateGrade;
