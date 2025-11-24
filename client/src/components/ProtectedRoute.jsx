import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuthContext } from "../context/AuthContext";
import { Loader } from "./common";

/**
 * ProtectedRoute Component
 * Wrapper for routes that require authentication
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted location
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to unauthorized page or their own dashboard
    const dashboardRoute = `/${role}/dashboard`;
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
