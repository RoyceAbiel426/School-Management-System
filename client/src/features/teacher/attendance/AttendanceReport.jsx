import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Badge, Loader, Alert } from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { Calendar, Download, TrendingUp, Users } from "lucide-react";

/**
 * Attendance Report Page
 * View attendance reports and analytics for all classes
 */
function AttendanceReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedClass, setSelectedClass] = useState("all");

  const { error: showError } = useNotification();

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod, selectedClass]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teacherService.getAttendanceReports(
        selectedPeriod,
        selectedClass
      );
      setReports(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load reports";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await teacherService.exportAttendanceReport(
        selectedPeriod,
        selectedClass
      );
    } catch (err) {
      showError("Failed to export report");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Attendance Reports">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Attendance Reports"
      subtitle="View and analyze attendance data"
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
        <div className="flex gap-3">
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

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Classes</option>
            {reports.map((report) => (
              <option key={report.classId} value={report.classId}>
                {report.className}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={handleExport} icon={<Download className="h-4 w-4" />}>
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {reports.reduce((sum, r) => sum + (r.totalStudents || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {reports.length > 0
                ? (
                    reports.reduce(
                      (sum, r) => sum + (r.avgAttendance || 0),
                      0
                    ) / reports.length
                  ).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-gray-600">Avg Attendance</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto text-info-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {reports.reduce((sum, r) => sum + (r.classesConducted || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Classes Conducted</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-warning-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {reports.reduce((sum, r) => sum + (r.atRiskStudents || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">At-Risk Students</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.classId}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {report.className}
                </h3>
                <p className="text-sm text-gray-600">{report.subject}</p>
              </div>
              <Badge
                variant={report.avgAttendance >= 75 ? "success" : "warning"}
              >
                {report.avgAttendance}% avg
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-xl font-bold text-success-600">
                  {report.presentCount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-xl font-bold text-error-600">
                  {report.absentCount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-xl font-bold text-warning-600">
                  {report.lateCount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-xl font-bold text-info-600">
                  {report.classesConducted || 0}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default AttendanceReport;
