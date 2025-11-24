import {
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  Download,
  FileText,
  Mail,
  Phone,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const StudentResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState("all");

  // Mock student data
  const mockStudent = {
    id: 1,
    name: "John Doe",
    studentId: "STU001",
    class: "CS-A",
    rollNumber: "001",
    email: "john.doe@school.com",
    phone: "+1 234 567 8900",
    overallPercentage: 82.5,
    overallGrade: "A-",
    rank: 5,
    totalStudents: 30,
  };

  // Mock results data
  const mockResults = [
    {
      id: 1,
      exam: {
        title: "Midterm Exam",
        examId: "EX001",
        date: "2024-11-15",
        type: "midterm",
      },
      course: { name: "Mathematics", code: "MATH101" },
      marksObtained: 85,
      totalMarks: 100,
      percentage: 85,
      grade: "A",
      semester: "Fall 2024",
      remarks: "Excellent performance",
    },
    {
      id: 2,
      exam: {
        title: "Final Exam",
        examId: "EX002",
        date: "2024-11-20",
        type: "final",
      },
      course: { name: "Physics", code: "PHY101" },
      marksObtained: 78,
      totalMarks: 100,
      percentage: 78,
      grade: "B+",
      semester: "Fall 2024",
      remarks: "Good effort",
    },
    {
      id: 3,
      exam: {
        title: "Quiz 1",
        examId: "EX003",
        date: "2024-11-10",
        type: "quiz",
      },
      course: { name: "Chemistry", code: "CHEM101" },
      marksObtained: 92,
      totalMarks: 100,
      percentage: 92,
      grade: "A+",
      semester: "Fall 2024",
      remarks: "Outstanding work",
    },
    {
      id: 4,
      exam: {
        title: "Midterm Exam",
        examId: "EX004",
        date: "2024-10-15",
        type: "midterm",
      },
      course: { name: "English", code: "ENG101" },
      marksObtained: 75,
      totalMarks: 100,
      percentage: 75,
      grade: "B+",
      semester: "Fall 2024",
      remarks: "Good progress",
    },
    {
      id: 5,
      exam: {
        title: "Assignment 1",
        examId: "EX005",
        date: "2024-10-25",
        type: "assignment",
      },
      course: { name: "Computer Science", code: "CS101" },
      marksObtained: 88,
      totalMarks: 100,
      percentage: 88,
      grade: "A",
      semester: "Fall 2024",
      remarks: "Very good",
    },
    {
      id: 6,
      exam: {
        title: "Practical Exam",
        examId: "EX006",
        date: "2024-11-05",
        type: "practical",
      },
      course: { name: "Chemistry", code: "CHEM101" },
      marksObtained: 82,
      totalMarks: 100,
      percentage: 82,
      grade: "A-",
      semester: "Fall 2024",
      remarks: "Well executed",
    },
  ];

  // Calculate statistics
  const totalExams = mockResults.length;
  const averagePercentage =
    mockResults.reduce((sum, r) => sum + r.percentage, 0) / totalExams;
  const passCount = mockResults.filter((r) => r.percentage >= 40).length;
  const failCount = mockResults.filter((r) => r.percentage < 40).length;

  // Filter results by semester
  const filteredResults =
    selectedSemester === "all"
      ? mockResults
      : mockResults.filter((r) => r.semester === selectedSemester);

  // Calculate subject-wise performance
  const subjectPerformance = mockResults.reduce((acc, result) => {
    const subject = result.course.name;
    if (!acc[subject]) {
      acc[subject] = { total: 0, count: 0, results: [] };
    }
    acc[subject].total += result.percentage;
    acc[subject].count += 1;
    acc[subject].results.push(result);
    return acc;
  }, {});

  const subjectStats = Object.entries(subjectPerformance).map(
    ([subject, data]) => ({
      subject,
      average: (data.total / data.count).toFixed(1),
      exams: data.count,
      highest: Math.max(...data.results.map((r) => r.percentage)),
      lowest: Math.min(...data.results.map((r) => r.percentage)),
    })
  );

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

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getExamTypeColor = (type) => {
    const colors = {
      midterm: "bg-purple-100 text-purple-800",
      final: "bg-red-100 text-red-800",
      quiz: "bg-blue-100 text-blue-800",
      assignment: "bg-green-100 text-green-800",
      practical: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <User className="w-8 h-8 mr-3 text-primary-600" />
              Student Results
            </h1>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
                {mockStudent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold">{mockStudent.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-primary-100">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {mockStudent.studentId}
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {mockStudent.class}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Roll: {mockStudent.rollNumber}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-primary-100">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {mockStudent.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {mockStudent.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm text-primary-100">Overall Performance</p>
                <p className="text-4xl font-bold mt-1">
                  {mockStudent.overallPercentage}%
                </p>
                <span
                  className={`inline-block px-3 py-1 mt-2 rounded-full text-sm font-medium ${getGradeColor(
                    mockStudent.overallGrade
                  )}`}
                >
                  Grade {mockStudent.overallGrade}
                </span>
                <p className="text-xs text-primary-100 mt-2">
                  Rank {mockStudent.rank} of {mockStudent.totalStudents}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalExams}
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
                  {averagePercentage.toFixed(1)}%
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
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {passCount}
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
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
            Subject-wise Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectStats.map((subject, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
              >
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {subject.subject}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average:</span>
                    <span
                      className={`font-bold ${getPerformanceColor(
                        parseFloat(subject.average)
                      )}`}
                    >
                      {subject.average}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exams Taken:</span>
                    <span className="font-medium text-gray-900">
                      {subject.exams}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highest:</span>
                    <span className="font-medium text-green-600">
                      {subject.highest}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lowest:</span>
                    <span className="font-medium text-orange-600">
                      {subject.lowest}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semester Filter */}
        <div className="mb-4">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Semesters</option>
            <option value="Fall 2024">Fall 2024</option>
            <option value="Spring 2024">Spring 2024</option>
          </select>
        </div>

        {/* Exam Results Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Exam Results History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(result.exam.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {result.exam.title}
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${getExamTypeColor(
                            result.exam.type
                          )}`}
                        >
                          {result.exam.type}
                        </span>
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
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              result.percentage >= 90
                                ? "bg-green-600"
                                : result.percentage >= 75
                                ? "bg-blue-600"
                                : result.percentage >= 60
                                ? "bg-yellow-600"
                                : result.percentage >= 50
                                ? "bg-orange-600"
                                : "bg-red-600"
                            }`}
                            style={{ width: `${result.percentage}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm font-medium ${getPerformanceColor(
                            result.percentage
                          )}`}
                        >
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
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {result.remarks || "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResult;
