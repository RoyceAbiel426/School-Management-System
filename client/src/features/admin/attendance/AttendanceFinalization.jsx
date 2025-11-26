import { AlertCircle, Calendar, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Loader,
  Select,
  Table,
} from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { adminService } from "../../../services/adminService";

/**
 * Attendance Finalization
 * Finalize attendance with deadline management
 */
function AttendanceFinalization() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAttendanceForFinalization({
        month: selectedMonth,
        year: selectedYear,
      });
      setAttendanceRecords(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch attendance records"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (gradeId) => {
    if (!confirm("Once finalized, attendance cannot be modified. Continue?"))
      return;

    try {
      setError(null);
      await adminService.finalizeAttendance({
        gradeId,
        month: selectedMonth,
        year: selectedYear,
      });
      setSuccess(true);
      fetchAttendanceRecords();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to finalize attendance");
    }
  };

  const handleFinalizeAll = async () => {
    if (
      !confirm(
        "Finalize attendance for all grades? This action cannot be undone."
      )
    )
      return;

    try {
      setError(null);
      await adminService.finalizeAllAttendance({
        month: selectedMonth,
        year: selectedYear,
      });
      setSuccess(true);
      fetchAttendanceRecords();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to finalize all attendance"
      );
    }
  };

  const columns = [
    {
      header: "Grade",
      accessor: "grade",
      cell: (row) => (
        <div className="font-semibold text-gray-900">Grade {row.grade}</div>
      ),
    },
    {
      header: "Total Days",
      accessor: "totalDays",
      cell: (row) => row.totalDays || 0,
    },
    {
      header: "Marked Days",
      accessor: "markedDays",
      cell: (row) => (
        <div>
          <div>
            {row.markedDays || 0} / {row.totalDays || 0}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full bg-primary-600"
              style={{
                width: `${
                  ((row.markedDays || 0) / (row.totalDays || 1)) * 100
                }%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Completion",
      accessor: "completion",
      cell: (row) => {
        const percentage = ((row.markedDays || 0) / (row.totalDays || 1)) * 100;
        return `${percentage.toFixed(1)}%`;
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <Badge variant={row.isFinalized ? "success" : "warning"}>
          {row.isFinalized ? "Finalized" : "Pending"}
        </Badge>
      ),
    },
    {
      header: "Finalized On",
      accessor: "finalizedAt",
      cell: (row) =>
        row.finalizedAt ? new Date(row.finalizedAt).toLocaleDateString() : "-",
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <Button
          size="sm"
          variant={row.isFinalized ? "outline" : "primary"}
          disabled={row.isFinalized}
          onClick={() => handleFinalize(row.gradeId)}
          icon={
            row.isFinalized ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Calendar className="h-4 w-4" />
            )
          }
        >
          {row.isFinalized ? "Finalized" : "Finalize"}
        </Button>
      ),
    },
  ];

  if (loading) return <Loader fullScreen />;

  const allFinalized = attendanceRecords.every((record) => record.isFinalized);
  const canFinalizeAll = attendanceRecords.length > 0 && !allFinalized;

  return (
    <DashboardLayout
      title="Attendance Finalization"
      subtitle="Finalize monthly attendance records"
      action={
        canFinalizeAll && (
          <Button
            onClick={handleFinalizeAll}
            icon={<Lock className="h-4 w-4" />}
          >
            Finalize All
          </Button>
        )
      }
    >
      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && (
        <Alert
          type="success"
          message="Attendance finalized successfully!"
          className="mb-6"
        />
      )}

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="h-6 w-6 text-primary-600" />
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-48"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2024, month - 1).toLocaleDateString("en", {
                  month: "long",
                })}
              </option>
            ))}
          </Select>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-32"
          >
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - 2 + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Alert
        type="warning"
        message="⚠️ Once finalized, attendance records cannot be modified. Please ensure all attendance is marked before finalizing."
        className="mb-6"
      />

      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <AlertCircle className="h-6 w-6 text-warning-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Attendance Records
          </h3>
        </div>
        <Table columns={columns} data={attendanceRecords} />
      </Card>
    </DashboardLayout>
  );
}

export default AttendanceFinalization;
