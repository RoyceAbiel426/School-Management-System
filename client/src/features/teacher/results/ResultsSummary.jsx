import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Badge,
  Loader,
  Alert,
  Table,
} from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { TrendingUp, Award, Download } from "lucide-react";

function ResultsSummary() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState("all");

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchSummary();
  }, [selectedClass]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getResultsSummary(selectedClass);
      setSummary(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load summary";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Exam", accessor: "examName" },
    { header: "Class", accessor: "className" },
    { header: "Students", accessor: "totalStudents" },
    {
      header: "Avg Marks",
      accessor: "avgMarks",
      cell: (v) => v?.toFixed(2) || "N/A",
    },
    { header: "Highest", accessor: "highestMarks" },
    { header: "Lowest", accessor: "lowestMarks" },
    {
      header: "Pass %",
      accessor: "passPercentage",
      cell: (v) => (
        <Badge variant={v >= 75 ? "success" : "warning"}>{v}%</Badge>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Results Summary">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Results Summary"
      subtitle="View exam results and statistics"
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="mb-6 flex justify-between items-center">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Classes</option>
          {summary.map((s) => (
            <option key={s.classId} value={s.classId}>
              {s.className}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.TEACHER_RESULTS + "/enter")}
          >
            Enter Results
          </Button>
          <Button icon={<Download className="h-4 w-4" />}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Award className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {summary.length > 0
                ? (
                    summary.reduce((sum, s) => sum + (s.avgMarks || 0), 0) /
                    summary.length
                  ).toFixed(1)
                : 0}
            </p>
            <p className="text-sm text-gray-600">Overall Average</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {summary.length > 0
                ? (
                    summary.reduce(
                      (sum, s) => sum + (s.passPercentage || 0),
                      0
                    ) / summary.length
                  ).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-gray-600">Pass Rate</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{summary.length}</p>
            <p className="text-sm text-gray-600">Exams Conducted</p>
          </div>
        </Card>
      </div>

      <Card>
        {summary.length > 0 ? (
          <Table columns={columns} data={summary} />
        ) : (
          <p className="text-center text-gray-600 py-8">
            No results data available
          </p>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default ResultsSummary;
