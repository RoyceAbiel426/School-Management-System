import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const LibraryTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock transactions data (replace with actual API call)
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    activeBorrows: 0,
    overdueBooks: 0,
    totalFines: 0,
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTransactions = [
      {
        _id: "1",
        bookTitle: "Introduction to Algorithms",
        bookID: { isbn: "9780262033848", author: "Thomas H. Cormen" },
        borrowedBy: {
          name: "John Doe",
          _id: "s1",
          studentID: "STU001",
          class: "CS-A",
        },
        borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "borrowed",
        fine: 0,
      },
      {
        _id: "2",
        bookTitle: "Clean Code",
        bookID: { isbn: "9780132350884", author: "Robert C. Martin" },
        borrowedBy: {
          name: "Jane Smith",
          _id: "s2",
          studentID: "STU002",
          class: "CS-B",
        },
        borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "overdue",
        fine: 6,
      },
      {
        _id: "3",
        bookTitle: "The Pragmatic Programmer",
        bookID: { isbn: "9780135957059", author: "David Thomas" },
        borrowedBy: {
          name: "Mike Johnson",
          _id: "s3",
          studentID: "STU003",
          class: "CS-A",
        },
        borrowDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        returnDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "returned",
        fine: 0,
      },
      {
        _id: "4",
        bookTitle: "Design Patterns",
        bookID: { isbn: "9780201633612", author: "Erich Gamma" },
        borrowedBy: {
          name: "Sarah Wilson",
          _id: "s4",
          studentID: "STU004",
          class: "CS-C",
        },
        borrowDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "borrowed",
        fine: 0,
      },
      {
        _id: "5",
        bookTitle: "Refactoring",
        bookID: { isbn: "9780134757599", author: "Martin Fowler" },
        borrowedBy: {
          name: "Tom Brown",
          _id: "s5",
          studentID: "STU005",
          class: "CS-B",
        },
        borrowDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "overdue",
        fine: 11,
      },
    ];

    setTransactions(mockTransactions);
    calculateStats(mockTransactions);
    setLoading(false);
  }, []);

  const calculateStats = (data) => {
    const totalTransactions = data.length;
    const activeBorrows = data.filter(
      (t) => t.status === "borrowed" || t.status === "overdue"
    ).length;
    const overdueBooks = data.filter((t) => t.status === "overdue").length;
    const totalFines = data.reduce((sum, t) => sum + (t.fine || 0), 0);

    setStats({
      totalTransactions,
      activeBorrows,
      overdueBooks,
      totalFines,
    });
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

  // Filter and search
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.borrowedBy.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.borrowedBy.studentID
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Library Transactions
        </h1>
        <p className="text-gray-600 mt-1">
          Track all book borrowing and return activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalTransactions}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Borrows
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.activeBorrows}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.overdueBooks}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fines</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalFines}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by book, student name, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Transactions</option>
              <option value="borrowed">Currently Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrow Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <BookOpen
                      className="mx-auto text-gray-400 mb-4"
                      size={48}
                    />
                    <p className="text-gray-500 text-lg font-medium">
                      No transactions found
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "No borrowing activity yet"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.bookTitle}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.bookID.author}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="text-primary" size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.borrowedBy.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.borrowedBy.studentID} •{" "}
                            {transaction.borrowedBy.class}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(transaction.borrowDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(transaction.returnDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-gray-400" />
                        {transaction.returnDate
                          ? Math.floor(
                              (new Date(transaction.returnDate) -
                                new Date(transaction.borrowDate)) /
                                (1000 * 60 * 60 * 24)
                            ) + " days"
                          : calculateDaysElapsed(transaction.borrowDate) +
                            " days"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4">
                      {transaction.fine > 0 ? (
                        <div className="flex items-center gap-1 text-red-600 font-medium">
                          <DollarSign size={16} />
                          {transaction.fine}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                          <DollarSign size={16} />0
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredTransactions.length
                )}{" "}
                of {filteredTransactions.length} transactions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === i + 1
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overdue Alert */}
      {stats.overdueBooks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <h3 className="font-semibold text-red-900">
                {stats.overdueBooks} Overdue Book
                {stats.overdueBooks !== 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-red-800 mt-1">
                There are currently {stats.overdueBooks} overdue book
                {stats.overdueBooks !== 1 ? "s" : ""} with total fines of $
                {transactions
                  .filter((t) => t.status === "overdue")
                  .reduce((sum, t) => sum + (t.fine || 0), 0)}
                . Please follow up with students to return the books.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryTransactions;
