import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NoticesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const itemsPerPage = 10;

  // Mock data - will be replaced with API calls
  const mockNotices = [
    {
      id: 1,
      title: "School Holiday Announcement",
      details:
        "The school will remain closed on December 25th for Christmas celebration. All students and staff are requested to note this date.",
      date: "2024-11-20",
      createdBy: "Admin",
      views: 145,
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      details:
        "A parent-teacher meeting is scheduled for November 30th at 10:00 AM. All parents are requested to attend.",
      date: "2024-11-18",
      createdBy: "Principal",
      views: 230,
    },
    {
      id: 3,
      title: "Exam Schedule Released",
      details:
        "The final examination schedule for Fall 2024 has been released. Students can check the schedule on the notice board and website.",
      date: "2024-11-15",
      createdBy: "Admin",
      views: 312,
    },
    {
      id: 4,
      title: "Sports Day Announcement",
      details:
        "Annual Sports Day will be held on December 10th. All students are encouraged to participate in various sports activities.",
      date: "2024-11-12",
      createdBy: "Sports Coordinator",
      views: 198,
    },
    {
      id: 5,
      title: "Library New Books Arrival",
      details:
        "The library has received a new collection of 50+ books covering various subjects. Students can check them out starting next week.",
      date: "2024-11-10",
      createdBy: "Librarian",
      views: 87,
    },
    {
      id: 6,
      title: "Fee Payment Deadline",
      details:
        "The last date for semester fee payment is November 30th. Late payments will incur additional charges.",
      date: "2024-11-08",
      createdBy: "Admin",
      views: 256,
    },
  ];

  // Filter notices
  const filteredNotices = mockNotices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = (notice) => {
    setSelectedNotice(notice);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Delete logic here
    console.log("Deleting notice:", selectedNotice);
    setShowDeleteModal(false);
    setSelectedNotice(null);
  };

  const getRecentBadge = (date) => {
    const noticeDate = new Date(date);
    const today = new Date();
    const diffDays = Math.floor((today - noticeDate) / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) {
      return (
        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          New
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-primary-600" />
            Notices Management
          </h1>
          <p className="mt-2 text-gray-600">
            Create and manage school notices and announcements
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Notices
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockNotices.length}
                </p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <Bell className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    mockNotices.filter((n) => {
                      const date = new Date(n.date);
                      return date.getMonth() === new Date().getMonth();
                    }).length
                  }
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockNotices.reduce((sum, n) => sum + n.views, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={() => navigate("/admin/notices/create")}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Notice
            </button>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4 mb-6">
          {paginatedNotices.length > 0 ? (
            paginatedNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notice.title}
                      </h3>
                      {getRecentBadge(notice.date)}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {notice.details}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(notice.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        By {notice.createdBy}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {notice.views} views
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/notices/edit/${notice.id}`)
                      }
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Notice"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notices found</p>
              <p className="text-gray-400 text-sm mt-2">
                Create your first notice to get started
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredNotices.length)} of{" "}
              {filteredNotices.length} notices
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Notice
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedNotice?.title}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticesList;
