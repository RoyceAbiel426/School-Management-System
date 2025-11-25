import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Badge, Loader, Alert } from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { Calendar, ArrowLeft, TrendingUp, AlertCircle } from "lucide-react";

/**
 * Student Attendance History Page
 * View attendance history for a specific student
 */
function StudentAttendanceHistory() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchAttendanceHistory();
  }, [studentId, selectedPeriod]);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teacherService.getStudentAttendanceHistory(
        studentId,
        selectedPeriod
      );
      const data = response.data || {};

      setStudent(data.student || {});
      setHistory(data.history || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load attendance history";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Attendance History">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  const totalDays = history.length;
  const presentDays = history.filter((h) => h.status === "present").length;
  const absentDays = history.filter((h) => h.status === "absent").length;
  const lateDays = history.filter((h) => h.status === "late").length;
  const attendancePercentage =
    totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout
      title="Attendance History"
      subtitle={student?.name || "Student"}
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
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card
          className={
            attendancePercentage < 75
              ? "border-warning-200"
              : "border-success-200"
          }
        >
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {attendancePercentage}%
            </p>
            <p className="text-sm text-gray-600">Attendance Rate</p>
            {attendancePercentage < 75 && (
              <Badge variant="warning" className="mt-2">
                Below 75%
              </Badge>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-600">{presentDays}</p>
            <p className="text-sm text-gray-600">Present Days</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-error-600">{absentDays}</p>
            <p className="text-sm text-gray-600">Absent Days</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-600">{lateDays}</p>
            <p className="text-sm text-gray-600">Late Days</p>
          </div>
        </Card>
      </div>

      {attendancePercentage < 75 && (
        <Alert
          type="warning"
          message="This student's attendance is below 75%. Consider contacting parents or guardians."
          className="mb-6"
          icon={<AlertCircle className="h-5 w-5" />}
        />
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Attendance Records
        </h3>
        {history.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            No attendance records found
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((record, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{record.className}</p>
                  </div>
                </div>

                <Badge
                  variant={
                    record.status === "present"
                      ? "success"
                      : record.status === "late"
                      ? "warning"
                      : "error"
                  }
                >
                  {record.status.charAt(0).toUpperCase() +
                    record.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default StudentAttendanceHistory;
