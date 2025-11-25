import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Input, Alert, Loader } from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { Save, ArrowLeft } from "lucide-react";

function EnterResults() {
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchExams();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedExam) {
      fetchStudents();
    }
  }, [selectedExam]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getMyClasses();
      setClasses(response.data || []);
    } catch (err) {
      showError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await teacherService.getClassExams(selectedClass);
      setExams(response.data || []);
    } catch (err) {
      showError("Failed to load exams");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await teacherService.getStudentsForResults(
        selectedClass,
        selectedExam
      );
      const data = response.data || {};
      setStudents(data.students || []);

      const initialResults = {};
      data.students?.forEach((student) => {
        initialResults[student._id] = data.existingResults?.[student._id] || "";
      });
      setResults(initialResults);
    } catch (err) {
      showError("Failed to load students");
    }
  };

  const handleResultChange = (studentId, marks) => {
    setResults((prev) => ({
      ...prev,
      [studentId]: marks,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const resultsData = {
        classId: selectedClass,
        examId: selectedExam,
        results: Object.entries(results).map(([studentId, marks]) => ({
          studentId,
          marks: parseFloat(marks) || 0,
        })),
      };

      await teacherService.enterResults(resultsData);
      showSuccess("Results entered successfully");

      setTimeout(() => {
        navigate(ROUTES.TEACHER_RESULTS);
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to enter results";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Enter Results">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Enter Results"
      subtitle="Enter exam results for students"
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.TEACHER_CLASSES)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        {students.length > 0 && (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            icon={<Save className="h-4 w-4" />}
          >
            {submitting ? "Saving..." : "Save Results"}
          </Button>
        )}
      </div>

      <div className="max-w-4xl space-y-6">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedExam("");
                  setStudents([]);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className} - {cls.subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                disabled={!selectedClass}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              >
                <option value="">Choose an exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name} - {exam.maxMarks} marks
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {students.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Enter Marks
            </h3>
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      {student.rollNumber}
                    </p>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      value={results[student._id] || ""}
                      onChange={(e) =>
                        handleResultChange(student._id, e.target.value)
                      }
                      placeholder="Marks"
                      min="0"
                      max={
                        exams.find((e) => e._id === selectedExam)?.maxMarks ||
                        100
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {!selectedClass && (
          <Card>
            <p className="text-center text-gray-600 py-8">
              Please select a class and exam to enter results
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default EnterResults;
