import { Calendar, Edit, Eye, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

/**
 * Exam Schedule Page
 * View and manage all scheduled exams
 */
function ExamSchedule() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchExams();
  }, [filterGrade, filterType]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await adminService.getExamSchedule({
        grade: filterGrade !== "all" ? filterGrade : null,
        type: filterType !== "all" ? filterType : null,
      });
      setExams(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch exam schedule");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Exam",
      accessor: "exam",
      cell: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.examName}</div>
          <div className="text-sm text-gray-600">{row.course}</div>
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
      header: "Grade",
      accessor: "grade",
      cell: (row) => <Badge variant="primary">Grade {row.grade}</Badge>,
    },
    {
      header: "Date & Time",
      accessor: "date",
      cell: (row) => (
        <div>
          <div className="text-gray-900">
            {new Date(row.date).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-600">
            {row.startTime} - {row.endTime}
          </div>
        </div>
      ),
    },
    {
      header: "Marks",
      accessor: "marks",
      cell: (row) => `${row.totalMarks} (Pass: ${row.passingMarks})`,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => {
        const examDate = new Date(row.date);
        const now = new Date();
        const status =
          examDate > now
            ? "Upcoming"
            : examDate.toDateString() === now.toDateString()
            ? "Today"
            : "Completed";
        const variant =
          status === "Upcoming"
            ? "secondary"
            : status === "Today"
            ? "warning"
            : "success";
        return <Badge variant={variant}>{status}</Badge>;
      },
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
        </div>
      ),
    },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout
      title="Exam Schedule"
      subtitle="View and manage examination schedule"
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

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="h-6 w-6 text-primary-600" />
          <Select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="w-48"
          >
            <option value="all">All Grades</option>
            {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Grade {num}
              </option>
            ))}
          </Select>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-48"
          >
            <option value="all">All Types</option>
            <option value="UNIT_TEST">Unit Test</option>
            <option value="MID_TERM">Mid-Term</option>
            <option value="FINAL">Final Exam</option>
            <option value="QUIZ">Quiz</option>
          </Select>
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={exams} />
      </Card>
    </DashboardLayout>
  );
}

export default ExamSchedule;
