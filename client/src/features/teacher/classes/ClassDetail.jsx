import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  ArrowLeft,
  UserCheck,
} from "lucide-react";

/**
 * Class Detail Page
 * View detailed information about a specific class
 */
function ClassDetail() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teacherService.getClassDetail(classId);
      const data = response.data || {};

      setClassData(data);
      setStudents(data.students || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load class details";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = () => {
    navigate(`${ROUTES.TEACHER_ATTENDANCE}/mark/${classId}`);
  };

  const handleViewStudentProgress = (studentId) => {
    navigate(`${ROUTES.TEACHER_PROGRESS}/student/${studentId}`);
  };

  const studentColumns = [
    {
      header: "Roll No.",
      accessor: "rollNumber",
      cell: (value) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Name",
      accessor: "name",
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-600">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Attendance",
      accessor: "attendance",
      cell: (value) => {
        const percentage = value || 0;
        const variant =
          percentage >= 75 ? "success" : percentage >= 60 ? "warning" : "error";
        return <Badge variant={variant}>{percentage}%</Badge>;
      },
    },
    {
      header: "Avg Grade",
      accessor: "avgGrade",
      cell: (value) => <span className="font-medium">{value || "N/A"}</span>,
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (value) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewStudentProgress(value)}
        >
          View Progress
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Class Details">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  if (!classData) {
    return (
      <DashboardLayout title="Class Details">
        <Alert type="error" message="Class not found" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={classData.className || "Class Details"}
      subtitle={`${classData.subject || "Subject"} - ${
        classData.grade || "Grade"
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
        <Button
          onClick={handleMarkAttendance}
          icon={<UserCheck className="h-4 w-4" />}
        >
          Mark Attendance
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {classData.studentCount || students.length || 0}
            </p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {classData.avgAttendance || 0}%
            </p>
            <p className="text-sm text-gray-600">Avg Attendance</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto text-info-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {classData.avgGrade || "N/A"}
            </p>
            <p className="text-sm text-gray-600">Avg Grade</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto text-warning-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {classData.totalClasses || 0}
            </p>
            <p className="text-sm text-gray-600">Total Classes</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "students", label: "Students" },
              { id: "schedule", label: "Schedule" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Class Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-medium text-gray-800">
                  {classData.subject || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade</p>
                <p className="font-medium text-gray-800">
                  {classData.grade || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Room</p>
                <p className="font-medium text-gray-800">
                  {classData.room || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Schedule</p>
                <p className="font-medium text-gray-800">
                  {classData.schedule || "N/A"}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Performance Summary
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Average Attendance</span>
                  <span className="font-medium">
                    {classData.avgAttendance || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-success-500 h-2 rounded-full"
                    style={{ width: `${classData.avgAttendance || 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Students Above 75%</span>
                  <span className="font-medium">
                    {classData.studentsAbove75 || 0}/
                    {classData.studentCount || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-info-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((classData.studentsAbove75 || 0) /
                          (classData.studentCount || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "students" && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Student List
          </h3>
          {students.length > 0 ? (
            <Table columns={studentColumns} data={students} />
          ) : (
            <div className="text-center py-8 text-gray-600">
              No students enrolled in this class
            </div>
          )}
        </Card>
      )}

      {activeTab === "schedule" && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Class Schedule
          </h3>
          {classData.scheduleDetails ? (
            <div className="space-y-3">
              {classData.scheduleDetails.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {schedule.day}
                      </p>
                      <p className="text-sm text-gray-600">{schedule.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Room {schedule.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No schedule information available</p>
            </div>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}

export default ClassDetail;
