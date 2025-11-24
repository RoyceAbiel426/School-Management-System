import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const StudentAttendance = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Mock student data
  const [student, setStudent] = useState({
    _id: "1",
    name: "John Doe",
    studentID: "STU001",
    class: "CS-A",
    rollNumber: "001",
    email: "john.doe@example.com",
    phone: "+1234567890",
  });

  const [attendanceData, setAttendanceData] = useState({
    totalDays: 20,
    present: 18,
    absent: 1,
    late: 1,
    percentage: 90,
    records: [
      {
        date: "2024-01-15",
        course: "Data Structures",
        status: "Present",
      },
      {
        date: "2024-01-14",
        course: "Algorithms",
        status: "Present",
      },
      {
        date: "2024-01-13",
        course: "Database Systems",
        status: "Late",
      },
      {
        date: "2024-01-12",
        course: "Data Structures",
        status: "Present",
      },
      {
        date: "2024-01-11",
        course: "Algorithms",
        status: "Absent",
      },
      {
        date: "2024-01-10",
        course: "Database Systems",
        status: "Present",
      },
    ],
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      Present: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={16} />,
      },
      Absent: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle size={16} />,
      },
      Late: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={16} />,
      },
    };

    const config = statusConfig[status] || statusConfig.Present;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}
      >
        {config.icon}
        {status}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const downloadReport = () => {
    alert("Downloading student attendance report...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.ATTENDANCE)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Attendance
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Attendance
          </h1>
          <p className="text-gray-600 mt-1">
            Individual attendance record and analytics
          </p>
        </div>
        <button
          onClick={downloadReport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download size={20} />
          Download Report
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-medium text-gray-900 font-mono">
                  {student.studentID}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-medium text-gray-900">{student.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="font-medium text-gray-900">
                  {student.rollNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="font-medium text-gray-900">
                  {attendanceData.percentage}%
                </p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span className="text-sm">{student.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {attendanceData.totalDays}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {attendanceData.present}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {attendanceData.absent}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {attendanceData.late}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Percentage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Overall Attendance
          </h3>
          <span
            className={`text-2xl font-bold ${
              attendanceData.percentage >= 90
                ? "text-green-600"
                : attendanceData.percentage >= 75
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {attendanceData.percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              attendanceData.percentage >= 90
                ? "bg-green-600"
                : attendanceData.percentage >= 75
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
            style={{ width: `${attendanceData.percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Month Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Select Month:
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance Records
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Detailed day-by-day attendance history
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.records.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <Calendar
                      className="mx-auto text-gray-400 mb-4"
                      size={48}
                    />
                    <p className="text-gray-500 text-lg font-medium">
                      No attendance records
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      No records found for the selected month
                    </p>
                  </td>
                </tr>
              ) : (
                attendanceData.records.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatDate(record.date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {record.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(record.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="text-green-600" size={24} />
            <h4 className="font-semibold text-green-900">Present Days</h4>
          </div>
          <p className="text-3xl font-bold text-green-900">
            {attendanceData.present}
          </p>
          <p className="text-sm text-green-700 mt-1">
            {(
              (attendanceData.present / attendanceData.totalDays) *
              100
            ).toFixed(1)}
            % of total days
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="text-red-600" size={24} />
            <h4 className="font-semibold text-red-900">Absent Days</h4>
          </div>
          <p className="text-3xl font-bold text-red-900">
            {attendanceData.absent}
          </p>
          <p className="text-sm text-red-700 mt-1">
            {((attendanceData.absent / attendanceData.totalDays) * 100).toFixed(
              1
            )}
            % of total days
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="text-yellow-600" size={24} />
            <h4 className="font-semibold text-yellow-900">Late Days</h4>
          </div>
          <p className="text-3xl font-bold text-yellow-900">
            {attendanceData.late}
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            {((attendanceData.late / attendanceData.totalDays) * 100).toFixed(
              1
            )}
            % of total days
          </p>
        </div>
      </div>

      {/* Alert for Low Attendance */}
      {attendanceData.percentage < 75 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" size={24} />
            <div>
              <h3 className="font-semibold text-red-900">
                Low Attendance Alert
              </h3>
              <p className="text-sm text-red-800 mt-1">
                This student's attendance is below 75%. Please follow up with
                the student and their guardian to improve attendance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
