import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout";
import { Card, Loader, Alert } from "../../../components/common";
import { librarianService } from "../../../services/librarianService";
import { useNotification } from "../../../context/NotificationContext";
import { BarChart3, TrendingUp, Users, Book, DollarSign } from "lucide-react";

function LibraryAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("month");

  const { error: showError } = useNotification();

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await librarianService.getLibraryAnalytics(period);
      setAnalytics(response.data || {});
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load analytics";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Library Analytics">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Library Analytics"
      subtitle="Library performance insights"
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
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Book className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {analytics?.totalBooks || 0}
            </p>
            <p className="text-sm text-gray-600">Total Books</p>
            <p className="text-xs text-success-600 mt-1">
              +{analytics?.newBooks || 0} new
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-info-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {analytics?.totalMembers || 0}
            </p>
            <p className="text-sm text-gray-600">Active Members</p>
            <p className="text-xs text-info-600 mt-1">
              +{analytics?.newMembers || 0} new
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {analytics?.totalIssues || 0}
            </p>
            <p className="text-sm text-gray-600">Books Issued</p>
            <p className="text-xs text-success-600 mt-1">
              {analytics?.issueGrowth || 0}% vs last period
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <DollarSign className="h-8 w-8 mx-auto text-warning-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              ${analytics?.totalFines || 0}
            </p>
            <p className="text-sm text-gray-600">Fines Collected</p>
            <p className="text-xs text-warning-600 mt-1">
              {analytics?.overdueBooks || 0} overdue
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Popular Categories
          </h3>
          {analytics?.popularCategories &&
          analytics.popularCategories.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      {category.name}
                    </span>
                    <span className="text-sm font-medium">
                      {category.count} books
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (category.count / analytics.totalBooks) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">No data available</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Most Active Members
          </h3>
          {analytics?.activeMembers && analytics.activeMembers.length > 0 ? (
            <div className="space-y-3">
              {analytics.activeMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary-600">
                      {member.booksIssued}
                    </p>
                    <p className="text-xs text-gray-600">books issued</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">No data available</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Issue Trends
          </h3>
          <div className="text-center py-8">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Chart placeholder</p>
            <p className="text-sm text-gray-500 mt-2">
              {analytics?.trends?.direction === "up"
                ? "📈 Trending up"
                : analytics?.trends?.direction === "down"
                ? "📉 Trending down"
                : "➡️ Steady"}
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Books Added</span>
              <span className="font-medium">
                {analytics?.monthlyStats?.booksAdded || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Members</span>
              <span className="font-medium">
                {analytics?.monthlyStats?.newMembers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Books Issued</span>
              <span className="font-medium">
                {analytics?.monthlyStats?.booksIssued || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Books Returned</span>
              <span className="font-medium">
                {analytics?.monthlyStats?.booksReturned || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fines Collected</span>
              <span className="font-medium">
                ${analytics?.monthlyStats?.finesCollected || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default LibraryAnalytics;
