import { BookOpen, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Badge, Card, Loader, Table } from "../../../components/common";
import { DashboardLayout } from "../../../components/layout";
import { adminService } from "../../../services/adminService";

/**
 * Grade Detail View
 * Shows sections, students, and teachers for a specific grade
 */
function GradeDetail() {
  const { gradeNumber } = useParams();
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGradeDetail();
  }, [gradeNumber]);

  const fetchGradeDetail = async () => {
    try {
      setLoading(true);
      const response = await adminService.getGradeDetail(gradeNumber);
      setGradeData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch grade details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <Alert type="error" message={error} />;

  const sections = gradeData?.sections || [];

  const sectionColumns = [
    {
      header: "Section",
      accessor: "section",
      cell: (row) => <Badge variant="primary">Section {row.section}</Badge>,
    },
    {
      header: "Students",
      accessor: "studentCount",
      cell: (row) => `${row.studentCount || 0} / 30`,
    },
    {
      header: "Class Teacher",
      accessor: "classTeacher",
      cell: (row) => row.classTeacher || "Not assigned",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => <Badge variant="success">{row.status || "Active"}</Badge>,
    },
  ];

  return (
    <DashboardLayout
      title={`Grade ${gradeNumber} Details`}
      subtitle="View sections, students, and teachers"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <Users className="h-10 w-10 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {gradeData?.totalStudents || 0}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-info-600" />
            <div>
              <p className="text-sm text-gray-600">Sections</p>
              <p className="text-2xl font-bold text-gray-900">
                {sections.length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <UserCheck className="h-10 w-10 text-success-600" />
            <div>
              <p className="text-sm text-gray-600">Teachers</p>
              <p className="text-2xl font-bold text-gray-900">
                {gradeData?.teachersCount || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sections</h3>
        <Table columns={sectionColumns} data={sections} />
      </Card>
    </DashboardLayout>
  );
}

export default GradeDetail;
