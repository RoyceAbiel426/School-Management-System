import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout";
import { Card, Loader, Alert, Badge } from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { TrendingUp, TrendingDown, Award } from "lucide-react";

function ClassPerformance() {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { error: showError } = useNotification();

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getClassPerformance();
      setPerformance(response.data || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load performance data";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Class Performance">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Class Performance"
      subtitle="Overview of all classes performance"
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Award className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {performance.length > 0
                ? (
                    performance.reduce((sum, p) => sum + (p.avgGrade || 0), 0) /
                    performance.length
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
              {performance.filter((p) => p.trend > 0).length}
            </p>
            <p className="text-sm text-gray-600">Improving Classes</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {performance.length}
            </p>
            <p className="text-sm text-gray-600">Total Classes</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {performance.map((cls) => (
          <Card key={cls.classId}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {cls.className}
                </h3>
                <p className="text-sm text-gray-600">{cls.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                {cls.trend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-success-500" />
                ) : cls.trend < 0 ? (
                  <TrendingDown className="h-5 w-5 text-error-500" />
                ) : null}
                <Badge variant={cls.avgGrade >= 75 ? "success" : "warning"}>
                  {cls.avgGrade}% avg
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-xl font-bold text-gray-800">
                  {cls.totalStudents}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-xl font-bold text-gray-800">
                  {cls.avgAttendance}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pass Rate</p>
                <p className="text-xl font-bold text-gray-800">
                  {cls.passRate}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Top Score</p>
                <p className="text-xl font-bold text-gray-800">
                  {cls.topScore || "N/A"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default ClassPerformance;
