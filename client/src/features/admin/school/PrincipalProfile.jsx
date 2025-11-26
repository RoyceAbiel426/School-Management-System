import { Award, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Input, Loader } from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { adminService } from "../../../services/adminService";

/**
 * Principal Profile Management
 * View and edit principal information
 */
function PrincipalProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPrincipalProfile();
  }, []);

  const fetchPrincipalProfile = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPrincipalProfile();
      setProfile(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch principal profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await adminService.updatePrincipalProfile(profile);

      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update principal profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout
      title="Principal Profile"
      action={
        !editing ? (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        ) : null
      }
    >
      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && (
        <Alert
          type="success"
          message="Principal profile updated successfully!"
          className="mb-6"
        />
      )}

      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <User className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Principal Information
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            {editing ? (
              <Input
                value={profile?.principalName || ""}
                onChange={(e) => handleChange("principalName", e.target.value)}
                placeholder="Enter principal name"
              />
            ) : (
              <p className="text-gray-900 font-medium">
                {profile?.principalName || "Not set"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualification
            </label>
            {editing ? (
              <Input
                value={profile?.principalQualification || ""}
                onChange={(e) =>
                  handleChange("principalQualification", e.target.value)
                }
                placeholder="e.g., M.Ed., Ph.D."
                icon={<Award className="h-4 w-4" />}
              />
            ) : (
              <p className="text-gray-900">
                {profile?.principalQualification || "Not specified"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            {editing ? (
              <Input
                type="email"
                value={profile?.principalEmail || ""}
                onChange={(e) => handleChange("principalEmail", e.target.value)}
                placeholder="Enter email address"
                icon={<Mail className="h-4 w-4" />}
              />
            ) : (
              <p className="text-gray-900">
                {profile?.principalEmail || "Not set"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            {editing ? (
              <Input
                type="tel"
                value={profile?.principalPhone || ""}
                onChange={(e) => handleChange("principalPhone", e.target.value)}
                placeholder="Enter phone number"
                icon={<Phone className="h-4 w-4" />}
              />
            ) : (
              <p className="text-gray-900">
                {profile?.principalPhone || "Not set"}
              </p>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setEditing(false);
                fetchPrincipalProfile();
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default PrincipalProfile;
