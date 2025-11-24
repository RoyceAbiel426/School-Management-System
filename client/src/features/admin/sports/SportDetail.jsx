import {
  ArrowLeft,
  Award,
  Calendar,
  Edit,
  Medal,
  Target,
  TrendingUp,
  Trophy,
  UserCheck,
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

export default function SportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchSport();
  }, [id]);

  const fetchSport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getSportById(id);

      if (response.data.success) {
        setSport(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching sport:", err);
      setError(err.response?.data?.message || "Failed to load sport details");
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
    { id: "overview", label: "Overview", icon: Trophy },
    { id: "participants", label: "Participants", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
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
        <Button onClick={() => navigate(ROUTES.ADMIN_ROUTES.SPORTS)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sports
        </Button>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert type="warning">Sport not found</Alert>
        <Button onClick={() => navigate(ROUTES.ADMIN_ROUTES.SPORTS)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sports
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
            onClick={() => navigate(ROUTES.ADMIN_ROUTES.SPORTS)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sports
          </Button>
        </div>
        <Button
          onClick={() => navigate(`${ROUTES.ADMIN_ROUTES.SPORTS}/edit/${id}`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Sport
        </Button>
      </div>

      {/* Overview Card */}
      <Card>
        <div className="space-y-6">
          {/* Sport Header */}
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-primary to-primary/50 rounded-lg">
              <Trophy className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{sport.sportName}</h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        sport.coach && sport.participants?.length > 0
                          ? "success"
                          : "warning"
                      }
                    >
                      {sport.coach && sport.participants?.length > 0
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Coach</p>
                    <p className="font-semibold">
                      {sport.coach?.name || "Not Assigned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Captain</p>
                    <p className="font-semibold">
                      {sport.captain?.name || "Not Assigned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Participants
                    </p>
                    <p className="font-semibold">
                      {sport.participants?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Matches</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wins</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">67%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trophies</p>
              <p className="text-2xl font-bold">3</p>
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
            {/* Sport Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Sport Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Sport Name
                  </label>
                  <p className="font-medium">{sport.sportName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        sport.coach && sport.participants?.length > 0
                          ? "success"
                          : "warning"
                      }
                    >
                      {sport.coach && sport.participants?.length > 0
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Created On
                  </label>
                  <p className="font-medium">{formatDate(sport.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="font-medium">{formatDate(sport.updatedAt)}</p>
                </div>
              </div>
            </Card>

            {/* Coach Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Coach Information</h3>
              <div className="space-y-3">
                {sport.coach ? (
                  <>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Name
                      </label>
                      <p className="font-medium">{sport.coach.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Email
                      </label>
                      <p className="font-medium">
                        {sport.coach.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Contact
                      </label>
                      <p className="font-medium">
                        {sport.coach.contact || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Coach ID
                      </label>
                      <p className="font-medium">
                        {sport.coach.coachID || "N/A"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No coach assigned</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() =>
                        navigate(`${ROUTES.ADMIN_ROUTES.SPORTS}/edit/${id}`)
                      }
                    >
                      Assign Coach
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Captain Information */}
            <Card className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Team Captain</h3>
              {sport.captain ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Name
                    </label>
                    <p className="font-medium">{sport.captain.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Student ID
                    </label>
                    <p className="font-medium">
                      {sport.captain.studentID || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Class
                    </label>
                    <p className="font-medium">
                      {sport.captain.class || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Role
                    </label>
                    <Badge variant="primary">Captain</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No captain assigned</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "participants" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Team Participants</h3>
            {sport.participants && sport.participants.length > 0 ? (
              <div className="space-y-3">
                {sport.participants.map((participant, index) => (
                  <div
                    key={participant._id || index}
                    className="flex items-center justify-between p-4 border rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">
                          {participant.name?.charAt(0) || index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {participant.name || `Participant ${index + 1}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {participant.studentID || "No ID"} •{" "}
                          {participant.class || "No Class"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sport.captain?._id === participant._id && (
                        <Badge variant="primary">Captain</Badge>
                      )}
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No participants yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add participants to start building your team
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`${ROUTES.ADMIN_ROUTES.SPORTS}/edit/${id}`)
                  }
                >
                  Add Participants
                </Button>
              </div>
            )}
          </Card>
        )}

        {activeTab === "schedule" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              Practice & Match Schedule
            </h3>
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Schedule coming soon
              </h3>
              <p className="text-muted-foreground">
                View practice sessions and upcoming matches
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
                  <Trophy className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matches Won</p>
                  <p className="text-2xl font-bold">8/12</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">67% win rate</p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Goals Scored</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">3.75 per match</p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Award className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trophies Won</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">This season</p>
            </Card>

            {/* Recent Achievements */}
            <Card className="md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <Trophy className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">District Championship Winner</p>
                    <p className="text-sm text-muted-foreground">
                      Won the district tournament finals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <Award className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Best Team Spirit Award</p>
                    <p className="text-sm text-muted-foreground">
                      Recognized for outstanding teamwork
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                  <Medal className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium">Runner-up State Tournament</p>
                    <p className="text-sm text-muted-foreground">
                      Second place in state competition
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Performance Trends */}
            <Card className="md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">Season Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Wins</span>
                    <span className="text-sm text-muted-foreground">
                      8 matches
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Draws</span>
                    <span className="text-sm text-muted-foreground">
                      2 matches
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-info h-2 rounded-full"
                      style={{ width: "17%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Losses</span>
                    <span className="text-sm text-muted-foreground">
                      2 matches
                    </span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="bg-destructive h-2 rounded-full"
                      style={{ width: "17%" }}
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
