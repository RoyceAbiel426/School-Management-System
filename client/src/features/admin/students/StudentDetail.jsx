import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  User,
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
import { formatDate } from "../../../utils/formatters";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getStudentById(id);

      if (response.data.success) {
        setStudent(response.data.data);

        // Fetch additional data based on active tab
        if (activeTab === "courses") {
          fetchCourses();
        } else if (activeTab === "attendance") {
          fetchAttendance();
        } else if (activeTab === "results") {
          fetchResults();
        }
      }
    } catch (err) {
      console.error("Error fetching student:", err);
      setError(err.response?.data?.message || "Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      // Mock data - replace with actual API call
      setCourses([
        {
          id: 1,
          name: "Mathematics",
          code: "MATH101",
          teacher: "Dr. Smith",
          status: "active",
        },
        {
          id: 2,
          name: "Science",
          code: "SCI101",
          teacher: "Dr. Johnson",
          status: "active",
        },
        {
          id: 3,
          name: "English",
          code: "ENG101",
          teacher: "Prof. Williams",
          status: "active",
        },
      ]);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      // Mock data - replace with actual API call
      setAttendance([
        { date: "2024-11-20", status: "Present", percentage: 100 },
        { date: "2024-11-19", status: "Present", percentage: 100 },
        { date: "2024-11-18", status: "Absent", percentage: 0 },
        { date: "2024-11-17", status: "Present", percentage: 100 },
      ]);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const fetchResults = async () => {
    try {
      // Mock data - replace with actual API call
      setResults([
        {
          exam: "Mid-Term",
          subject: "Mathematics",
          marks: 85,
          maxMarks: 100,
          grade: "A",
        },
        {
          exam: "Mid-Term",
          subject: "Science",
          marks: 78,
          maxMarks: 100,
          grade: "B+",
        },
        {
          exam: "Mid-Term",
          subject: "English",
          marks: 92,
          maxMarks: 100,
          grade: "A+",
        },
      ]);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  useEffect(() => {
    if (student) {
      if (activeTab === "courses") fetchCourses();
      else if (activeTab === "attendance") fetchAttendance();
      else if (activeTab === "results") fetchResults();
    }
  }, [activeTab]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "results", label: "Results", icon: TrendingUp },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      active: "success",
      inactive: "secondary",
      suspended: "warning",
      graduated: "info",
    };
    return (
      <Badge variant={statusMap[status] || "default"}>{status || "N/A"}</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.STUDENTS)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
        <Alert type="error">{error}</Alert>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.STUDENTS)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
        <Alert type="error">Student not found</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.STUDENTS)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-muted-foreground">
              Student ID: {student.studentId || "N/A"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`${ROUTES.ADMIN_ROUTES.STUDENTS}/edit/${id}`)}
        >
          Edit Student
        </Button>
      </div>

      {/* Student Overview */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-primary">
                {student.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {getStatusBadge(student.status)}
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{student.email || "N/A"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{student.phone || "N/A"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">
                  Date of Birth
                </div>
                <div className="font-medium">
                  {student.dateOfBirth
                    ? formatDate(student.dateOfBirth)
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Class</div>
                <div className="font-medium">
                  {student.class?.name || student.class || "Not assigned"}
                  {student.section && ` - ${student.section}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Roll Number</div>
                <div className="font-medium">{student.rollNumber || "N/A"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="font-medium">
                  {[student.city, student.state].filter(Boolean).join(", ") ||
                    student.address ||
                    "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Full Name</div>
                  <div className="font-medium">{student.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Gender</div>
                  <div className="font-medium">{student.gender || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Blood Group
                  </div>
                  <div className="font-medium">
                    {student.bloodGroup || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Admission Date
                  </div>
                  <div className="font-medium">
                    {student.admissionDate
                      ? formatDate(student.admissionDate)
                      : "N/A"}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Parent Phone
                  </div>
                  <div className="font-medium">
                    {student.parentPhone || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Parent Email
                  </div>
                  <div className="font-medium">
                    {student.parentEmail || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Full Address
                  </div>
                  <div className="font-medium">{student.address || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pincode</div>
                  <div className="font-medium">{student.pincode || "N/A"}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "courses" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Enrolled Courses</h3>
            <div className="space-y-3">
              {courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No courses enrolled
                </p>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.code} • {course.teacher}
                      </div>
                    </div>
                    <Badge variant="success">{course.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === "attendance" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
            <div className="space-y-3">
              {attendance.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No attendance records
                </p>
              ) : (
                attendance.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">
                        {formatDate(record.date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {record.percentage}% attendance
                      </div>
                    </div>
                    <Badge
                      variant={
                        record.status === "Present" ? "success" : "destructive"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === "results" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Exam Results</h3>
            <div className="space-y-3">
              {results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No results available
                </p>
              ) : (
                results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{result.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.exam}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {result.marks}/{result.maxMarks}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {((result.marks / result.maxMarks) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <Badge variant="info">{result.grade}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
