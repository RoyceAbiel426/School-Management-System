import { ArrowLeft, Plus, Save, X } from "lucide-react";
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

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const [formData, setFormData] = useState({
    courseID: "",
    courseName: "",
    description: "",
    duration: "",
    sessions: "",
    grade: "",
    teacher: "",
  });

  const [errors, setErrors] = useState({});
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const response = await adminService.getAllTeachers({ status: "active" });

      if (response.data) {
        const teachersData = Array.isArray(response.data)
          ? response.data
          : response.data.teachers || [];
        setTeachers(teachersData);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoadingTeachers(false);
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

  const addModule = () => {
    setModules((prev) => [...prev, { name: "", description: "" }]);
  };

  const removeModule = (index) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const updateModule = (index, field, value) => {
    setModules((prev) =>
      prev.map((module, i) =>
        i === index ? { ...module, [field]: value } : module
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseID.trim()) {
      newErrors.courseID = "Course code is required";
    } else if (!/^[A-Z]{2,4}\d{3}$/.test(formData.courseID)) {
      newErrors.courseID =
        "Format: 2-4 uppercase letters + 3 digits (e.g., CS101, MATH101)";
    }

    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    } else if (formData.duration < 1 || formData.duration > 52) {
      newErrors.duration = "Duration must be between 1 and 52 weeks";
    }

    if (!formData.grade) {
      newErrors.grade = "Grade is required";
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

      const courseData = {
        ...formData,
        duration: parseInt(formData.duration),
        grade: parseInt(formData.grade),
        teacher: formData.teacher || undefined,
      };

      // Note: Modules will be added separately via module management
      const response = await adminService.createCourse(courseData);

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.ADMIN_ROUTES.COURSES);
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.COURSES)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">
          Add a new course to the curriculum
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert type="success">
          Course created successfully! Redirecting...
        </Alert>
      )}

      {/* Error Message */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Course Code"
                name="courseID"
                value={formData.courseID}
                onChange={handleChange}
                error={errors.courseID}
                placeholder="e.g., CS101, MATH101"
                helperText="Format: 2-4 uppercase letters + 3 digits"
                required
              />
              <Input
                label="Course Name"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                error={errors.courseName}
                placeholder="e.g., Introduction to Computer Science"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.description ? "border-destructive" : "border-border"
                }`}
                placeholder="Provide a detailed description of the course..."
                required
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Duration (weeks)"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                error={errors.duration}
                min="1"
                max="52"
                placeholder="e.g., 12"
                required
              />
              <Input
                label="Sessions"
                name="sessions"
                value={formData.sessions}
                onChange={handleChange}
                placeholder="e.g., 3 per week"
                helperText="Optional"
              />
              <Select
                label="Grade Level"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                error={errors.grade}
                required
                options={[
                  { value: "", label: "Select Grade" },
                  { value: "1", label: "Grade 1" },
                  { value: "2", label: "Grade 2" },
                  { value: "3", label: "Grade 3" },
                  { value: "4", label: "Grade 4" },
                  { value: "5", label: "Grade 5" },
                  { value: "6", label: "Grade 6" },
                  { value: "7", label: "Grade 7" },
                  { value: "8", label: "Grade 8" },
                  { value: "9", label: "Grade 9" },
                  { value: "10", label: "Grade 10" },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Teacher Assignment */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Teacher Assignment</h3>

            {loadingTeachers ? (
              <div className="flex items-center gap-2">
                <Loader size="sm" />
                <span className="text-sm text-muted-foreground">
                  Loading teachers...
                </span>
              </div>
            ) : (
              <Select
                label="Assign Teacher"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                helperText="Optional - You can assign a teacher later"
                options={[
                  { value: "", label: "No Teacher Assigned" },
                  ...teachers.map((teacher) => ({
                    value: teacher._id,
                    label: `${teacher.name}${
                      teacher.employeeId ? ` (${teacher.employeeId})` : ""
                    }`,
                  })),
                ]}
              />
            )}
          </div>
        </Card>

        {/* Modules Section */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Course Modules</h3>
                <p className="text-sm text-muted-foreground">
                  Add modules to organize course content (Optional)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addModule}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No modules added yet. Click "Add Module" to create course
                  modules.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-accent/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <Input
                          label={`Module ${index + 1} Name`}
                          value={module.name}
                          onChange={(e) =>
                            updateModule(index, "name", e.target.value)
                          }
                          placeholder="e.g., Introduction to Programming"
                        />
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          <textarea
                            value={module.description}
                            onChange={(e) =>
                              updateModule(index, "description", e.target.value)
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Module description..."
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(index)}
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {modules.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-info/10 rounded-lg">
                <Badge variant="info">{modules.length} modules</Badge>
                <span className="text-sm text-muted-foreground">
                  Note: Modules can be managed after course creation
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.COURSES)}
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
                Create Course
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
