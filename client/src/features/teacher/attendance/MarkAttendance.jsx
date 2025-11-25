import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Badge,
  Loader,
  Alert,
  Input,
} from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import {
  UserCheck,
  UserX,
  Calendar,
  Save,
  ArrowLeft,
  Search,
} from "lucide-react";

/**
 * Mark Attendance Page
 * Mark attendance for students in a class
 */
function MarkAttendance() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchClassAndStudents();
  }, [classId, selectedDate]);

  const fetchClassAndStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teacherService.getClassForAttendance(
        classId,
        selectedDate
      );
      const data = response.data || {};

      setClassData(data.class || {});
      setStudents(data.students || []);

      // Initialize attendance state
      const existingAttendance = data.attendance || {};
      const initialAttendance = {};
      data.students?.forEach((student) => {
        initialAttendance[student._id] =
          existingAttendance[student._id] || "present";
      });
      setAttendance(initialAttendance);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load class data";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach((student) => {
      newAttendance[student._id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const attendanceData = {
        classId,
        date: selectedDate,
        attendance: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      };

      await teacherService.markAttendance(attendanceData);

      showSuccess("Attendance marked successfully");
      setTimeout(() => {
        navigate(ROUTES.TEACHER_CLASSES);
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to mark attendance";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = Object.values(attendance).filter(
    (status) => status === "present"
  ).length;
  const absentCount = Object.values(attendance).filter(
    (status) => status === "absent"
  ).length;
  const lateCount = Object.values(attendance).filter(
    (status) => status === "late"
  ).length;

  if (loading) {
    return (
      <DashboardLayout title="Mark Attendance">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Mark Attendance"
      subtitle={`${classData?.className || "Class"} - ${
        classData?.subject || "Subject"
      }`}
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

        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            icon={<Save className="h-4 w-4" />}
          >
            {submitting ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {students.length}
            </p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
        </Card>

        <Card className="bg-success-50 border-success-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-success-700">
              {presentCount}
            </p>
            <p className="text-sm text-success-600">Present</p>
          </div>
        </Card>

        <Card className="bg-error-50 border-error-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-error-700">{absentCount}</p>
            <p className="text-sm text-error-600">Absent</p>
          </div>
        </Card>

        <Card className="bg-warning-50 border-warning-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-700">{lateCount}</p>
            <p className="text-sm text-warning-600">Late</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll("present")}
            >
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll("absent")}
            >
              Mark All Absent
            </Button>
          </div>

          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-5 w-5" />}
            className="w-64"
          />
        </div>
      </Card>

      {/* Student List */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Student Attendance
        </h3>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            {searchTerm ? "No students found" : "No students in this class"}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {/* Student Info */}
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold mr-3">
                    {student.rollNumber || "?"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>

                {/* Attendance Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleAttendanceChange(student._id, "present")
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      attendance[student._id] === "present"
                        ? "bg-success-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <UserCheck className="h-4 w-4 inline mr-1" />
                    Present
                  </button>

                  <button
                    onClick={() =>
                      handleAttendanceChange(student._id, "absent")
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      attendance[student._id] === "absent"
                        ? "bg-error-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <UserX className="h-4 w-4 inline mr-1" />
                    Absent
                  </button>

                  <button
                    onClick={() => handleAttendanceChange(student._id, "late")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      attendance[student._id] === "late"
                        ? "bg-warning-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Late
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Info Footer */}
      {students.length > 0 && (
        <Card className="mt-6 bg-info-50 border-info-200">
          <div className="text-sm text-info-800">
            <p className="font-medium mb-1">Attendance Summary:</p>
            <p className="text-info-700">
              {presentCount} present (
              {((presentCount / students.length) * 100).toFixed(1)}%) •{" "}
              {absentCount} absent (
              {((absentCount / students.length) * 100).toFixed(1)}%) •{" "}
              {lateCount} late (
              {((lateCount / students.length) * 100).toFixed(1)}%)
            </p>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}

export default MarkAttendance;
