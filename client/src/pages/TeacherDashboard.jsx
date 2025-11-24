import { BarChart3, BookOpen, Calendar, Users } from "lucide-react";
import { useEffect } from "react";
import { Alert, Card, Loader } from "../components/common";
import { DashboardLayout } from "../components/layout";
import { useApi } from "../hooks/useApi";
import teacherService from "../services/teacherService";

/**
 * Teacher Dashboard Page
 */
const TeacherDashboard = () => {
  const { data, loading, error, execute } = useApi(teacherService.getDashboard);

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <Loader fullScreen />;
  if (error)
    return (
      <DashboardLayout>
        <Alert type="error" message={error} />
      </DashboardLayout>
    );

  const stats = data?.stats || {
    totalClasses: 0,
    totalStudents: 0,
    todayAttendance: 0,
    pendingResults: 0,
  };

  const statsCards = [
    {
      title: "My Classes",
      value: stats.totalClasses,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Today's Attendance",
      value: `${stats.todayAttendance}%`,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Pending Results",
      value: stats.pendingResults,
      icon: BarChart3,
      color: "bg-orange-500",
    },
  ];

  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Classes */}
        <Card title="My Classes" subtitle="Classes you are teaching">
          <div className="space-y-4">
            {data?.recentClasses?.length > 0 ? (
              data.recentClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {classItem.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {classItem.studentCount} students
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary-600">
                      {classItem.subject}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No classes assigned yet
              </p>
            )}
          </div>
        </Card>

        {/* Recent Notices */}
        <Card title="Recent Notices" subtitle="Latest announcements">
          <div className="space-y-3">
            {data?.recentNotices?.length > 0 ? (
              data.recentNotices.map((notice) => (
                <div
                  key={notice._id}
                  className="p-4 border-l-4 border-primary-500 bg-primary-50"
                >
                  <h4 className="font-medium text-gray-900">{notice.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{notice.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent notices
              </p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
