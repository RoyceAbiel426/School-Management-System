import {
  AlertCircle,
  ArrowLeft,
  Book,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import adminService from "../../../services/adminService";

const BookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock transaction data (will be replaced with real API call)
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBookById(id);
      const bookData = response.data || response;
      setBook(bookData);

      // Mock transactions - replace with actual API call
      setTransactions([
        {
          _id: "1",
          borrowedBy: { name: "John Doe", _id: "s1", studentID: "STU001" },
          borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          returnDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: "returned",
          fine: 0,
        },
        {
          _id: "2",
          borrowedBy: { name: "Jane Smith", _id: "s2", studentID: "STU002" },
          borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          returnDate: null,
          status: "borrowed",
          fine: 0,
        },
        {
          _id: "3",
          borrowedBy: { name: "Mike Johnson", _id: "s3", studentID: "STU003" },
          borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          returnDate: null,
          status: "overdue",
          fine: 6,
        },
      ]);
    } catch (error) {
      console.error("Error fetching book details:", error);
      alert("Failed to load book details");
      navigate(ROUTES.ADMIN_ROUTES.LIBRARY);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      fiction: "bg-purple-100 text-purple-800",
      "non-fiction": "bg-blue-100 text-blue-800",
      textbook: "bg-green-100 text-green-800",
      reference: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          colors[category] || colors.other
        }`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      borrowed: {
        color: "bg-blue-100 text-blue-800",
        icon: <BookOpen size={16} />,
        text: "Borrowed",
      },
      returned: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={16} />,
        text: "Returned",
      },
      overdue: {
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle size={16} />,
        text: "Overdue",
      },
    };

    const config = statusConfig[status] || statusConfig.borrowed;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDaysElapsed = (borrowDate) => {
    const now = new Date();
    const borrow = new Date(borrowDate);
    const diff = Math.floor((now - borrow) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const borrowedCopies = book.totalCopies - book.availableCopies;
  const borrowRate = ((borrowedCopies / book.totalCopies) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(ROUTES.ADMIN_ROUTES.LIBRARY)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Library
        </button>
        <button
          onClick={() =>
            navigate(`${ROUTES.ADMIN_ROUTES.LIBRARY}/edit/${book._id}`)
          }
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Edit size={20} />
          Edit Book
        </button>
      </div>

      {/* Book Overview Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
            <Book className="text-white" size={40} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-gray-600 mb-3">by {book.author}</p>
                <div className="flex items-center gap-3">
                  {getCategoryBadge(book.category)}
                  {book.availableCopies === 0 ? (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  ) : book.availableCopies <= 2 ? (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">ISBN</p>
            <p className="font-semibold text-gray-900 font-mono">{book.isbn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Publication Year</p>
            <p className="font-semibold text-gray-900">
              {book.publicationYear}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Copies</p>
            <p className="font-semibold text-gray-900">{book.totalCopies}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Available</p>
            <p className="font-semibold text-gray-900">
              {book.availableCopies} / {book.totalCopies}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Currently Borrowed
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {borrowedCopies}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Borrow Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {borrowRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {transactions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Borrowing History
            </button>
            <button
              onClick={() => setActiveTab("current")}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                activeTab === "current"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Current Borrowers
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Book Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Book Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium text-gray-900">
                        {book.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Author:</span>
                      <span className="font-medium text-gray-900">
                        {book.author}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ISBN:</span>
                      <span className="font-medium text-gray-900 font-mono">
                        {book.isbn}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">
                        {book.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Publication Year:</span>
                      <span className="font-medium text-gray-900">
                        {book.publicationYear}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inventory Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Inventory Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Copies:</span>
                      <span className="font-medium text-gray-900">
                        {book.totalCopies}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-medium text-green-600">
                        {book.availableCopies}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Borrowed:</span>
                      <span className="font-medium text-blue-600">
                        {borrowedCopies}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Borrow Rate:</span>
                      <span className="font-medium text-gray-900">
                        {borrowRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span>
                        {book.availableCopies === 0 ? (
                          <span className="text-red-600 font-medium">
                            Out of Stock
                          </span>
                        ) : book.availableCopies <= 2 ? (
                          <span className="text-yellow-600 font-medium">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">
                            In Stock
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Borrowing History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Book className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 text-lg font-medium">
                    No borrowing history
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    This book has not been borrowed yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.borrowedBy.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.borrowedBy.studentID}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Borrowed</p>
                          <div className="flex items-center gap-1 text-gray-900">
                            <Calendar size={14} />
                            {formatDate(transaction.borrowDate)}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Returned</p>
                          <div className="flex items-center gap-1 text-gray-900">
                            <Calendar size={14} />
                            {formatDate(transaction.returnDate)}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Fine</p>
                          <div className="flex items-center gap-1 text-gray-900">
                            <DollarSign size={14} />
                            {transaction.fine > 0
                              ? `$${transaction.fine}`
                              : "$0"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current Borrowers Tab */}
          {activeTab === "current" && (
            <div className="space-y-4">
              {transactions.filter(
                (t) => t.status === "borrowed" || t.status === "overdue"
              ).length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle
                    className="mx-auto text-gray-400 mb-4"
                    size={48}
                  />
                  <p className="text-gray-500 text-lg font-medium">
                    No current borrowers
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    All copies are available in the library
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions
                    .filter(
                      (t) => t.status === "borrowed" || t.status === "overdue"
                    )
                    .map((transaction) => (
                      <div
                        key={transaction._id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="text-primary" size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.borrowedBy.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.borrowedBy.studentID}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Borrowed Date</p>
                            <div className="flex items-center gap-1 text-gray-900">
                              <Calendar size={14} />
                              {formatDate(transaction.borrowDate)}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Days Elapsed</p>
                            <div className="flex items-center gap-1 text-gray-900">
                              <Clock size={14} />
                              {calculateDaysElapsed(
                                transaction.borrowDate
                              )}{" "}
                              days
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Due Status</p>
                            {calculateDaysElapsed(transaction.borrowDate) >
                            14 ? (
                              <span className="text-red-600 font-medium">
                                {calculateDaysElapsed(transaction.borrowDate) -
                                  14}{" "}
                                days overdue
                              </span>
                            ) : (
                              <span className="text-green-600 font-medium">
                                {14 -
                                  calculateDaysElapsed(
                                    transaction.borrowDate
                                  )}{" "}
                                days remaining
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
