import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const AttendanceOverview = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("all");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const [classes, setClasses] = useState([
    { _id: "1", name: "CS-A", totalStudents: 30 },
    { _id: "2", name: "CS-B", totalStudents: 28 },
    { _id: "3", name: "CS-C", totalStudents: 25 },
  ]);

  const [stats, setStats] = useState({
    totalStudents: 83,
    presentToday: 75,
    absentToday: 6,
    lateToday: 2,
    attendanceRate: 90.4,
  });

  const [attendanceData, setAttendanceData] = useState([
    {
      _id: "1",
      class: "CS-A",
      date: new Date(),
      present: 27,
      absent: 2,
      late: 1,
      total: 30,
    },
    {
      _id: "2",
      class: "CS-B",
      date: new Date(),
      present: 26,
      absent: 2,
      late: 0,
      total: 28,
    },
    {
      _id: "3",
      class: "CS-C",
      date: new Date(),
      present: 22,
      absent: 2,
      late: 1,
      total: 25,
    },
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const getAttendancePercentage = (present, total) => {
    return ((present / total) * 100).toFixed(1);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredData =
    selectedClass === "all"
      ? attendanceData
      : attendanceData.filter((item) => item.class === selectedClass);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage student attendance
          </p>
        </div>
        <button
          onClick={() => navigate(`${ROUTES.ADMIN_ROUTES.ATTENDANCE}/mark`)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Mark Attendance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.presentToday}
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
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.absentToday}
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
              <p className="text-sm font-medium text-gray-600">Late Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.lateToday}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.attendanceRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous Day"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <Calendar size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">
                {formatDate(selectedDate)}
              </span>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next Day"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          {/* Class Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => {
          const percentage = getAttendancePercentage(item.present, item.total);
          return (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                navigate(
                  `${ROUTES.ADMIN_ROUTES.ATTENDANCE}/report/${item.class}`
                )
              }
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {item.class}
                </h3>
                <span
                  className={`text-2xl font-bold ${getStatusColor(percentage)}`}
                >
                  {percentage}%
                </span>
              </div>

              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percentage >= 90
                        ? "bg-green-600"
                        : percentage >= 75
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <CheckCircle size={16} />
                      <span className="font-semibold">{item.present}</span>
                    </div>
                    <p className="text-xs text-gray-600">Present</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                      <XCircle size={16} />
                      <span className="font-semibold">{item.absent}</span>
                    </div>
                    <p className="text-xs text-gray-600">Absent</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                      <Clock size={16} />
                      <span className="font-semibold">{item.late}</span>
                    </div>
                    <p className="text-xs text-gray-600">Late</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Total Students:{" "}
                    <span className="font-medium">{item.total}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `${ROUTES.ADMIN_ROUTES.ATTENDANCE}/mark?class=${item.class}`
                  );
                }}
                className="mt-4 w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                Mark Attendance
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate(`${ROUTES.ADMIN_ROUTES.ATTENDANCE}/mark`)}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plus className="text-primary" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Mark Attendance</p>
              <p className="text-sm text-gray-600">Record today's attendance</p>
            </div>
          </button>

          <button
            onClick={() => navigate(`${ROUTES.ADMIN_ROUTES.ATTENDANCE}/report`)}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">View Reports</p>
              <p className="text-sm text-gray-600">Attendance analytics</p>
            </div>
          </button>

          <button
            onClick={() =>
              navigate(`${ROUTES.ADMIN_ROUTES.ATTENDANCE}/student`)
            }
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-600" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Student Records</p>
              <p className="text-sm text-gray-600">Individual attendance</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverview;
