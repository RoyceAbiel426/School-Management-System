import { Building2, FileText, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Input, Select } from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

/**
 * School Profile Setup - Multi-step onboarding wizard
 * Critical first-time setup for new schools
 */
function SchoolProfileSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    schoolName: "",
    schoolType: "MIXED", // BOYS, GIRLS, MIXED
    establishedYear: "",
    registrationNumber: "",
    affiliation: "",

    // Step 2: Contact Information
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",

    // Step 3: Principal Information
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    principalQualification: "",

    // Step 4: Academic Configuration
    academicYearStart: "",
    academicYearEnd: "",
    totalGrades: 14, // 1-14
    studentsPerClass: 30,
    sectionsPerGrade: 5, // A-E
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      await adminService.setupSchoolProfile(formData);

      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.ADMIN_SCHOOL_PROFILE);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to setup school profile");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-8 w-8 text-primary-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Basic Information
          </h3>
          <p className="text-sm text-gray-600">
            Enter your school's basic details
          </p>
        </div>
      </div>

      <Input
        label="School Name *"
        value={formData.schoolName}
        onChange={(e) => handleChange("schoolName", e.target.value)}
        placeholder="Enter school name"
        required
      />

      <Select
        label="School Type *"
        value={formData.schoolType}
        onChange={(e) => handleChange("schoolType", e.target.value)}
        required
      >
        <option value="BOYS">Boys School</option>
        <option value="GIRLS">Girls School</option>
        <option value="MIXED">Co-educational</option>
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Established Year *"
          type="number"
          value={formData.establishedYear}
          onChange={(e) => handleChange("establishedYear", e.target.value)}
          placeholder="YYYY"
          required
        />
        <Input
          label="Registration Number *"
          value={formData.registrationNumber}
          onChange={(e) => handleChange("registrationNumber", e.target.value)}
          placeholder="Enter registration number"
          required
        />
      </div>

      <Input
        label="Affiliation"
        value={formData.affiliation}
        onChange={(e) => handleChange("affiliation", e.target.value)}
        placeholder="e.g., CBSE, ICSE, State Board"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="h-8 w-8 text-primary-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Contact Information
          </h3>
          <p className="text-sm text-gray-600">
            Provide school contact details
          </p>
        </div>
      </div>

      <Input
        label="Address *"
        value={formData.address}
        onChange={(e) => handleChange("address", e.target.value)}
        placeholder="Enter full address"
        required
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City *"
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
          required
        />
        <Input
          label="State *"
          value={formData.state}
          onChange={(e) => handleChange("state", e.target.value)}
          required
        />
        <Input
          label="Pincode *"
          value={formData.pincode}
          onChange={(e) => handleChange("pincode", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone *"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          icon={<Phone className="h-4 w-4" />}
          required
        />
        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          required
        />
      </div>

      <Input
        label="Website"
        type="url"
        value={formData.website}
        onChange={(e) => handleChange("website", e.target.value)}
        placeholder="https://www.example.com"
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-primary-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Principal Information
          </h3>
          <p className="text-sm text-gray-600">Enter principal's details</p>
        </div>
      </div>

      <Input
        label="Principal Name *"
        value={formData.principalName}
        onChange={(e) => handleChange("principalName", e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Principal Email *"
          type="email"
          value={formData.principalEmail}
          onChange={(e) => handleChange("principalEmail", e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          required
        />
        <Input
          label="Principal Phone *"
          type="tel"
          value={formData.principalPhone}
          onChange={(e) => handleChange("principalPhone", e.target.value)}
          icon={<Phone className="h-4 w-4" />}
          required
        />
      </div>

      <Input
        label="Qualification"
        value={formData.principalQualification}
        onChange={(e) => handleChange("principalQualification", e.target.value)}
        placeholder="e.g., M.Ed., Ph.D."
      />
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-primary-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Academic Configuration
          </h3>
          <p className="text-sm text-gray-600">Configure academic structure</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Academic Year Start *"
          type="date"
          value={formData.academicYearStart}
          onChange={(e) => handleChange("academicYearStart", e.target.value)}
          required
        />
        <Input
          label="Academic Year End *"
          type="date"
          value={formData.academicYearEnd}
          onChange={(e) => handleChange("academicYearEnd", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Total Grades *"
          type="number"
          value={formData.totalGrades}
          onChange={(e) =>
            handleChange("totalGrades", parseInt(e.target.value))
          }
          min="1"
          max="14"
          required
        />
        <Input
          label="Sections per Grade *"
          type="number"
          value={formData.sectionsPerGrade}
          onChange={(e) =>
            handleChange("sectionsPerGrade", parseInt(e.target.value))
          }
          min="1"
          max="5"
          required
        />
        <Input
          label="Students per Class *"
          type="number"
          value={formData.studentsPerClass}
          onChange={(e) =>
            handleChange("studentsPerClass", parseInt(e.target.value))
          }
          min="10"
          max="50"
          required
        />
      </div>

      <Alert
        type="info"
        message="Grades 1-14 will be created with the specified sections (A-E) and student capacity."
      />
    </div>
  );

  return (
    <DashboardLayout
      title="School Profile Setup"
      subtitle="Complete the onboarding process"
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      currentStep > step ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {error && <Alert type="error" message={error} className="mt-6" />}
          {success && (
            <Alert
              type="success"
              message="School profile created successfully! Redirecting..."
              className="mt-6"
            />
          )}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
            >
              Back
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Setting up..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default SchoolProfileSetup;
