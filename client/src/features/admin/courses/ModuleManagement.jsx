import { BookOpen, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Table,
} from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

/**
 * Module Management
 * Create and manage modules within courses
 */
function ModuleManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    moduleName: "",
    moduleCode: "",
    description: "",
    duration: "",
    order: 1,
  });

  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const fetchModules = async () => {
    try {
      const response = await adminService.getCourseModules(courseId);
      setModules(response.data.modules || []);
      setCourseName(response.data.courseName || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch modules");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      await adminService.createModule(courseId, formData);

      setFormData({
        moduleName: "",
        moduleCode: "",
        description: "",
        duration: "",
        order: modules.length + 1,
      });
      setShowForm(false);
      fetchModules();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create module");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (moduleId) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      await adminService.deleteModule(moduleId);
      fetchModules();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete module");
    }
  };

  const columns = [
    {
      header: "Order",
      accessor: "order",
      cell: (row) => <Badge variant="secondary">#{row.order}</Badge>,
    },
    {
      header: "Module",
      accessor: "module",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.moduleName}</div>
          <div className="text-sm text-gray-600">{row.moduleCode}</div>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      cell: (row) => row.description || "No description",
    },
    {
      header: "Duration",
      accessor: "duration",
      cell: (row) => `${row.duration || 0} hours`,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <Badge variant="success">{row.status || "Active"}</Badge>,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Module Management"
      subtitle={courseName}
      action={
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.ADMIN_COURSES)}
          >
            Back to Courses
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            icon={<Plus className="h-4 w-4" />}
          >
            {showForm ? "Cancel" : "Add Module"}
          </Button>
        </div>
      }
    >
      {error && <Alert type="error" message={error} className="mb-6" />}

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Add New Module
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Module Name *"
              value={formData.moduleName}
              onChange={(e) =>
                setFormData({ ...formData, moduleName: e.target.value })
              }
              required
            />
            <Input
              label="Module Code *"
              value={formData.moduleCode}
              onChange={(e) =>
                setFormData({ ...formData, moduleCode: e.target.value })
              }
              required
            />
            <Input
              label="Duration (hours)"
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
            <Input
              label="Order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
            />
            <div className="col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Module"}
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Course Modules
        </h3>
        {modules.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              No modules found. Add your first module to get started.
            </p>
          </div>
        ) : (
          <Table columns={columns} data={modules} />
        )}
      </Card>
    </DashboardLayout>
  );
}

export default ModuleManagement;
