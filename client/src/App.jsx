import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./constants/roles";
import { ROUTES } from "./constants/routes";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import("./components/LandingPage"));
const AdminLogin = React.lazy(() => import("./components/AdminLogin"));
const AdminRegister = React.lazy(() => import("./components/AdminRegister"));
const StudentLogin = React.lazy(() => import("./components/StudentLogin"));
const StudentRegister = React.lazy(() =>
  import("./components/StudentRegister")
);
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard"));

// Admin Student Management Pages
const StudentList = React.lazy(() =>
  import("./features/admin/students/StudentList")
);
const CreateStudent = React.lazy(() =>
  import("./features/admin/students/CreateStudent")
);
const EditStudent = React.lazy(() =>
  import("./features/admin/students/EditStudent")
);
const StudentDetail = React.lazy(() =>
  import("./features/admin/students/StudentDetail")
);
const BulkImportStudents = React.lazy(() =>
  import("./features/admin/students/BulkImportStudents")
);

// Admin Teacher Management Pages
const TeacherList = React.lazy(() =>
  import("./features/admin/teachers/TeacherList")
);
const CreateTeacher = React.lazy(() =>
  import("./features/admin/teachers/CreateTeacher")
);
const EditTeacher = React.lazy(() =>
  import("./features/admin/teachers/EditTeacher")
);
const TeacherDetail = React.lazy(() =>
  import("./features/admin/teachers/TeacherDetail")
);

// Admin Course Management Pages
const CourseList = React.lazy(() =>
  import("./features/admin/courses/CourseList")
);
const CreateCourse = React.lazy(() =>
  import("./features/admin/courses/CreateCourse")
);
const EditCourse = React.lazy(() =>
  import("./features/admin/courses/EditCourse")
);
const CourseDetail = React.lazy(() =>
  import("./features/admin/courses/CourseDetail")
);

// Admin Sports Management Pages
const SportsList = React.lazy(() =>
  import("./features/admin/sports/SportsList")
);
const CreateSport = React.lazy(() =>
  import("./features/admin/sports/CreateSport")
);
const EditSport = React.lazy(() => import("./features/admin/sports/EditSport"));
const SportDetail = React.lazy(() =>
  import("./features/admin/sports/SportDetail")
);

// Admin Library Management Pages
const BooksList = React.lazy(() =>
  import("./features/admin/library/BooksList")
);
const CreateBook = React.lazy(() =>
  import("./features/admin/library/CreateBook")
);
const EditBook = React.lazy(() => import("./features/admin/library/EditBook"));
const BookDetail = React.lazy(() =>
  import("./features/admin/library/BookDetail")
);
const LibraryTransactions = React.lazy(() =>
  import("./features/admin/library/LibraryTransactions")
);

// Admin Attendance Management Pages
const AttendanceOverview = React.lazy(() =>
  import("./features/admin/attendance/AttendanceOverview")
);
const MarkAttendance = React.lazy(() =>
  import("./features/admin/attendance/MarkAttendance")
);
const AttendanceReport = React.lazy(() =>
  import("./features/admin/attendance/AttendanceReport")
);
const StudentAttendance = React.lazy(() =>
  import("./features/admin/attendance/StudentAttendance")
);

// Admin Results Management Pages
const ResultsList = React.lazy(() =>
  import("./features/admin/results/ResultsList")
);
const EnterResults = React.lazy(() =>
  import("./features/admin/results/EnterResults")
);
const ResultsReport = React.lazy(() =>
  import("./features/admin/results/ResultsReport")
);
const StudentResult = React.lazy(() =>
  import("./features/admin/results/StudentResult")
);

// Admin Notices Management Pages
const NoticesList = React.lazy(() =>
  import("./features/admin/notices/NoticesList")
);
const CreateNotice = React.lazy(() =>
  import("./features/admin/notices/CreateNotice")
);
const EditNotice = React.lazy(() =>
  import("./features/admin/notices/EditNotice")
);

// Admin Complaints Management Pages
const ComplaintsList = React.lazy(() =>
  import("./features/admin/complaints/ComplaintsList")
);
const ComplaintDetail = React.lazy(() =>
  import("./features/admin/complaints/ComplaintDetail")
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <React.Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              }
            >
              <Routes>
                {/* Public Routes */}
                <Route path={ROUTES.HOME} element={<LandingPage />} />
                <Route path={ROUTES.LOGIN} element={<StudentLogin />} />
                <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
                <Route
                  path={ROUTES.ADMIN_REGISTER}
                  element={<AdminRegister />}
                />
                <Route path={ROUTES.REGISTER} element={<StudentRegister />} />

                {/* Admin Routes */}
                <Route
                  path={ROUTES.ADMIN_DASHBOARD}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Student Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.STUDENTS}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <StudentList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.STUDENTS}/create`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <CreateStudent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.STUDENTS}/edit/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <EditStudent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.STUDENTS}/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <StudentDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.STUDENTS}/import`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <BulkImportStudents />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Teacher Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.TEACHERS}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <TeacherList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.TEACHERS}/create`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <CreateTeacher />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.TEACHERS}/edit/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <EditTeacher />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.TEACHERS}/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <TeacherDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Course Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.COURSES}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <CourseList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.COURSES}/create`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <CreateCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.COURSES}/edit/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <EditCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.COURSES}/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <CourseDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Sports Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.SPORTS}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <SportsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.SPORTS}/create`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <CreateSport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.SPORTS}/edit/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <EditSport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.SPORTS}/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <SportDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Library Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.LIBRARY}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <BooksList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.LIBRARY}/create`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <CreateBook />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.LIBRARY}/edit/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <EditBook />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.LIBRARY}/transactions`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <LibraryTransactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.LIBRARY}/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <BookDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Attendance Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.ATTENDANCE}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <AttendanceOverview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.ATTENDANCE}/mark`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <MarkAttendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.ATTENDANCE}/report`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <AttendanceReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.ATTENDANCE}/student/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <StudentAttendance />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Results Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.RESULTS}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <ResultsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.RESULTS}/enter`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <EnterResults />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.RESULTS}/report`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <ResultsReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.RESULTS}/student/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <StudentResult />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Notices Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.NOTICES}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <NoticesList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.NOTICES}/create`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <CreateNotice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.NOTICES}/edit/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <EditNotice />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Complaints Management Routes */}
                <Route
                  path={ROUTES.ADMIN_ROUTES.COMPLAINTS}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <ComplaintsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${ROUTES.ADMIN_ROUTES.COMPLAINTS}/:id`}
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        ROLES.ADMIN,
                        ROLES.PRINCIPAL,
                        ROLES.SUPER_ADMIN,
                      ]}
                    >
                      <ComplaintDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path={ROUTES.STUDENT_DASHBOARD}
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Route */}
                <Route
                  path="*"
                  element={<Navigate to={ROUTES.HOME} replace />}
                />
              </Routes>
            </React.Suspense>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
