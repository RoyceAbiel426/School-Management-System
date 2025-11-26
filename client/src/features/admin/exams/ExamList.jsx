import { Edit, Eye, FileText, Plus, Trash2 } from "lucide-react";
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
 * Exam List Page
 * List all exams with management options
 */
function ExamList() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllExams();
      setExams(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    try {
      await adminService.deleteExam(examId);
      fetchExams();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete exam");
    }
  };

  const columns = [
    {
      header: "Exam Name",
      accessor: "examName",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.examName}</div>
          <div className="text-sm text-gray-600">Grade {row.grade}</div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "examType",
      cell: (row) => (
        <Badge variant="info">{row.examType?.replace("_", " ")}</Badge>
      ),
    },
    {
      header: "Date",
      accessor: "date",
      cell: (row) => new Date(row.date).toLocaleDateString(),
    },
    { header: "Total Marks", accessor: "totalMarks" },
    {
      header: "Duration",
      accessor: "duration",
      cell: (row) => `${row.duration} min`,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <Badge variant={row.status === "PUBLISHED" ? "success" : "warning"}>
          {row.status || "Draft"}
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
            icon={<Eye className="h-4 w-4" />}
          >
            View
          </Button>
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

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout
      title="Exam Management"
      subtitle="Manage all examinations"
      action={
        <Button
          onClick={() => navigate(`${ROUTES.ADMIN_EXAMS}/create`)}
          icon={<Plus className="h-4 w-4" />}
        >
          Create Exam
        </Button>
      }
    >
      {error && <Alert type="error" message={error} className="mb-6" />}

      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <FileText className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            All Examinations
          </h3>
        </div>
        <Table columns={columns} data={exams} />
      </Card>
    </DashboardLayout>
  );
}

export default ExamList;
