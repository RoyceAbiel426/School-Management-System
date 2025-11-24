import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/common/Alert";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Loader from "../../../components/common/Loader";
import { ROUTES } from "../../../constants/routes";
import { adminService } from "../../../services/adminService";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getCourseById(id);

      if (response.data.success) {
        setCourse(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching course:", err);
      setError(err.response?.data?.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "modules", label: "Modules", icon: FileText },
    { id: "students", label: "Enrolled Students", icon: Users },
    { id: "performance", label: "Performance", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert type="error">{error}</Alert>
        <Button onClick={() => navigate(ROUTES.ADMIN_ROUTES.COURSES)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert type="warning">Course not found</Alert>
        <Button onClick={() => navigate(ROUTES.ADMIN_ROUTES.COURSES)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.COURSES)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        <Button
          onClick={() => navigate(`${ROUTES.ADMIN_ROUTES.COURSES}/edit/${id}`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Course
        </Button>
      </div>

      {/* Overview Card */}
      <Card>
        <div className="space-y-6">
          {/* Course Header */}
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-primary to-primary/50 rounded-lg">
              <BookOpen className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{course.courseName}</h1>
                    <Badge variant="primary">{course.courseID}</Badge>
                  </div>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Grade Level</p>
                    <p className="font-semibold">Grade {course.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold">{course.duration} weeks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teacher</p>
                    <p className="font-semibold">
                      {course.teacher?.name || "Not Assigned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Modules</p>
                    <p className="font-semibold">
                      {course.modules?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Performance</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">92%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold">{course.sessions || "N/A"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Course Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Course Code
                  </label>
                  <p className="font-medium font-mono">{course.courseID}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Course Name
                  </label>
                  <p className="font-medium">{course.courseName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Grade Level
                  </label>
                  <p className="font-medium">Grade {course.grade}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Duration
                  </label>
                  <p className="font-medium">{course.duration} weeks</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Sessions
                  </label>
                  <p className="font-medium">
                    {course.sessions || "Not specified"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Teacher Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                Teacher Information
              </h3>
              <div className="space-y-3">
                {course.teacher ? (
                  <>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Name
                      </label>
                      <p className="font-medium">{course.teacher.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Email
                      </label>
                      <p className="font-medium">
                        {course.teacher.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Employee ID
                      </label>
                      <p className="font-medium">
                        {course.teacher.employeeId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Status
                      </label>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No teacher assigned</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() =>
                        navigate(`${ROUTES.ADMIN_ROUTES.COURSES}/edit/${id}`)
                      }
                    >
                      Assign Teacher
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </Card>

            {/* Metadata */}
            <Card className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Metadata</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Created At
                  </label>
                  <p className="font-medium">{formatDate(course.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="font-medium">{formatDate(course.updatedAt)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "modules" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-3">
                {course.modules.map((module, index) => (
                  <div
                    key={module._id || index}
                    className="p-4 border rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          Module {index + 1}:{" "}
                          {module.name || module.title || `Module ${index + 1}`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {module.description || "No description available"}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {module.lessons?.length || 0} lessons
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add modules to organize your course content
                </p>
                <Button variant="outline">Add Module</Button>
              </div>
            )}
          </Card>
        )}

        {activeTab === "students" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Enrolled Students</h3>
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Student enrollment coming soon
              </h3>
              <p className="text-muted-foreground">
                View and manage students enrolled in this course
              </p>
            </div>
          </Card>
        )}

        {activeTab === "performance" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Performance Stats */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on 45 students
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">41 of 45 students</p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-info/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <p className="text-2xl font-bold">88%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Above 60%</p>
            </Card>

            {/* Performance Details */}
            <Card className="md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">
                Performance Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Excellent (90-100%)
                    </span>
                    <span className="text-sm text-muted-foreground">
                      12 students
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{ width: "27%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Good (80-89%)</span>
                    <span className="text-sm text-muted-foreground">
                      18 students
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Average (70-79%)
                    </span>
                    <span className="text-sm text-muted-foreground">
                      9 students
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-info h-2 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Below Average (&lt;70%)
                    </span>
                    <span className="text-sm text-muted-foreground">
                      6 students
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full"
                      style={{ width: "13%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
