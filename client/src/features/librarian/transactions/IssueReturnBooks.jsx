import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Input,
  Badge,
  Loader,
  Alert,
  Table,
} from "../../../components/common";
import { librarianService } from "../../../services/librarianService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { BookOpen, Search, Plus, RotateCcw } from "lucide-react";

function IssueReturnBooks() {
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("issue");

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, studentsRes, booksRes] = await Promise.all([
        librarianService.getTransactions(),
        librarianService.getStudents(),
        librarianService.getAvailableBooks(),
      ]);

      setTransactions(transactionsRes.data || []);
      setStudents(studentsRes.data || []);
      setBooks(booksRes.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load data";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (studentId, bookId) => {
    try {
      await librarianService.issueBook({ studentId, bookId });
      showSuccess("Book issued successfully");
      fetchData();
    } catch (err) {
      showError("Failed to issue book");
    }
  };

  const handleReturnBook = async (transactionId) => {
    try {
      await librarianService.returnBook(transactionId);
      showSuccess("Book returned successfully");
      fetchData();
    } catch (err) {
      showError("Failed to return book");
    }
  };

  const issuedTransactions = transactions.filter((t) => t.status === "issued");
  const filteredTransactions = issuedTransactions.filter(
    (t) =>
      t.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const transactionColumns = [
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
      cell: (value) => {
        const isOverdue = new Date(value) < new Date();
        return (
          <Badge variant={isOverdue ? "error" : "info"}>
            {new Date(value).toLocaleDateString()}
          </Badge>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => <Badge variant="warning">{value}</Badge>,
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (value) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleReturnBook(value)}
          icon={<RotateCcw className="h-4 w-4" />}
        >
          Return
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Issue & Return Books">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Issue & Return Books"
      subtitle="Manage book transactions"
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
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("issue")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "issue"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Issue Books
          </button>
          <button
            onClick={() => setActiveTab("return")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "return"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Return Books
          </button>
        </div>
        <Button
          onClick={() => navigate(ROUTES.LIBRARIAN_TRANSACTIONS)}
          icon={<BookOpen className="h-4 w-4" />}
        >
          View All Transactions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {transactions.length}
            </p>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-800">
              {issuedTransactions.length}
            </p>
            <p className="text-sm text-gray-600">Currently Issued</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-error-800">
              {
                issuedTransactions.filter(
                  (t) => new Date(t.dueDate) < new Date()
                ).length
              }
            </p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-800">
              {books.reduce((sum, b) => sum + (b.availableCopies || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Available Books</p>
          </div>
        </Card>
      </div>

      {activeTab === "issue" && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Issue New Book
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Select Student</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      {student.rollNumber} • {student.class}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                Available Books
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {books
                  .filter((b) => b.availableCopies > 0)
                  .map((book) => (
                    <div
                      key={book._id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-800">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <Badge variant="success" className="mt-1">
                        {book.availableCopies} available
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "return" && (
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Issued Books
            </h3>
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
              className="w-64"
            />
          </div>
          {filteredTransactions.length > 0 ? (
            <Table columns={transactionColumns} data={filteredTransactions} />
          ) : (
            <div className="text-center py-8 text-gray-600">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p>No issued books found</p>
            </div>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}

export default IssueReturnBooks;
