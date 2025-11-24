import { BarChart3, Calendar, Trophy, Users } from "lucide-react";
import { useEffect } from "react";
import { Alert, Card, Loader } from "../components/common";
import { DashboardLayout } from "../components/layout";
import { useApi } from "../hooks/useApi";
import coachService from "../services/coachService";

/**
 * Coach Dashboard Page
 */
const CoachDashboard = () => {
  const { data, loading, error, execute } = useApi(coachService.getDashboard);

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
    totalSports: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    activeSeasons: 0,
  };

  const statsCards = [
    {
      title: "My Sports",
      value: stats.totalSports,
      icon: Trophy,
      color: "bg-yellow-500",
    },
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Active Seasons",
      value: stats.activeSeasons,
      icon: BarChart3,
      color: "bg-purple-500",
    },
  ];

  return (
    <DashboardLayout title="Coach Dashboard">
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

        {/* My Sports */}
        <Card title="My Sports" subtitle="Sports you are coaching">
          <div className="space-y-4">
            {data?.sports?.length > 0 ? (
              data.sports.map((sport) => (
                <div
                  key={sport._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{sport.name}</h4>
                    <p className="text-sm text-gray-600">
                      {sport.participantCount} participants
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary-600">
                      {sport.category}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No sports assigned yet
              </p>
            )}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card title="Upcoming Events" subtitle="Scheduled matches and events">
          <div className="space-y-3">
            {data?.upcomingEvents?.length > 0 ? (
              data.upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="p-4 border-l-4 border-yellow-500 bg-yellow-50"
                >
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.sport} - {event.location}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{event.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No upcoming events
              </p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoachDashboard;
