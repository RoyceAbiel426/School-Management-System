import { AlertCircle, BarChart3, BookOpen, Library } from "lucide-react";
import { useEffect } from "react";
import { Alert, Card, Loader } from "../components/common";
import { DashboardLayout } from "../components/layout";
import { useApi } from "../hooks/useApi";
import librarianService from "../services/librarianService";

/**
 * Librarian Dashboard Page
 */
const LibrarianDashboard = () => {
  const { data, loading, error, execute } = useApi(
    librarianService.getDashboard
  );

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
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0,
  };

  const statsCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Available Books",
      value: stats.availableBooks,
      icon: Library,
      color: "bg-green-500",
    },
    {
      title: "Issued Books",
      value: stats.issuedBooks,
      icon: BarChart3,
      color: "bg-purple-500",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: AlertCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <DashboardLayout title="Librarian Dashboard">
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

        {/* Recent Transactions */}
        <Card
          title="Recent Transactions"
          subtitle="Latest book issues and returns"
        >
          <div className="space-y-4">
            {data?.recentTransactions?.length > 0 ? (
              data.recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {transaction.bookTitle}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {transaction.studentName} - {transaction.studentId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        transaction.type === "issued"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.type === "issued" ? "Issued" : "Returned"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {transaction.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent transactions
              </p>
            )}
          </div>
        </Card>

        {/* Overdue Books Alert */}
        {stats.overdueBooks > 0 && (
          <Card title="Overdue Books" subtitle="Books pending return">
            <div className="space-y-3">
              {data?.overdueBooks?.map((book) => (
                <div
                  key={book._id}
                  className="p-4 border-l-4 border-red-500 bg-red-50"
                >
                  <h4 className="font-medium text-gray-900">{book.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {book.studentName} - Overdue by {book.overdueDays} days
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    Fine: ${book.fine}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LibrarianDashboard;
