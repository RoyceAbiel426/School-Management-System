import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
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

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getTeacherById(id);

      if (response.data.success) {
        setTeacher(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching teacher:", err);
      setError(err.response?.data?.message || "Failed to load teacher details");
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

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      onLeave: "warning",
      resigned: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: Users },
    { id: "classes", label: "Assigned Classes", icon: BookOpen },
    { id: "subjects", label: "Subjects", icon: GraduationCap },
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
        <Button onClick={() => navigate(ROUTES.ADMIN_ROUTES.TEACHERS)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teachers
        </Button>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert type="warning">Teacher not found</Alert>
        <Button onClick={() => navigate(ROUTES.ADMIN_ROUTES.TEACHERS)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Teachers
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
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.TEACHERS)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teachers
          </Button>
        </div>
        <Button
          onClick={() => navigate(`${ROUTES.ADMIN_ROUTES.TEACHERS}/edit/${id}`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Teacher
        </Button>
      </div>

      {/* Overview Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center">
              <span className="text-5xl font-bold text-primary-foreground">
                {teacher.name?.charAt(0) || "T"}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{teacher.name}</h1>
                {getStatusBadge(teacher.status)}
              </div>
              <p className="text-lg text-muted-foreground">
                {teacher.designation || "Teacher"}
              </p>
              {teacher.employeeId && (
                <p className="text-sm text-muted-foreground">
                  Employee ID: {teacher.employeeId}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{teacher.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{teacher.address || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined: {formatDate(teacher.joiningDate)}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Subjects</p>
                <p className="text-2xl font-bold">
                  {teacher.subjects?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Classes</p>
                <p className="text-2xl font-bold">
                  {teacher.classes?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="text-2xl font-bold">{teacher.experience || 0}y</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-lg font-semibold">
                  {teacher.department || "N/A"}
                </p>
              </div>
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
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Full Name
                  </label>
                  <p className="font-medium">{teacher.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Date of Birth
                  </label>
                  <p className="font-medium">
                    {formatDate(teacher.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Gender
                  </label>
                  <p className="font-medium">{teacher.gender || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Blood Group
                  </label>
                  <p className="font-medium">{teacher.bloodGroup || "N/A"}</p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{teacher.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <p className="font-medium">{teacher.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Address
                  </label>
                  <p className="font-medium">{teacher.address || "N/A"}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      City
                    </label>
                    <p className="font-medium">{teacher.city || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      State
                    </label>
                    <p className="font-medium">{teacher.state || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Pincode
                    </label>
                    <p className="font-medium">{teacher.pincode || "N/A"}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Professional Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                Professional Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Qualification
                  </label>
                  <p className="font-medium">
                    {teacher.qualification || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Experience
                  </label>
                  <p className="font-medium">{teacher.experience || 0} years</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Employee ID
                  </label>
                  <p className="font-medium">{teacher.employeeId || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Joining Date
                  </label>
                  <p className="font-medium">
                    {formatDate(teacher.joiningDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Department
                  </label>
                  <p className="font-medium">{teacher.department || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Designation
                  </label>
                  <p className="font-medium">{teacher.designation || "N/A"}</p>
                </div>
              </div>
            </Card>

            {/* Account Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                Account Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">{getStatusBadge(teacher.status)}</div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Class Teacher
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    {teacher.isClassTeacher ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="font-medium">
                          Yes - {teacher.classTeacherOf}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Account Created
                  </label>
                  <p className="font-medium">{formatDate(teacher.createdAt)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "classes" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Assigned Classes</h3>
            {teacher.classes && teacher.classes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {teacher.classes.map((classItem, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        {typeof classItem === "string"
                          ? classItem
                          : classItem.name}
                      </span>
                    </div>
                    {teacher.isClassTeacher &&
                      teacher.classTeacherOf ===
                        (typeof classItem === "string"
                          ? classItem
                          : classItem.name) && (
                        <Badge variant="success" className="mt-2">
                          Class Teacher
                        </Badge>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No classes assigned</p>
            )}
          </Card>
        )}

        {activeTab === "subjects" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Teaching Subjects</h3>
            {teacher.subjects && teacher.subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacher.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {typeof subject === "string" ? subject : subject.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {teacher.classes?.length || 0} classes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No subjects assigned</p>
            )}
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
                  <p className="text-sm text-muted-foreground">
                    Overall Rating
                  </p>
                  <p className="text-2xl font-bold">4.5/5.0</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on student feedback
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-2xl font-bold">95%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-info/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class Average</p>
                  <p className="text-2xl font-bold">82%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Student performance
              </p>
            </Card>

            {/* Performance Details */}
            <Card className="md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <Award className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Best Teacher Award 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Recognized for excellence in teaching
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">100% Student Pass Rate</p>
                    <p className="text-sm text-muted-foreground">
                      Academic Year 2023-24
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-info mt-0.5" />
                  <div>
                    <p className="font-medium">Workshop Facilitator</p>
                    <p className="text-sm text-muted-foreground">
                      Conducted professional development sessions
                    </p>
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
