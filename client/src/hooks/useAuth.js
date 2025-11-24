import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import {
  logout as authLogout,
  getCurrentUser,
  getUserRole,
  isAuthenticated,
} from "../services/authService";

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        const userRole = getUserRole();
        setUser(currentUser);
        setRole(userRole);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setRole(null);
    navigate(ROUTES.LOGIN);
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Update localStorage
    if (role === "admin") {
      localStorage.setItem("adminData", JSON.stringify(userData));
    } else if (role === "student") {
      localStorage.setItem("studentData", JSON.stringify(userData));
    } else if (role === "teacher") {
      localStorage.setItem("teacherData", JSON.stringify(userData));
    } else if (role === "coach") {
      localStorage.setItem("coachData", JSON.stringify(userData));
    }
  };

  return {
    user,
    role,
    loading,
    isAuthenticated: isAuthenticated(),
    logout,
    updateUser,
    checkAuth,
  };
};

export default useAuth;
