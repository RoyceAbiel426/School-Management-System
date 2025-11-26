import {
  Building2,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Loader,
} from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

/**
 * School Profile View/Edit Page
 * Display and edit school information
 */
function SchoolProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSchoolProfile();
  }, []);

  const fetchSchoolProfile = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSchoolProfile();
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch school profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    fetchSchoolProfile(); // Reset to original data
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await adminService.updateSchoolProfile(profile);

      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update school profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <Loader fullScreen />;

  if (!profile) {
    return (
      <DashboardLayout title="School Profile">
        <Card>
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No School Profile Found
            </h3>
            <p className="text-gray-600 mb-6">
              Complete the school profile setup to get started
            </p>
            <Button onClick={() => navigate(ROUTES.ADMIN_SCHOOL_SETUP)}>
              Setup School Profile
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="School Profile"
      subtitle={profile.schoolName}
      action={
        !editing && (
          <Button onClick={handleEdit} icon={<Edit className="h-4 w-4" />}>
            Edit Profile
          </Button>
        )
      }
    >
      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && (
        <Alert
          type="success"
          message="School profile updated successfully!"
          className="mb-6"
        />
      )}

      {/* Basic Information */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <Building2 className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Basic Information
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name
            </label>
            {editing ? (
              <Input
                value={profile.schoolName}
                onChange={(e) => handleChange("schoolName", e.target.value)}
              />
            ) : (
              <p className="text-gray-900 font-medium">{profile.schoolName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Type
            </label>
            {editing ? (
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={profile.schoolType}
                onChange={(e) => handleChange("schoolType", e.target.value)}
              >
                <option value="BOYS">Boys School</option>
                <option value="GIRLS">Girls School</option>
                <option value="MIXED">Co-educational</option>
              </select>
            ) : (
              <Badge
                variant={profile.schoolType === "MIXED" ? "success" : "primary"}
              >
                {profile.schoolType === "BOYS"
                  ? "Boys School"
                  : profile.schoolType === "GIRLS"
                  ? "Girls School"
                  : "Co-educational"}
              </Badge>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Established Year
            </label>
            {editing ? (
              <Input
                type="number"
                value={profile.establishedYear}
                onChange={(e) =>
                  handleChange("establishedYear", e.target.value)
                }
              />
            ) : (
              <p className="text-gray-900">{profile.establishedYear}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            {editing ? (
              <Input
                value={profile.registrationNumber}
                onChange={(e) =>
                  handleChange("registrationNumber", e.target.value)
                }
              />
            ) : (
              <p className="text-gray-900">{profile.registrationNumber}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affiliation
            </label>
            {editing ? (
              <Input
                value={profile.affiliation}
                onChange={(e) => handleChange("affiliation", e.target.value)}
              />
            ) : (
              <p className="text-gray-900">
                {profile.affiliation || "Not specified"}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <MapPin className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Contact Information
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            {editing ? (
              <Input
                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            ) : (
              <p className="text-gray-900">{profile.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            {editing ? (
              <Input
                value={profile.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            ) : (
              <p className="text-gray-900">{profile.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            {editing ? (
              <Input
                value={profile.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            ) : (
              <p className="text-gray-900">{profile.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone
            </label>
            {editing ? (
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            ) : (
              <p className="text-gray-900">{profile.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email
            </label>
            {editing ? (
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            ) : (
              <p className="text-gray-900">{profile.email}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            {editing ? (
              <Input
                type="url"
                value={profile.website}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            ) : (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </Card>

      {/* Academic Configuration */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <Users className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Academic Configuration
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Grades
            </label>
            <p className="text-2xl font-bold text-gray-900">
              {profile.totalGrades || 14}
            </p>
            <p className="text-sm text-gray-600">
              Grades 1-{profile.totalGrades || 14}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sections per Grade
            </label>
            <p className="text-2xl font-bold text-gray-900">
              {profile.sectionsPerGrade || 5}
            </p>
            <p className="text-sm text-gray-600">Sections A-E</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Students per Class
            </label>
            <p className="text-2xl font-bold text-gray-900">
              {profile.studentsPerClass || 30}
            </p>
            <p className="text-sm text-gray-600">Max capacity</p>
          </div>

          <div className="col-span-3 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Academic Year
            </label>
            <p className="text-gray-900">
              {new Date(profile.academicYearStart).toLocaleDateString()} -{" "}
              {new Date(profile.academicYearEnd).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {editing && (
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}

export default SchoolProfile;
