import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../../components/common/Alert";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";
import { validateEmail, validatePhone } from "../../../utils/validators";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Professional Info", icon: Briefcase },
  { id: 3, title: "Subjects & Classes", icon: BookOpen },
  { id: 4, title: "Account Info", icon: Shield },
];

export default function CreateTeacher() {
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
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Professional Info
    qualification: "",
    experience: "",
    joiningDate: "",
    employeeId: "",
    department: "",
    designation: "",

    // Subjects & Classes
    subjects: [],
    classes: [],
    isClassTeacher: false,
    classTeacherOf: "",

    // Account Info
    email: "",
    password: "",
    confirmPassword: "",
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Invalid phone number";
      }
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }

    if (step === 2) {
      if (!formData.qualification)
        newErrors.qualification = "Qualification is required";
      if (!formData.joiningDate)
        newErrors.joiningDate = "Joining date is required";
      if (!formData.designation)
        newErrors.designation = "Designation is required";
    }

    if (step === 3) {
      if (selectedSubjects.length === 0) {
        newErrors.subjects = "Please select at least one subject";
      }
      if (formData.isClassTeacher && !formData.classTeacherOf) {
        newErrors.classTeacherOf = "Please select a class";
      }
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

      const { confirmPassword, ...teacherData } = formData;
      teacherData.subjects = selectedSubjects;
      teacherData.classes = selectedClasses;

      const response = await adminService.createTeacher(teacherData);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.ADMIN_ROUTES.TEACHERS);
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating teacher:", err);
      setError(err.response?.data?.message || "Failed to create teacher");
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
              placeholder="Enter teacher's full name"
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
                placeholder="10-digit phone number"
              />
            </div>
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

      case 2:
        return (
          <div className="space-y-4">
            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              error={errors.qualification}
              required
              placeholder="e.g., M.Ed, B.Ed, M.Sc"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Years of Experience"
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years"
                min="0"
              />
              <Input
                label="Joining Date"
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                error={errors.joiningDate}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Employee ID (optional)"
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
        );

      case 3:
        return (
          <div className="space-y-6">
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
                Assigned Classes (Optional)
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
              placeholder="teacher@example.com"
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
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.TEACHERS)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teachers
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Add New Teacher</h1>
        <p className="text-muted-foreground">
          Fill in the teacher information step by step
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert type="success">
          Teacher created successfully! Redirecting...
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
                    Create Teacher
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
