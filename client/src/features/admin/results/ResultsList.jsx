import {
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    class: "",
    course: "",
    exam: "",
    grade: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - will be replaced with API calls
  const mockResults = [
    {
      id: 1,
      student: { name: "John Doe", studentId: "STU001", class: "CS-A" },
      exam: { title: "Midterm Exam", examId: "EX001", date: "2024-11-15" },
      course: { name: "Mathematics", code: "MATH101" },
      marksObtained: 85,
      totalMarks: 100,
      percentage: 85,
      grade: "A",
      status: "pass",
    },
    {
      id: 2,
      student: { name: "Jane Smith", studentId: "STU002", class: "CS-A" },
      exam: { title: "Midterm Exam", examId: "EX001", date: "2024-11-15" },
      course: { name: "Mathematics", code: "MATH101" },
      marksObtained: 92,
      totalMarks: 100,
      percentage: 92,
      grade: "A+",
      status: "pass",
    },
    {
      id: 3,
      student: { name: "Bob Wilson", studentId: "STU003", class: "CS-B" },
      exam: { title: "Final Exam", examId: "EX002", date: "2024-11-20" },
      course: { name: "Physics", code: "PHY101" },
      marksObtained: 45,
      totalMarks: 100,
      percentage: 45,
      grade: "F",
      status: "fail",
    },
    {
      id: 4,
      student: { name: "Alice Brown", studentId: "STU004", class: "CS-A" },
      exam: { title: "Quiz 1", examId: "EX003", date: "2024-11-10" },
      course: { name: "Chemistry", code: "CHEM101" },
      marksObtained: 78,
      totalMarks: 100,
      percentage: 78,
      grade: "B+",
      status: "pass",
    },
    {
      id: 5,
      student: { name: "Charlie Davis", studentId: "STU005", class: "CS-C" },
      exam: { title: "Midterm Exam", examId: "EX001", date: "2024-11-15" },
      course: { name: "Mathematics", code: "MATH101" },
      marksObtained: 55,
      totalMarks: 100,
      percentage: 55,
      grade: "D",
      status: "pass",
    },
  ];

  const mockClasses = ["CS-A", "CS-B", "CS-C"];
  const mockCourses = [
    { id: 1, name: "Mathematics", code: "MATH101" },
    { id: 2, name: "Physics", code: "PHY101" },
    { id: 3, name: "Chemistry", code: "CHEM101" },
  ];
  const mockExams = [
    { id: 1, title: "Midterm Exam", examId: "EX001" },
    { id: 2, title: "Final Exam", examId: "EX002" },
    { id: 3, title: "Quiz 1", examId: "EX003" },
  ];

  // Calculate statistics
  const totalResults = mockResults.length;
  const averagePercentage = (
    mockResults.reduce((sum, r) => sum + r.percentage, 0) / totalResults
  ).toFixed(1);
  const passCount = mockResults.filter((r) => r.status === "pass").length;
  const failCount = mockResults.filter((r) => r.status === "fail").length;
  const passRate = ((passCount / totalResults) * 100).toFixed(1);

  // Filter results
  const filteredResults = mockResults.filter((result) => {
    const matchesSearch =
      result.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.studentId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      result.exam.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      !filters.class || result.student.class === filters.class;
    const matchesCourse =
      !filters.course || result.course.code === filters.course;
    const matchesExam = !filters.exam || result.exam.examId === filters.exam;
    const matchesGrade = !filters.grade || result.grade === filters.grade;

    return (
      matchesSearch &&
      matchesClass &&
      matchesCourse &&
      matchesExam &&
      matchesGrade
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const getGradeColor = (grade) => {
    const colors = {
      "A+": "bg-green-100 text-green-800",
      A: "bg-green-100 text-green-700",
      "A-": "bg-green-50 text-green-600",
      "B+": "bg-blue-100 text-blue-800",
      B: "bg-blue-50 text-blue-700",
      C: "bg-yellow-100 text-yellow-800",
      D: "bg-orange-100 text-orange-800",
      F: "bg-red-100 text-red-800",
    };
    return colors[grade] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    return status === "pass" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <TrendingUp className="w-3 h-3 mr-1" />
        Pass
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <TrendingDown className="w-3 h-3 mr-1" />
        Fail
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Award className="w-8 h-8 mr-3 text-primary-600" />
            Results Management
          </h1>
          <p className="mt-2 text-gray-600">
            View and manage examination results
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Results
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalResults}
                </p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {averagePercentage}%
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {passRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {passCount} of {totalResults} students
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {failCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((failCount / totalResults) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search student, exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Class Filter */}
            <select
              value={filters.class}
              onChange={(e) => handleFilterChange("class", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {mockClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            {/* Course Filter */}
            <select
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {mockCourses.map((course) => (
                <option key={course.id} value={course.code}>
                  {course.name}
                </option>
              ))}
            </select>

            {/* Exam Filter */}
            <select
              value={filters.exam}
              onChange={(e) => handleFilterChange("exam", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Exams</option>
              {mockExams.map((exam) => (
                <option key={exam.id} value={exam.examId}>
                  {exam.title}
                </option>
              ))}
            </select>

            {/* Grade Filter */}
            <select
              value={filters.grade}
              onChange={(e) => handleFilterChange("grade", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Grades</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/results/enter")}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Enter Results
          </button>
          <button
            onClick={() => navigate("/admin/results/report")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Reports
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </button>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedResults.length > 0 ? (
                  paginatedResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {result.student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.student.studentId} • {result.student.class}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {result.exam.title}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(result.exam.date).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.course.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.course.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.marksObtained}/{result.totalMarks}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                result.percentage >= 75
                                  ? "bg-green-600"
                                  : result.percentage >= 50
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                              }`}
                              style={{ width: `${result.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {result.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getGradeColor(
                            result.grade
                          )}`}
                        >
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(result.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/results/student/${result.student.studentId}`
                            )
                          }
                          className="text-primary-600 hover:text-primary-900 mr-3"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No results found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredResults.length)} of{" "}
                {filteredResults.length} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsList;
