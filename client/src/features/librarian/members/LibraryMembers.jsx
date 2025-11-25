import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout";
import {
  Card,
  Badge,
  Input,
  Button,
  Loader,
  Alert,
  Table,
} from "../../../components/common";
import { librarianService } from "../../../services/librarianService";
import { useNotification } from "../../../context/NotificationContext";
import { Users, Search, Mail, UserCheck } from "lucide-react";

function LibraryMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const { success: showSuccess, error: showError } = useNotification();

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await librarianService.getLibraryMembers({
        status: filter,
      });
      setMembers(response.data || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to load library members";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (memberId) => {
    try {
      await librarianService.sendOverdueReminder(memberId);
      showSuccess("Reminder sent successfully");
    } catch (err) {
      showError("Failed to send reminder");
    }
  };

  const handleApproveMembership = async (memberId) => {
    try {
      await librarianService.approveMembership(memberId);
      showSuccess("Membership approved");
      fetchMembers();
    } catch (err) {
      showError("Failed to approve membership");
    }
  };

  const columns = [
    {
      header: "Member ID",
      accessor: "memberId",
      cell: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      header: "Student",
      accessor: "student",
      cell: (value) => (
        <div>
          <p className="font-medium text-gray-800">{value?.name}</p>
          <p className="text-xs text-gray-600">
            {value?.rollNumber} • {value?.class}
          </p>
        </div>
      ),
    },
    {
      header: "Join Date",
      accessor: "joinDate",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Books Issued",
      accessor: "booksIssued",
      cell: (value) => <span className="font-medium">{value || 0}</span>,
    },
    {
      header: "Overdue Books",
      accessor: "overdueBooks",
      cell: (value) => {
        if (!value || value === 0) return "-";
        return <Badge variant="error">{value}</Badge>;
      },
    },
    {
      header: "Total Fine",
      accessor: "totalFine",
      cell: (value) => (value ? `$${value}` : "-"),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant =
          {
            active: "success",
            pending: "warning",
            suspended: "error",
          }[value] || "default";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (value, row) => (
        <div className="flex gap-2">
          {row.overdueBooks > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendReminder(value)}
              icon={<Mail className="h-4 w-4" />}
            >
              Remind
            </Button>
          )}
          {row.status === "pending" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleApproveMembership(value)}
              icon={<UserCheck className="h-4 w-4" />}
            >
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  const filteredMembers = members.filter(
    (member) =>
      member.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.student?.rollNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.memberId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="Library Members">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Library Members"
      subtitle="Manage library memberships"
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
            placeholder="Search members..."
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
            <option value="all">All Members</option>
            <option value="active">Active</option>
            <option value="pending">Pending Approval</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{members.length}</p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-800">
              {members.filter((m) => m.status === "active").length}
            </p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-800">
              {members.filter((m) => m.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-error-800">
              {members.filter((m) => (m.overdueBooks || 0) > 0).length}
            </p>
            <p className="text-sm text-gray-600">With Overdue</p>
          </div>
        </Card>
      </div>

      <Card>
        {filteredMembers.length > 0 ? (
          <Table columns={columns} data={filteredMembers} />
        ) : (
          <div className="text-center py-8 text-gray-600">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p>No members found</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default LibraryMembers;
