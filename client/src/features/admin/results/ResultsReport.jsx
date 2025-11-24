import {
  Award,
  BarChart3,
  BookOpen,
  ChevronLeft,
  Download,
  Filter,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultsReport = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    class: "CS-A",
    course: "",
    exam: "",
    dateRange: "semester",
  });

  // Mock data
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

  const mockReport = {
    totalStudents: 30,
    averagePercentage: 76.5,
    passRate: 86.7,
    failRate: 13.3,
    topPerformers: [
      {
        id: 1,
        name: "Jane Smith",
        studentId: "STU002",
        percentage: 92,
        grade: "A+",
        rank: 1,
      },
      {
        id: 2,
        name: "John Doe",
        studentId: "STU001",
        percentage: 85,
        grade: "A",
        rank: 2,
      },
      {
        id: 3,
        name: "Alice Brown",
        studentId: "STU004",
        percentage: 83,
        grade: "A-",
        rank: 3,
      },
    ],
    gradeDistribution: [
      { grade: "A+", count: 5, percentage: 16.7 },
      { grade: "A", count: 8, percentage: 26.7 },
      { grade: "A-", count: 4, percentage: 13.3 },
      { grade: "B+", count: 6, percentage: 20.0 },
      { grade: "B", count: 3, percentage: 10.0 },
      { grade: "C", count: 2, percentage: 6.7 },
      { grade: "D", count: 1, percentage: 3.3 },
      { grade: "F", count: 1, percentage: 3.3 },
    ],
    performanceRanges: [
      { range: "90-100%", label: "Excellent", count: 7, percentage: 23.3 },
      { range: "75-89%", label: "Good", count: 13, percentage: 43.3 },
      { range: "60-74%", label: "Average", count: 6, percentage: 20.0 },
      { range: "50-59%", label: "Below Average", count: 3, percentage: 10.0 },
      { range: "0-49%", label: "Needs Improvement", count: 1, percentage: 3.3 },
    ],
    subjectPerformance: [
      { subject: "Mathematics", average: 78.5, pass: 90, fail: 10 },
      { subject: "Physics", average: 72.3, pass: 83, fail: 17 },
      { subject: "Chemistry", average: 81.2, pass: 93, fail: 7 },
    ],
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
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

  const getRangeColor = (label) => {
    const colors = {
      Excellent: "bg-green-500",
      Good: "bg-blue-500",
      Average: "bg-yellow-500",
      "Below Average": "bg-orange-500",
      "Needs Improvement": "bg-red-500",
    };
    return colors[label] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/results")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Results
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-primary-600" />
                Results Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                Comprehensive performance analysis and reports
              </p>
            </div>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockReport.totalStudents}
                </p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
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
                  {mockReport.averagePercentage}%
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
                  {mockReport.passRate}%
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
                <p className="text-sm font-medium text-gray-600">Fail Rate</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {mockReport.failRate}%
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Grade Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
              Grade Distribution
            </h3>
            <div className="space-y-3">
              {mockReport.gradeDistribution.map((item) => (
                <div key={item.grade}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getGradeColor(
                          item.grade
                        )}`}
                      >
                        {item.grade}
                      </span>
                      <span className="ml-3 text-sm text-gray-600">
                        {item.count} students
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.grade.includes("A")
                          ? "bg-green-500"
                          : item.grade.includes("B")
                          ? "bg-blue-500"
                          : item.grade === "C"
                          ? "bg-yellow-500"
                          : item.grade === "D"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Ranges */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-primary-600" />
              Performance Distribution
            </h3>
            <div className="space-y-3">
              {mockReport.performanceRanges.map((item) => (
                <div key={item.range}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.label}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({item.range})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {item.count} students
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getRangeColor(
                        item.label
                      )}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Top Performers
            </h3>
            <div className="space-y-4">
              {mockReport.topPerformers.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        student.rank === 1
                          ? "bg-yellow-500"
                          : student.rank === 2
                          ? "bg-gray-400"
                          : "bg-orange-400"
                      }`}
                    >
                      {student.rank}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {student.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {student.percentage}%
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGradeColor(
                        student.grade
                      )}`}
                    >
                      {student.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject-wise Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
              Subject-wise Performance
            </h3>
            <div className="space-y-4">
              {mockReport.subjectPerformance.map((subject, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {subject.subject}
                    </h4>
                    <span className="text-lg font-bold text-primary-600">
                      {subject.average}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-green-700 font-medium flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Pass
                      </span>
                      <span className="text-green-900 font-semibold">
                        {subject.pass}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-red-700 font-medium flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        Fail
                      </span>
                      <span className="text-red-900 font-semibold">
                        {subject.fail}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Class Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Class Summary - {filters.class || "All Classes"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-2">
                Overall Performance
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {mockReport.averagePercentage}%
              </p>
              <p className="text-xs text-blue-600 mt-1">Average Score</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium mb-2">
                Passed Students
              </p>
              <p className="text-3xl font-bold text-green-900">
                {Math.round(
                  (mockReport.totalStudents * mockReport.passRate) / 100
                )}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {mockReport.passRate}% Pass Rate
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 font-medium mb-2">
                Failed Students
              </p>
              <p className="text-3xl font-bold text-red-900">
                {Math.round(
                  (mockReport.totalStudents * mockReport.failRate) / 100
                )}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {mockReport.failRate}% Fail Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsReport;
