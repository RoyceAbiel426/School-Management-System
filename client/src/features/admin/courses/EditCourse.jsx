import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/common/Alert";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Loader from "../../../components/common/Loader";
import Select from "../../../components/common/Select";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchCourse();
    fetchTeachers();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getCourseById(id);

      if (response.data.success) {
        const course = response.data.data;

        setFormData({
          courseID: course.courseID || "",
          courseName: course.courseName || "",
          description: course.description || "",
          duration: course.duration || "",
          sessions: course.sessions || "",
          grade: course.grade || "",
          teacher: course.teacher?._id || course.teacher || "",
        });
      }
    } catch (err) {
      console.error("Error fetching course:", err);
      setError(err.response?.data?.message || "Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      setError(null);

      const courseData = {
        ...formData,
        duration: parseInt(formData.duration),
        grade: parseInt(formData.grade),
        teacher: formData.teacher || undefined,
      };

      const response = await adminService.updateCourse(id, courseData);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.ADMIN_ROUTES.COURSES);
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating course:", err);
      setError(err.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">Update course information</p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert type="success">
          Course updated successfully! Redirecting...
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
                helperText="Optional - Select a teacher for this course"
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

        {/* Info Note */}
        <Card>
          <div className="flex items-start gap-3 p-4 bg-info/10 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Module Management</h4>
              <p className="text-sm text-muted-foreground">
                Course modules can be managed from the Course Detail page after
                saving these changes.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.COURSES)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
