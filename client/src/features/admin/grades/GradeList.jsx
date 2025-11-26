import { BookOpen, Eye, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Loader,
  Table,
} from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

/**
 * Grade List & Management
 * Display all grades (1-14) with sections and statistics
 */
function GradeList() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllGrades();
      setGrades(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch grades");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Grade",
      accessor: "gradeNumber",
      cell: (row) => (
        <div className="font-semibold text-gray-900">
          Grade {row.gradeNumber}
        </div>
      ),
    },
    {
      header: "Sections",
      accessor: "sectionsCount",
      cell: (row) => (
        <Badge variant="info">{row.sectionsCount || 5} Sections</Badge>
      ),
    },
    {
      header: "Total Students",
      accessor: "totalStudents",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900">{row.totalStudents || 0}</span>
        </div>
      ),
    },
    {
      header: "Capacity",
      accessor: "capacity",
      cell: (row) => {
        const capacity = (row.sectionsCount || 5) * 30;
        const percentage = ((row.totalStudents || 0) / capacity) * 100;
        return (
          <div>
            <div className="text-sm text-gray-900">
              {row.totalStudents || 0} / {capacity}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full ${
                  percentage >= 90
                    ? "bg-error-500"
                    : percentage >= 70
                    ? "bg-warning-500"
                    : "bg-success-500"
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Courses",
      accessor: "coursesCount",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900">{row.coursesCount || 0}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <Badge variant={row.status === "ACTIVE" ? "success" : "secondary"}>
          {row.status || "ACTIVE"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          icon={<Eye className="h-4 w-4" />}
          onClick={() => navigate(`${ROUTES.ADMIN_GRADES}/${row.gradeNumber}`)}
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout
      title="Grade Management"
      subtitle="Manage all grades and classrooms"
      action={
        <Button
          onClick={() => navigate(`${ROUTES.ADMIN_GRADES}/create`)}
          icon={<Plus className="h-4 w-4" />}
        >
          Create Grade
        </Button>
      }
    >
      {error && <Alert type="error" message={error} className="mb-6" />}

      {grades.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Grades Found
            </h3>
            <p className="text-gray-600 mb-6">
              Create grades to start organizing your school structure
            </p>
            <Button onClick={() => navigate(`${ROUTES.ADMIN_GRADES}/create`)}>
              Create First Grade
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <div className="text-sm text-gray-600">Total Grades</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {grades.length}
              </div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600">Total Sections</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {grades.reduce((sum, g) => sum + (g.sectionsCount || 5), 0)}
              </div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600">Total Students</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {grades.reduce((sum, g) => sum + (g.totalStudents || 0), 0)}
              </div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600">Total Capacity</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {grades.reduce(
                  (sum, g) => sum + (g.sectionsCount || 5) * 30,
                  0
                )}
              </div>
            </Card>
          </div>

          {/* Grades Table */}
          <Card>
            <Table columns={columns} data={grades} />
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}

export default GradeList;
