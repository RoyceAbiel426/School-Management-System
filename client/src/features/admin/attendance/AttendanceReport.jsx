import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const AttendanceReport = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(classId || "");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [dateRange, setDateRange] = useState("week"); // week, month, semester, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Mock data
  const [classes, setClasses] = useState([
    { _id: "CS-A", name: "CS-A" },
    { _id: "CS-B", name: "CS-B" },
    { _id: "CS-C", name: "CS-C" },
  ]);

  const [courses, setCourses] = useState([
    { _id: "c1", name: "Data Structures", code: "CS101" },
    { _id: "c2", name: "Algorithms", code: "CS102" },
  ]);

  const [reportData, setReportData] = useState({
    className: "CS-A",
    totalStudents: 30,
    averageAttendance: 88.5,
    totalDays: 20,
    students: [
      {
        _id: "1",
        name: "John Doe",
        studentID: "STU001",
        rollNumber: "001",
        present: 18,
        absent: 1,
        late: 1,
        percentage: 90,
      },
      {
        _id: "2",
        name: "Jane Smith",
        studentID: "STU002",
        rollNumber: "002",
        present: 19,
        absent: 1,
        late: 0,
        percentage: 95,
      },
      {
        _id: "3",
        name: "Mike Johnson",
        studentID: "STU003",
        rollNumber: "003",
        present: 17,
        absent: 2,
        late: 1,
        percentage: 85,
      },
      {
        _id: "4",
        name: "Sarah Wilson",
        studentID: "STU004",
        rollNumber: "004",
        present: 16,
        absent: 3,
        late: 1,
        percentage: 80,
      },
      {
        _id: "5",
        name: "Tom Brown",
        studentID: "STU005",
        rollNumber: "005",
        present: 15,
        absent: 4,
        late: 1,
        percentage: 75,
      },
    ],
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const downloadReport = () => {
    // Implement CSV download
    alert("Downloading attendance report...");
  };

  const stats = {
    totalStudents: reportData.totalStudents,
    averageAttendance: reportData.averageAttendance,
    above90: reportData.students.filter((s) => s.percentage >= 90).length,
    below75: reportData.students.filter((s) => s.percentage < 75).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance report...</p>
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
            Back to Overview
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Report
          </h1>
          <p className="text-gray-600 mt-1">
            Detailed attendance analytics and statistics
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Class Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="semester">This Semester</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {dateRange === "custom" && (
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="End Date"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalStudents}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Average Attendance
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.averageAttendance}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Above 90%</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.above90}
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
              <p className="text-sm font-medium text-gray-600">Below 75%</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.below75}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Student Attendance Summary
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Class: {reportData.className} • Total Days: {reportData.totalDays}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {student.rollNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.studentID}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <CheckCircle size={16} />
                      <span className="font-semibold">{student.present}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-red-600">
                      <XCircle size={16} />
                      <span className="font-semibold">{student.absent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-600">
                      <Clock size={16} />
                      <span className="font-semibold">{student.late}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        student.percentage
                      )}`}
                    >
                      {student.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          `${ROUTES.ADMIN_ROUTES.ATTENDANCE}/student/${student._id}`
                        )
                      }
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Attendance Distribution
        </h2>
        <div className="space-y-4">
          {/* 90-100% */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Excellent (90-100%)
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {
                  reportData.students.filter(
                    (s) => s.percentage >= 90 && s.percentage <= 100
                  ).length
                }{" "}
                students
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${
                    (reportData.students.filter(
                      (s) => s.percentage >= 90 && s.percentage <= 100
                    ).length /
                      reportData.totalStudents) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* 75-89% */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Good (75-89%)
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {
                  reportData.students.filter(
                    (s) => s.percentage >= 75 && s.percentage < 90
                  ).length
                }{" "}
                students
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{
                  width: `${
                    (reportData.students.filter(
                      (s) => s.percentage >= 75 && s.percentage < 90
                    ).length /
                      reportData.totalStudents) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Below 75% */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Needs Attention (Below 75%)
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {reportData.students.filter((s) => s.percentage < 75).length}{" "}
                students
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${
                    (reportData.students.filter((s) => s.percentage < 75)
                      .length /
                      reportData.totalStudents) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
