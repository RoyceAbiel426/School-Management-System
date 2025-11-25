import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Badge, Loader, Alert } from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  AlertCircle,
  ArrowLeft,
  Calendar,
} from "lucide-react";

/**
 * Class Statistics Page
 * View detailed statistics and analytics for a class
 */
function ClassStatistics() {
  const { classId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchStatistics();
  }, [classId, selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teacherService.getClassStatistics(
        classId,
        selectedPeriod
      );
      const data = response.data || {};

      setStats(data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load statistics";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Class Statistics">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout title="Class Statistics">
        <Alert type="error" message="Statistics not available" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Class Statistics"
      subtitle={`${stats.className || "Class"} Performance Analytics`}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.TEACHER_CLASSES)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Classes
        </Button>

        {/* Period Filter */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="semester">This Semester</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-primary-50 border-primary-200">
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary-600 mb-2" />
            <p className="text-2xl font-bold text-primary-700">
              {stats.totalStudents || 0}
            </p>
            <p className="text-sm text-primary-600">Total Students</p>
          </div>
        </Card>

        <Card className="bg-success-50 border-success-200">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-600 mb-2" />
            <p className="text-2xl font-bold text-success-700">
              {stats.avgAttendance || 0}%
            </p>
            <p className="text-sm text-success-600">Avg Attendance</p>
            {stats.attendanceTrend > 0 ? (
              <Badge variant="success" className="mt-1">
                +{stats.attendanceTrend}%
              </Badge>
            ) : stats.attendanceTrend < 0 ? (
              <Badge variant="error" className="mt-1">
                {stats.attendanceTrend}%
              </Badge>
            ) : null}
          </div>
        </Card>

        <Card className="bg-info-50 border-info-200">
          <div className="text-center">
            <Award className="h-8 w-8 mx-auto text-info-600 mb-2" />
            <p className="text-2xl font-bold text-info-700">
              {stats.avgGrade || "N/A"}
            </p>
            <p className="text-sm text-info-600">Average Grade</p>
            {stats.gradeTrend > 0 ? (
              <Badge variant="success" className="mt-1">
                +{stats.gradeTrend}%
              </Badge>
            ) : stats.gradeTrend < 0 ? (
              <Badge variant="error" className="mt-1">
                {stats.gradeTrend}%
              </Badge>
            ) : null}
          </div>
        </Card>

        <Card className="bg-warning-50 border-warning-200">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-warning-600 mb-2" />
            <p className="text-2xl font-bold text-warning-700">
              {stats.atRiskStudents || 0}
            </p>
            <p className="text-sm text-warning-600">At-Risk Students</p>
            <p className="text-xs text-warning-500 mt-1">&lt;60% attendance</p>
          </div>
        </Card>
      </div>

      {/* Attendance Distribution */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Attendance Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Excellent (≥90%)</span>
              <span className="font-semibold text-success-600">
                {stats.attendanceDistribution?.excellent || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full"
                style={{
                  width: `${
                    ((stats.attendanceDistribution?.excellent || 0) /
                      (stats.totalStudents || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Good (75-89%)</span>
              <span className="font-semibold text-info-600">
                {stats.attendanceDistribution?.good || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-info-500 h-2 rounded-full"
                style={{
                  width: `${
                    ((stats.attendanceDistribution?.good || 0) /
                      (stats.totalStudents || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Poor (&lt;75%)</span>
              <span className="font-semibold text-error-600">
                {stats.attendanceDistribution?.poor || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-error-500 h-2 rounded-full"
                style={{
                  width: `${
                    ((stats.attendanceDistribution?.poor || 0) /
                      (stats.totalStudents || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Grade Distribution
          </h3>
          {stats.gradeDistribution ? (
            <div className="space-y-3">
              {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                <div key={grade}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Grade {grade}</span>
                    <span className="font-medium">{count} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${(count / (stats.totalStudents || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">
              No grade data available
            </p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Trends
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {stats.attendanceTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-success-500 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-error-500 mr-2" />
                )}
                <span className="text-sm text-gray-600">Attendance Trend</span>
              </div>
              <Badge variant={stats.attendanceTrend >= 0 ? "success" : "error"}>
                {stats.attendanceTrend >= 0 ? "+" : ""}
                {stats.attendanceTrend || 0}%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {stats.gradeTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-success-500 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-error-500 mr-2" />
                )}
                <span className="text-sm text-gray-600">Performance Trend</span>
              </div>
              <Badge variant={stats.gradeTrend >= 0 ? "success" : "error"}>
                {stats.gradeTrend >= 0 ? "+" : ""}
                {stats.gradeTrend || 0}%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-info-500 mr-2" />
                <span className="text-sm text-gray-600">Classes Conducted</span>
              </div>
              <span className="font-semibold">{stats.classesConduct || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performers & At-Risk Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="h-5 w-5 text-success-500 mr-2" />
            Top Performers
          </h3>
          {stats.topPerformers && stats.topPerformers.length > 0 ? (
            <div className="space-y-2">
              {stats.topPerformers.map((student, index) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-2 bg-success-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {student.rollNumber}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">
                    {student.grade || student.avgGrade}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">No data available</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-warning-500 mr-2" />
            Students Needing Attention
          </h3>
          {stats.atRiskStudentsList && stats.atRiskStudentsList.length > 0 ? (
            <div className="space-y-2">
              {stats.atRiskStudentsList.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-2 bg-warning-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-xs text-gray-600">
                      {student.rollNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="warning">{student.attendance}% att.</Badge>
                    {student.grade && (
                      <p className="text-xs text-gray-600 mt-1">
                        Grade: {student.grade}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">
              All students performing well
            </p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default ClassStatistics;
