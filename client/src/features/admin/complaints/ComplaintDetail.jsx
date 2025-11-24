import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Send,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [showResponseForm, setShowResponseForm] = useState(false);

  // Mock data - will be replaced with API call
  useEffect(() => {
    const mockComplaint = {
      id: 1,
      student: {
        name: "John Doe",
        studentId: "STU001",
        class: "CS-A",
        email: "john.doe@school.com",
        phone: "+1 234 567 8900",
      },
      complaint:
        "The library computers are not working properly. Most of them are extremely slow and some are completely non-functional. This is affecting our research work and project submissions. We request immediate attention to this matter.",
      date: "2024-11-20",
      status: "pending",
      priority: "high",
      category: "Facilities",
      responses: [
        {
          id: 1,
          message: "We have received your complaint and are looking into it.",
          respondedBy: "Admin",
          date: "2024-11-20",
        },
      ],
    };

    setComplaint(mockComplaint);
    setStatus(mockComplaint.status);
    setLoading(false);
  }, [id]);

  const handleStatusUpdate = () => {
    // Update status logic here
    console.log("Updating status to:", status);
    setComplaint({ ...complaint, status });
    alert("Status updated successfully!");
  };

  const handleResponseSubmit = () => {
    if (!response.trim()) {
      alert("Please enter a response");
      return;
    }

    // Submit response logic here
    const newResponse = {
      id: complaint.responses.length + 1,
      message: response,
      respondedBy: "Admin",
      date: new Date().toISOString().split("T")[0],
    };

    setComplaint({
      ...complaint,
      responses: [...complaint.responses, newResponse],
    });
    setResponse("");
    setShowResponseForm(false);
    alert("Response sent successfully!");
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" />
          Pending
        </span>
      ),
      "in-progress": (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <AlertCircle className="w-4 h-4 mr-1" />
          In Progress
        </span>
      ),
      resolved: (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Resolved
        </span>
      ),
    };
    return badges[status] || null;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: (
        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
          High Priority
        </span>
      ),
      medium: (
        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
          Medium Priority
        </span>
      ),
      low: (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
          Low Priority
        </span>
      ),
    };
    return badges[priority] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/complaints")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Complaints
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="w-8 h-8 mr-3 text-primary-600" />
              Complaint Details
            </h1>
            <div className="flex items-center gap-3">
              {getPriorityBadge(complaint.priority)}
              {getStatusBadge(complaint.status)}
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Student Information
          </h2>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div className="ml-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {complaint.student.name}
              </h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">Student ID:</span>
                  <span className="ml-2">{complaint.student.studentId}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">Class:</span>
                  <span className="ml-2">{complaint.student.class}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{complaint.student.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{complaint.student.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Complaint Details
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(complaint.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
              {complaint.category}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {complaint.complaint}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Update Status
          </h2>
          <div className="flex items-center gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={status === complaint.status}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Update Status
            </button>
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Responses ({complaint.responses.length})
            </h2>
            {!showResponseForm && (
              <button
                onClick={() => setShowResponseForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Response
              </button>
            )}
          </div>

          {/* Response Form */}
          {showResponseForm && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows="4"
                placeholder="Enter your response to the student..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={() => {
                    setShowResponseForm(false);
                    setResponse("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResponseSubmit}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Response
                </button>
              </div>
            </div>
          )}

          {/* Response List */}
          <div className="space-y-4">
            {complaint.responses.length > 0 ? (
              complaint.responses.map((resp) => (
                <div
                  key={resp.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {resp.respondedBy}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(resp.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{resp.message}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No responses yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Action History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Action History
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="ml-4">
                <p className="text-sm text-gray-900">Complaint submitted</p>
                <p className="text-xs text-gray-500">
                  {new Date(complaint.date).toLocaleDateString()} - By{" "}
                  {complaint.student.name}
                </p>
              </div>
            </div>
            {complaint.responses.map((resp, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div className="ml-4">
                  <p className="text-sm text-gray-900">Response added</p>
                  <p className="text-xs text-gray-500">
                    {new Date(resp.date).toLocaleDateString()} - By{" "}
                    {resp.respondedBy}
                  </p>
                </div>
              </div>
            ))}
            {complaint.status === "resolved" && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div className="ml-4">
                  <p className="text-sm text-gray-900">Complaint resolved</p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
