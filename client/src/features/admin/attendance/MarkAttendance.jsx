import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Save,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classFromUrl = searchParams.get("class");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState(classFromUrl || "");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with actual API calls
  const [classes, setClasses] = useState([
    { _id: "1", name: "CS-A" },
    { _id: "2", name: "CS-B" },
    { _id: "3", name: "CS-C" },
  ]);

  const [courses, setCourses] = useState([
    { _id: "c1", name: "Data Structures", code: "CS101" },
    { _id: "c2", name: "Algorithms", code: "CS102" },
    { _id: "c3", name: "Database Systems", code: "CS201" },
  ]);

  const [students, setStudents] = useState([
    {
      _id: "1",
      name: "John Doe",
      studentID: "STU001",
      class: "CS-A",
      rollNumber: "001",
    },
    {
      _id: "2",
      name: "Jane Smith",
      studentID: "STU002",
      class: "CS-A",
      rollNumber: "002",
    },
    {
      _id: "3",
      name: "Mike Johnson",
      studentID: "STU003",
      class: "CS-A",
      rollNumber: "003",
    },
    {
      _id: "4",
      name: "Sarah Wilson",
      studentID: "STU004",
      class: "CS-A",
      rollNumber: "004",
    },
    {
      _id: "5",
      name: "Tom Brown",
      studentID: "STU005",
      class: "CS-A",
      rollNumber: "005",
    },
  ]);

  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    // Initialize attendance state
    const initialAttendance = {};
    students.forEach((student) => {
      initialAttendance[student._id] = "Present";
    });
    setAttendance(initialAttendance);
    setLoading(false);
  }, [students]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAll = (status) => {
    const newAttendance = {};
    filteredStudents.forEach((student) => {
      newAttendance[student._id] = status;
    });
    setAttendance((prev) => ({ ...prev, ...newAttendance }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }

    try {
      setSaving(true);

      // Prepare attendance data
      const attendanceRecords = Object.entries(attendance).map(
        ([studentId, status]) => ({
          student: studentId,
          course: selectedCourse,
          date: selectedDate,
          status: status,
        })
      );

      // In real implementation, send to API
      // await adminService.createAttendance({ records: attendanceRecords });

      console.log("Attendance data:", attendanceRecords);
      alert("Attendance marked successfully!");
      navigate(ROUTES.ADMIN_ROUTES.ATTENDANCE);
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClass ? student.class === selectedClass : true;
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  const stats = {
    total: filteredStudents.length,
    present: Object.values(attendance).filter((s) => s === "Present").length,
    absent: Object.values(attendance).filter((s) => s === "Absent").length,
    late: Object.values(attendance).filter((s) => s === "Late").length,
  };

  const getStatusButtonClass = (currentStatus, buttonStatus) => {
    const baseClass =
      "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors";
    if (currentStatus === buttonStatus) {
      if (buttonStatus === "Present") {
        return `${baseClass} bg-green-600 text-white`;
      } else if (buttonStatus === "Absent") {
        return `${baseClass} bg-red-600 text-white`;
      } else if (buttonStatus === "Late") {
        return `${baseClass} bg-yellow-600 text-white`;
      }
    }
    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.ATTENDANCE)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Overview
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mark Attendance
            </h1>
            <p className="text-gray-600 mt-1">
              Record student attendance for today
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.present}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.absent}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-xl font-bold text-gray-900">{stats.late}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Quick Actions:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => markAll("Present")}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium transition-colors"
              >
                <CheckCircle size={16} />
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => markAll("Absent")}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium transition-colors"
              >
                <XCircle size={16} />
                Mark All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by name, student ID, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <Users className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500 text-lg font-medium">
                        No students found
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {selectedClass
                          ? "Please select a class"
                          : "Try adjusting your search"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
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
                              {student.class}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 font-mono">
                          {student.studentID}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(student._id, "Present")
                            }
                            className={getStatusButtonClass(
                              attendance[student._id],
                              "Present"
                            )}
                          >
                            <CheckCircle size={16} />
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(student._id, "Absent")
                            }
                            className={getStatusButtonClass(
                              attendance[student._id],
                              "Absent"
                            )}
                          >
                            <XCircle size={16} />
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(student._id, "Late")
                            }
                            className={getStatusButtonClass(
                              attendance[student._id],
                              "Late"
                            )}
                          >
                            <Clock size={16} />
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.ATTENDANCE)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !selectedClass || !selectedCourse}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Attendance
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarkAttendance;
