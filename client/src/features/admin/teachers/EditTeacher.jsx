import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/common/Alert";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Loader from "../../../components/common/Loader";
import Select from "../../../components/common/Select";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";
import { validateEmail, validatePhone } from "../../../utils/validators";

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    qualification: "",
    experience: "",
    joiningDate: "",
    employeeId: "",
    department: "",
    designation: "",
    isClassTeacher: false,
    classTeacherOf: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);

  const availableSubjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Physical Education",
  ];

  const availableClasses = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getTeacherById(id);

      if (response.data.success) {
        const teacher = response.data.data;

        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        setFormData({
          name: teacher.name || "",
          email: teacher.email || "",
          dateOfBirth: formatDate(teacher.dateOfBirth),
          gender: teacher.gender || "",
          bloodGroup: teacher.bloodGroup || "",
          phone: teacher.phone || "",
          address: teacher.address || "",
          city: teacher.city || "",
          state: teacher.state || "",
          pincode: teacher.pincode || "",
          qualification: teacher.qualification || "",
          experience: teacher.experience || "",
          joiningDate: formatDate(teacher.joiningDate),
          employeeId: teacher.employeeId || "",
          department: teacher.department || "",
          designation: teacher.designation || "",
          isClassTeacher: teacher.isClassTeacher || false,
          classTeacherOf: teacher.classTeacherOf || "",
          status: teacher.status || "active",
        });

        if (Array.isArray(teacher.subjects)) {
          setSelectedSubjects(teacher.subjects.map((s) => s.name || s));
        }
        if (Array.isArray(teacher.classes)) {
          setSelectedClasses(teacher.classes.map((c) => c.name || c));
        }
      }
    } catch (err) {
      console.error("Error fetching teacher:", err);
      setError(err.response?.data?.message || "Failed to load teacher data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subject)) {
        return prev.filter((s) => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  const handleClassToggle = (classItem) => {
    setSelectedClasses((prev) => {
      if (prev.includes(classItem)) {
        return prev.filter((c) => c !== classItem);
      } else {
        return [...prev, classItem];
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.qualification)
      newErrors.qualification = "Qualification is required";
    if (!formData.designation)
      newErrors.designation = "Designation is required";

    if (selectedSubjects.length === 0) {
      newErrors.subjects = "Please select at least one subject";
    }

    if (formData.isClassTeacher && !formData.classTeacherOf) {
      newErrors.classTeacherOf = "Please select a class";
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

      const teacherData = {
        ...formData,
        subjects: selectedSubjects,
        classes: selectedClasses,
      };

      const response = await adminService.updateTeacher(id, teacherData);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.ADMIN_ROUTES.TEACHERS);
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating teacher:", err);
      setError(err.response?.data?.message || "Failed to update teacher");
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
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.TEACHERS)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teachers
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Teacher</h1>
        <p className="text-muted-foreground">Update teacher information</p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert type="success">
          Teacher updated successfully! Redirecting...
        </Alert>
      )}

      {/* Error Message */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Gender" },
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Blood Group" },
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" },
                ]}
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />
            </div>

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Information</h3>

            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              error={errors.qualification}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Years of Experience"
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
              />
              <Input
                label="Joining Date"
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
              />
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Department" },
                  { value: "Science", label: "Science" },
                  { value: "Mathematics", label: "Mathematics" },
                  { value: "Languages", label: "Languages" },
                  { value: "Social Studies", label: "Social Studies" },
                  { value: "Arts", label: "Arts" },
                  { value: "Physical Education", label: "Physical Education" },
                ]}
              />
            </div>

            <Select
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={errors.designation}
              required
              options={[
                { value: "", label: "Select Designation" },
                { value: "Teacher", label: "Teacher" },
                { value: "Senior Teacher", label: "Senior Teacher" },
                { value: "Head of Department", label: "Head of Department" },
                { value: "Vice Principal", label: "Vice Principal" },
              ]}
            />
          </div>
        </Card>

        {/* Subjects & Classes */}
        <Card>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Subjects & Classes</h3>

            <div>
              <label className="block text-sm font-medium mb-3">
                Subjects <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSubjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                      selectedSubjects.includes(subject)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-accent border-border"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              {errors.subjects && (
                <p className="text-sm text-destructive mt-2">
                  {errors.subjects}
                </p>
              )}
              {selectedSubjects.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSubjects.map((subject) => (
                    <Badge key={subject} variant="primary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Assigned Classes
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {availableClasses.map((classItem) => (
                  <button
                    key={classItem}
                    type="button"
                    onClick={() => handleClassToggle(classItem)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                      selectedClasses.includes(classItem)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-accent border-border"
                    }`}
                  >
                    {classItem}
                  </button>
                ))}
              </div>
              {selectedClasses.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedClasses.map((classItem) => (
                    <Badge key={classItem} variant="info">
                      {classItem}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isClassTeacher"
                  checked={formData.isClassTeacher}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">
                  Assign as Class Teacher
                </span>
              </label>

              {formData.isClassTeacher && (
                <div className="mt-3">
                  <Select
                    label="Class Teacher Of"
                    name="classTeacherOf"
                    value={formData.classTeacherOf}
                    onChange={handleChange}
                    error={errors.classTeacherOf}
                    required={formData.isClassTeacher}
                    options={[
                      { value: "", label: "Select Class" },
                      ...availableClasses.map((c) => ({ value: c, label: c })),
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Account Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Information</h3>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              helperText="Used for login"
            />

            <Select
              label="Account Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "onLeave", label: "On Leave" },
                { value: "resigned", label: "Resigned" },
              ]}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.TEACHERS)}
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
