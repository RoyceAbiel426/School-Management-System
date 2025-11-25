import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Button,
  Badge,
  Input,
  Loader,
  Alert,
  Table,
} from "../../../components/common";
import { librarianService } from "../../../services/librarianService";
import { useNotification } from "../../../context/NotificationContext";
import { ROUTES } from "../../../constants/routes";
import { Book, Search, Plus, Edit, Trash2 } from "lucide-react";

function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchBooks();
  }, [filter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await librarianService.getBooks({ status: filter });
      setBooks(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load books";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await librarianService.deleteBook(bookId);
      showSuccess("Book deleted successfully");
      fetchBooks();
    } catch (err) {
      showError("Failed to delete book");
    }
  };

  const columns = [
    {
      header: "Book ID",
      accessor: "bookId",
      cell: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      header: "Title",
      accessor: "title",
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-600">{row.author}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      cell: (value) => <Badge variant="info">{value}</Badge>,
    },
    {
      header: "Total Copies",
      accessor: "totalCopies",
      cell: (value) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Available",
      accessor: "availableCopies",
      cell: (value, row) => {
        const variant = value > 0 ? "success" : "error";
        return (
          <Badge variant={variant}>
            {value}/{row.totalCopies}
          </Badge>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant = value === "active" ? "success" : "warning";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (value) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`${ROUTES.LIBRARIAN_BOOKS}/edit/${value}`)}
            icon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteBook(value)}
            icon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Book Catalog">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Book Catalog"
      subtitle="Manage library book collection"
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
            placeholder="Search books..."
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
            <option value="all">All Books</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button
          onClick={() => navigate(`${ROUTES.LIBRARIAN_BOOKS}/add`)}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Book
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Book className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{books.length}</p>
            <p className="text-sm text-gray-600">Total Books</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-800">
              {books.filter((b) => b.status === "active").length}
            </p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-info-800">
              {books.reduce((sum, b) => sum + (b.availableCopies || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Available Copies</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-800">
              {books.reduce(
                (sum, b) =>
                  sum + ((b.totalCopies || 0) - (b.availableCopies || 0)),
                0
              )}
            </p>
            <p className="text-sm text-gray-600">Issued</p>
          </div>
        </Card>
      </div>

      <Card>
        {filteredBooks.length > 0 ? (
          <Table columns={columns} data={filteredBooks} />
        ) : (
          <div className="text-center py-8 text-gray-600">
            <Book className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p>No books found</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default BookCatalog;
