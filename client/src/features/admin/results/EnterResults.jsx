import {
  AlertCircle,
  Award,
  ChevronLeft,
  FileText,
  Plus,
  Save,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnterResults = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Select Exam, 2: Enter Results
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});

  // Mock data
  const mockClasses = ["CS-A", "CS-B", "CS-C"];
  const mockCourses = [
    { id: 1, name: "Mathematics", code: "MATH101" },
    { id: 2, name: "Physics", code: "PHY101" },
    { id: 3, name: "Chemistry", code: "CHEM101" },
  ];
  const mockExams = [
    {
      id: 1,
      title: "Midterm Exam",
      examId: "EX001",
      course: "MATH101",
      totalMarks: 100,
      passingMarks: 40,
      examType: "midterm",
      examDate: "2024-11-15",
    },
    {
      id: 2,
      title: "Final Exam",
      examId: "EX002",
      course: "PHY101",
      totalMarks: 100,
      passingMarks: 40,
      examType: "final",
      examDate: "2024-11-20",
    },
    {
      id: 3,
      title: "Quiz 1",
      examId: "EX003",
      course: "CHEM101",
      totalMarks: 50,
      passingMarks: 20,
      examType: "quiz",
      examDate: "2024-11-10",
    },
  ];

  const mockStudents = [
    {
      id: 1,
      name: "John Doe",
      studentId: "STU001",
      class: "CS-A",
      rollNumber: "001",
    },
    {
      id: 2,
      name: "Jane Smith",
      studentId: "STU002",
      class: "CS-A",
      rollNumber: "002",
    },
    {
      id: 3,
      name: "Bob Wilson",
      studentId: "STU003",
      class: "CS-A",
      rollNumber: "003",
    },
    {
      id: 4,
      name: "Alice Brown",
      studentId: "STU004",
      class: "CS-A",
      rollNumber: "004",
    },
    {
      id: 5,
      name: "Charlie Davis",
      studentId: "STU005",
      class: "CS-A",
      rollNumber: "005",
    },
  ];

  const handleExamSelection = () => {
    if (!selectedClass || !selectedCourse) {
      alert("Please select both class and course");
      return;
    }

    const exam = mockExams.find((e) => e.course === selectedCourse);
    if (exam) {
      setSelectedExam(exam);
      // Initialize results for students in the class
      const initialResults = mockStudents
        .filter((s) => s.class === selectedClass)
        .map((student) => ({
          studentId: student.studentId,
          studentName: student.name,
          rollNumber: student.rollNumber,
          marksObtained: "",
          remarks: "",
        }));
      setResults(initialResults);
      setStep(2);
    }
  };

  const handleMarksChange = (studentId, value) => {
    const updatedResults = results.map((r) =>
      r.studentId === studentId ? { ...r, marksObtained: value } : r
    );
    setResults(updatedResults);

    // Validate marks
    const newErrors = { ...errors };
    if (value && (value < 0 || value > selectedExam.totalMarks)) {
      newErrors[
        studentId
      ] = `Marks must be between 0 and ${selectedExam.totalMarks}`;
    } else {
      delete newErrors[studentId];
    }
    setErrors(newErrors);
  };

  const handleRemarksChange = (studentId, value) => {
    const updatedResults = results.map((r) =>
      r.studentId === studentId ? { ...r, remarks: value } : r
    );
    setResults(updatedResults);
  };

  const calculateGrade = (marks) => {
    if (!marks || marks === "") return "-";
    const percentage = (marks / selectedExam.totalMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "A-";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const calculatePercentage = (marks) => {
    if (!marks || marks === "") return "-";
    return ((marks / selectedExam.totalMarks) * 100).toFixed(1);
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

  const handleSubmit = () => {
    // Validate all results
    const emptyResults = results.filter(
      (r) => !r.marksObtained && r.marksObtained !== 0
    );
    if (emptyResults.length > 0) {
      alert("Please enter marks for all students");
      return;
    }

    if (Object.keys(errors).length > 0) {
      alert("Please fix all errors before submitting");
      return;
    }

    // Submit results (mock)
    console.log("Submitting results:", {
      exam: selectedExam,
      class: selectedClass,
      results,
    });
    alert("Results submitted successfully!");
    navigate("/admin/results");
  };

  const handleBulkUpload = () => {
    alert("Bulk upload feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() =>
              step === 1 ? navigate("/admin/results") : setStep(1)
            }
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-primary-600" />
            Enter Examination Results
          </h1>
          <p className="mt-2 text-gray-600">
            {step === 1
              ? "Select exam details to begin entering results"
              : `Entering results for ${selectedExam?.title}`}
          </p>
        </div>

        {/* Step 1: Select Exam */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Exam Selection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {mockClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Course</option>
                  {mockCourses.map((course) => (
                    <option key={course.id} value={course.code}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exam Details */}
            {selectedCourse && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">
                  Exam Information
                </h3>
                {mockExams
                  .filter((e) => e.course === selectedCourse)
                  .map((exam) => (
                    <div
                      key={exam.id}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
                    >
                      <div>
                        <span className="text-blue-700 font-medium">
                          Title:
                        </span>
                        <p className="text-blue-900">{exam.title}</p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Type:</span>
                        <p className="text-blue-900 capitalize">
                          {exam.examType}
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Total Marks:
                        </span>
                        <p className="text-blue-900">{exam.totalMarks}</p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Passing Marks:
                        </span>
                        <p className="text-blue-900">{exam.passingMarks}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleExamSelection}
                disabled={!selectedClass || !selectedCourse}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Proceed to Enter Results
              </button>
              <button
                onClick={handleBulkUpload}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                Bulk Upload (CSV)
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Enter Results */}
        {step === 2 && selectedExam && (
          <div>
            {/* Exam Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedExam.title}
                </h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-gray-700">
                      {results.length} Students
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-gray-700">
                      Total Marks: {selectedExam.totalMarks}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Class:</span>
                  <p className="text-gray-900 font-medium">{selectedClass}</p>
                </div>
                <div>
                  <span className="text-gray-500">Course:</span>
                  <p className="text-gray-900 font-medium">
                    {mockCourses.find((c) => c.code === selectedCourse)?.name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Exam Type:</span>
                  <p className="text-gray-900 font-medium capitalize">
                    {selectedExam.examType}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Passing Marks:</span>
                  <p className="text-gray-900 font-medium">
                    {selectedExam.passingMarks}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Tips for entering results:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Enter marks between 0 and {selectedExam.totalMarks}</li>
                  <li>Grades will be calculated automatically</li>
                  <li>Add remarks for students who need special attention</li>
                  <li>You can save as draft and continue later</li>
                </ul>
              </div>
            </div>

            {/* Results Entry Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marks Obtained
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
                    {results.map((result) => (
                      <tr key={result.studentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {result.rollNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {result.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.studentId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0"
                              max={selectedExam.totalMarks}
                              value={result.marksObtained}
                              onChange={(e) =>
                                handleMarksChange(
                                  result.studentId,
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                errors[result.studentId]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            <span className="ml-2 text-sm text-gray-500">
                              / {selectedExam.totalMarks}
                            </span>
                          </div>
                          {errors[result.studentId] && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors[result.studentId]}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {calculatePercentage(result.marksObtained)}
                            {result.marksObtained && "%"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {result.marksObtained !== "" && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getGradeColor(
                                calculateGrade(result.marksObtained)
                              )}`}
                            >
                              {calculateGrade(result.marksObtained)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={result.remarks}
                            onChange={(e) =>
                              handleRemarksChange(
                                result.studentId,
                                e.target.value
                              )
                            }
                            placeholder="Optional remarks"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Submit Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterResults;
