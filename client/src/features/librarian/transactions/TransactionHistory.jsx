import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Badge,
  Input,
  Loader,
  Alert,
  Table,
} from "../../../components/common";
import { librarianService } from "../../../services/librarianService";
import { useNotification } from "../../../context/NotificationContext";
import { History, Search, Download } from "lucide-react";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const { error: showError } = useNotification();

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await librarianService.getTransactionHistory({
        status: filter,
      });
      setTransactions(response.data || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load transaction history";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Transaction ID",
      accessor: "transactionId",
      cell: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      header: "Student",
      accessor: "student",
      cell: (value) => (
        <div>
          <p className="font-medium text-gray-800">{value?.name}</p>
          <p className="text-xs text-gray-600">{value?.rollNumber}</p>
        </div>
      ),
    },
    {
      header: "Book",
      accessor: "book",
      cell: (value) => (
        <div>
          <p className="font-medium text-gray-800">{value?.title}</p>
          <p className="text-xs text-gray-600">{value?.author}</p>
        </div>
      ),
    },
    {
      header: "Issue Date",
      accessor: "issueDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Return Date",
      accessor: "returnDate",
      cell: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant =
          {
            issued: "warning",
            returned: "success",
            overdue: "error",
          }[value] || "default";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      header: "Fine",
      accessor: "fine",
      cell: (value) => (value ? `$${value}` : "-"),
    },
  ];

  const filteredTransactions = transactions.filter(
    (t) =>
      t.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Transaction History">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Transaction History"
      subtitle="View complete transaction history"
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
        <div className="flex gap-4">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-5 w-5" />}
            className="w-64"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Transactions</option>
            <option value="issued">Currently Issued</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <History className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {transactions.length}
            </p>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-800">
              {transactions.filter((t) => t.status === "issued").length}
            </p>
            <p className="text-sm text-gray-600">Currently Issued</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-800">
              {transactions.filter((t) => t.status === "returned").length}
            </p>
            <p className="text-sm text-gray-600">Returned</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-error-800">
              {transactions.filter((t) => t.status === "overdue").length}
            </p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
        </Card>
      </div>

      <Card>
        {filteredTransactions.length > 0 ? (
          <Table columns={columns} data={filteredTransactions} />
        ) : (
          <div className="text-center py-8 text-gray-600">
            <History className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p>No transactions found</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TransactionHistory;
