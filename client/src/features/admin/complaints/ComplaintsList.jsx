import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  MessageSquare,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ComplaintsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - will be replaced with API calls
  const mockComplaints = [
    {
      id: 1,
      student: {
        name: "John Doe",
        studentId: "STU001",
        class: "CS-A",
      },
      complaint:
        "The library computers are not working properly. Most of them are extremely slow and some are completely non-functional.",
      date: "2024-11-20",
      status: "pending",
      priority: "high",
      category: "Facilities",
    },
    {
      id: 2,
      student: {
        name: "Jane Smith",
        studentId: "STU002",
        class: "CS-A",
      },
      complaint:
        "There is a water leakage problem in the girls washroom on the second floor. It needs immediate attention.",
      date: "2024-11-19",
      status: "in-progress",
      priority: "high",
      category: "Maintenance",
    },
    {
      id: 3,
      student: {
        name: "Bob Wilson",
        studentId: "STU003",
        class: "CS-B",
      },
      complaint:
        "The cafeteria food quality has deteriorated. Many students have complained about the taste and hygiene.",
      date: "2024-11-18",
      status: "resolved",
      priority: "medium",
      category: "Cafeteria",
    },
    {
      id: 4,
      student: {
        name: "Alice Brown",
        studentId: "STU004",
        class: "CS-A",
      },
      complaint:
        "Request for additional chemistry lab equipment. Current equipment is insufficient for the class size.",
      date: "2024-11-17",
      status: "pending",
      priority: "medium",
      category: "Academic",
    },
    {
      id: 5,
      student: {
        name: "Charlie Davis",
        studentId: "STU005",
        class: "CS-C",
      },
      complaint:
        "The sports field needs maintenance. The ground is uneven and poses a safety risk during games.",
      date: "2024-11-16",
      status: "resolved",
      priority: "high",
      category: "Sports",
    },
    {
      id: 6,
      student: {
        name: "Diana Evans",
        studentId: "STU006",
        class: "CS-B",
      },
      complaint:
        "Classroom AC is not functioning properly. It's too hot during afternoon classes.",
      date: "2024-11-15",
      status: "in-progress",
      priority: "low",
      category: "Facilities",
    },
  ];

  // Calculate statistics
  const totalComplaints = mockComplaints.length;
  const pendingCount = mockComplaints.filter(
    (c) => c.status === "pending"
  ).length;
  const inProgressCount = mockComplaints.filter(
    (c) => c.status === "in-progress"
  ).length;
  const resolvedCount = mockComplaints.filter(
    (c) => c.status === "resolved"
  ).length;

  // Filter complaints
  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.student.studentId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      complaint.complaint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !filters.status || complaint.status === filters.status;
    const matchesPriority =
      !filters.priority || complaint.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      ),
      "in-progress": (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          In Progress
        </span>
      ),
      resolved: (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolved
        </span>
      ),
    };
    return badges[status] || null;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: (
        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
          High
        </span>
      ),
      medium: (
        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-medium rounded">
          Medium
        </span>
      ),
      low: (
        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
          Low
        </span>
      ),
    };
    return badges[priority] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-primary-600" />
            Complaints Management
          </h1>
          <p className="mt-2 text-gray-600">
            Review and manage student complaints
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Complaints
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalComplaints}
                </p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {pendingCount}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {inProgressCount}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {resolvedCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedComplaints.length > 0 ? (
                  paginatedComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {complaint.student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {complaint.student.studentId} •{" "}
                              {complaint.student.class}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md line-clamp-2">
                          {complaint.complaint}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {complaint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {new Date(complaint.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(complaint.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(complaint.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            navigate(`/admin/complaints/${complaint.id}`)
                          }
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No complaints found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredComplaints.length)}{" "}
                of {filteredComplaints.length} complaints
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsList;
