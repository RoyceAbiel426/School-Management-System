import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Home,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../../components/common/Alert";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";
import { validateEmail, validatePhone } from "../../../utils/validators";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Academic Info", icon: BookOpen },
  { id: 3, title: "Contact Info", icon: Home },
  { id: 4, title: "Account Info", icon: Shield },
];

export default function CreateStudent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",

    // Academic Info
    class: "",
    section: "",
    rollNumber: "",
    admissionDate: "",
    previousSchool: "",

    // Contact Info
    phone: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Account Info
    email: "",
    password: "",
    confirmPassword: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (step === 2) {
      if (!formData.class) newErrors.class = "Class is required";
      if (!formData.rollNumber)
        newErrors.rollNumber = "Roll number is required";
      if (!formData.admissionDate)
        newErrors.admissionDate = "Admission date is required";
    }

    if (step === 3) {
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Invalid phone number";
      }
      if (formData.parentEmail && !validateEmail(formData.parentEmail)) {
        newErrors.parentEmail = "Invalid email address";
      }
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }

    if (step === 4) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Invalid email address";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Remove confirmPassword before sending
      const { confirmPassword, ...studentData } = formData;

      const response = await adminService.createStudent(studentData);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.ADMIN_ROUTES.STUDENTS);
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating student:", err);
      setError(err.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
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
                required
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                required
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
        );

      case 2:
        return (
          <div className="space-y-4">
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
                error={errors.admissionDate}
                required
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
        );

      case 3:
        return (
          <div className="space-y-4">
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
        );

      case 4:
        return (
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="student@example.com"
              helperText="This will be used for login"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                placeholder="Minimum 6 characters"
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                placeholder="Re-enter password"
              />
            </div>
            <Select
              label="Account Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
        );

      default:
        return null;
    }
  };

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
        <h1 className="text-3xl font-bold">Add New Student</h1>
        <p className="text-muted-foreground">
          Fill in the student information step by step
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert type="success">
          Student created successfully! Redirecting...
        </Alert>
      )}

      {/* Error Message */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-2 text-sm text-center">
                  <div
                    className={
                      isActive ? "font-semibold" : "text-muted-foreground"
                    }
                  >
                    {step.title}
                  </div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    isCompleted ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={handleNext} disabled={loading}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Student
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
