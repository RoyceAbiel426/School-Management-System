import { Edit, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Loader,
  Select,
  Table,
} from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { adminService } from "../../../services/adminService";

/**
 * Classroom Management
 * Manage sections within grades, assign class teachers
 */
function ClassroomManagement() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("all");

  useEffect(() => {
    fetchClassrooms();
  }, [selectedGrade]);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllClassrooms({
        grade: selectedGrade !== "all" ? selectedGrade : null,
      });
      setClassrooms(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch classrooms");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Classroom",
      accessor: "classroom",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900">
            Grade {row.grade} - Section {row.section}
          </div>
          <div className="text-sm text-gray-600">
            Classroom {row.roomNumber || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Students",
      accessor: "students",
      cell: (row) => (
        <div>
          <div className="text-gray-900">
            {row.currentStudents || 0} / {row.capacity || 30}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full bg-primary-600"
              style={{
                width: `${
                  ((row.currentStudents || 0) / (row.capacity || 30)) * 100
                }%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Class Teacher",
      accessor: "classTeacher",
      cell: (row) =>
        row.classTeacher || <span className="text-gray-500">Not assigned</span>,
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
            icon={<Trash2 className="h-4 w-4 text-error-600" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout
      title="Classroom Management"
      subtitle="Manage sections and assign class teachers"
    >
      {error && <Alert type="error" message={error} className="mb-6" />}

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="h-6 w-6 text-primary-600" />
            <Select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-48"
            >
              <option value="all">All Grades</option>
              {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Grade {num}
                </option>
              ))}
            </Select>
          </div>
          <div className="text-sm text-gray-600">
            Total Classrooms:{" "}
            <span className="font-semibold text-gray-900">
              {classrooms.length}
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={classrooms} />
      </Card>
    </DashboardLayout>
  );
}

export default ClassroomManagement;
