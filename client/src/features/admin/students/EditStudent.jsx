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
import { validateEmail, validatePhone } from "../../../utils/validators";

export default function EditStudent() {
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
    class: "",
    section: "",
    rollNumber: "",
    admissionDate: "",
    phone: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    status: "active",
    previousSchool: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getStudentById(id);

      if (response.data.success) {
        const student = response.data.data;

        // Format dates for input fields
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        setFormData({
          name: student.name || "",
          email: student.email || "",
          dateOfBirth: formatDate(student.dateOfBirth),
          gender: student.gender || "",
          bloodGroup: student.bloodGroup || "",
          class: student.class?.name || student.class || "",
          section: student.section || "",
          rollNumber: student.rollNumber || "",
          admissionDate: formatDate(student.admissionDate),
          phone: student.phone || "",
          parentPhone: student.parentPhone || "",
          parentEmail: student.parentEmail || "",
          address: student.address || "",
          city: student.city || "",
          state: student.state || "",
          pincode: student.pincode || "",
          status: student.status || "active",
          previousSchool: student.previousSchool || "",
        });
      }
    } catch (err) {
      console.error("Error fetching student:", err);
      setError(err.response?.data?.message || "Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

    if (formData.parentEmail && !validateEmail(formData.parentEmail)) {
      newErrors.parentEmail = "Invalid email address";
    }

    if (!formData.class) newErrors.class = "Class is required";
    if (!formData.rollNumber) newErrors.rollNumber = "Roll number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

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

      const response = await adminService.updateStudent(id, formData);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.ADMIN_ROUTES.STUDENTS);
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating student:", err);
      setError(err.response?.data?.message || "Failed to update student");
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
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.STUDENTS)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Student</h1>
        <p className="text-muted-foreground">Update student information</p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert type="success">
          Student updated successfully! Redirecting...
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
              placeholder="Enter student's full name"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
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
          </div>
        </Card>

        {/* Academic Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Academic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                error={errors.class}
                required
                options={[
                  { value: "", label: "Select Class" },
                  { value: "Class 1", label: "Class 1" },
                  { value: "Class 2", label: "Class 2" },
                  { value: "Class 3", label: "Class 3" },
                  { value: "Class 4", label: "Class 4" },
                  { value: "Class 5", label: "Class 5" },
                  { value: "Class 6", label: "Class 6" },
                  { value: "Class 7", label: "Class 7" },
                  { value: "Class 8", label: "Class 8" },
                  { value: "Class 9", label: "Class 9" },
                  { value: "Class 10", label: "Class 10" },
                ]}
              />
              <Input
                label="Section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g., A, B, C"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                error={errors.rollNumber}
                required
                placeholder="Enter roll number"
              />
              <Input
                label="Admission Date"
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Previous School"
              name="previousSchool"
              value={formData.previousSchool}
              onChange={handleChange}
              placeholder="Name of previous school (optional)"
            />
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Student Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                placeholder="10-digit phone number"
              />
              <Input
                label="Parent Phone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                placeholder="Parent/guardian phone"
              />
            </div>

            <Input
              label="Parent Email"
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              error={errors.parentEmail}
              placeholder="parent@example.com"
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
              placeholder="Full address"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
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
              placeholder="student@example.com"
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
                { value: "suspended", label: "Suspended" },
                { value: "graduated", label: "Graduated" },
              ]}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.STUDENTS)}
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
