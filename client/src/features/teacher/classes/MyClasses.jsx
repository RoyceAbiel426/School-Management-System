import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Badge,
  Loader,
  Alert,
  Input,
} from "../../../components/common";
import { teacherService } from "../../../services/teacherService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Search,
  ChevronRight,
} from "lucide-react";

/**
 * My Classes Page
 * View all classes assigned to the teacher
 */
function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { error: showError } = useNotification();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [searchTerm, classes]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teacherService.getMyClasses();
      const classesData = response.data || [];

      setClasses(classesData);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load classes";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = [...classes];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cls) =>
          cls.className?.toLowerCase().includes(search) ||
          cls.subject?.toLowerCase().includes(search) ||
          cls.grade?.toLowerCase().includes(search)
      );
    }

    setFilteredClasses(filtered);
  };

  const handleViewClass = (classId) => {
    navigate(`${ROUTES.TEACHER_CLASSES}/${classId}`);
  };

  const handleMarkAttendance = (classId) => {
    navigate(`${ROUTES.TEACHER_ATTENDANCE}/mark/${classId}`);
  };

  if (loading) {
    return (
      <DashboardLayout title="My Classes">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Classes" subtitle="Manage your assigned classes">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Classes</h2>
          <p className="text-gray-600 mt-1">
            {filteredClasses.length} class
            {filteredClasses.length !== 1 ? "es" : ""} assigned
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <Input
          placeholder="Search by class name, subject, or grade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {classes.length}
            </p>
            <p className="text-gray-600 mt-1">Total Classes</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">
              {classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0)}
            </p>
            <p className="text-gray-600 mt-1">Total Students</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-info-600">
              {new Set(classes.map((c) => c.subject)).size}
            </p>
            <p className="text-gray-600 mt-1">Subjects</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-warning-600">
              {classes.filter((c) => c.hasClassToday).length}
            </p>
            <p className="text-gray-600 mt-1">Classes Today</p>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No Classes Found" : "No Classes Assigned"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "You don't have any classes assigned yet"}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </div>
        </Card>
      ) : (
        /* Classes Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map((cls) => (
            <Card
              key={cls._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewClass(cls._id)}
            >
              {/* Class Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cls.className || "Untitled Class"}
                    </h3>
                    {cls.hasClassToday && (
                      <Badge variant="success" className="ml-2">
                        Today
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{cls.subject || "N/A"}</span>
                    <span className="mx-2">•</span>
                    <span>{cls.grade || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Class Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-primary-500" />
                  <span>
                    <span className="font-medium">{cls.studentCount || 0}</span>{" "}
                    Students
                  </span>
                </div>

                {cls.schedule && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-info-500" />
                    <span>{cls.schedule}</span>
                  </div>
                )}

                {cls.room && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Room:</span> {cls.room}
                  </div>
                )}

                {cls.nextClass && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-warning-500" />
                    <span>{new Date(cls.nextClass).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {cls.stats && (
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {cls.stats.avgAttendance || 0}%
                    </p>
                    <p className="text-xs text-gray-600">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {cls.stats.avgGrade || "N/A"}
                    </p>
                    <p className="text-xs text-gray-600">Avg Grade</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {cls.stats.assignments || 0}
                    </p>
                    <p className="text-xs text-gray-600">Assignments</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewClass(cls._id);
                  }}
                  icon={<ChevronRight className="h-4 w-4" />}
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAttendance(cls._id);
                  }}
                  icon={<Users className="h-4 w-4" />}
                >
                  Attendance
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyClasses;
