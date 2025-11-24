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
const StudentLogin = React.lazy(() => import("./components/StudentLogin"));
const StudentRegister = React.lazy(() =>
  import("./components/StudentRegister")
);
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard"));

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
