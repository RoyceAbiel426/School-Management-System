import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import { Card, Button, Badge, Loader, Alert } from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { TrendingUp, Award, Book, ArrowLeft } from "lucide-react";

function StudentProgress() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchStudentProgress();
  }, [studentId]);

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getStudentProgress(studentId);
      const data = response.data || {};
      setStudent(data.student || {});
      setProgress(data.progress || {});
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load student progress";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Progress">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Student Progress"
      subtitle={student?.name || "Student"}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {progress?.attendance || 0}%
            </p>
            <p className="text-sm text-gray-600">Attendance</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Award className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {progress?.avgGrade || "N/A"}
            </p>
            <p className="text-sm text-gray-600">Average Grade</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Book className="h-8 w-8 mx-auto text-info-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {progress?.completedAssignments || 0}
            </p>
            <p className="text-sm text-gray-600">Assignments Done</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {progress?.rank || "N/A"}
            </p>
            <p className="text-sm text-gray-600">Class Rank</p>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Subject-wise Performance
        </h3>
        {progress?.subjects && progress.subjects.length > 0 ? (
          <div className="space-y-4">
            {progress.subjects.map((subject) => (
              <div key={subject.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {subject.name}
                  </span>
                  <Badge variant={subject.grade >= 75 ? "success" : "warning"}>
                    {subject.grade}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      subject.grade >= 75 ? "bg-success-500" : "bg-warning-500"
                    }`}
                    style={{ width: `${subject.grade}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-4">
            No subject data available
          </p>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Exams
        </h3>
        {progress?.recentExams && progress.recentExams.length > 0 ? (
          <div className="space-y-2">
            {progress.recentExams.map((exam) => (
              <div
                key={exam.id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{exam.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(exam.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    exam.marks >= exam.maxMarks * 0.75 ? "success" : "warning"
                  }
                >
                  {exam.marks}/{exam.maxMarks}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-4">
            No exam records found
          </p>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default StudentProgress;
