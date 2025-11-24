import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import {
  logout as authLogout,
  isAuthenticated as checkAuth,
  getCurrentUser,
  getUserRole,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (checkAuth()) {
        const currentUser = getCurrentUser();
        const userRole = getUserRole();
        setUser(currentUser);
        setRole(userRole);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, userRole, token) => {
    setUser(userData);
    setRole(userRole);

    // Store in localStorage
    if (userRole === "admin") {
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminData", JSON.stringify(userData));
    } else if (userRole === "student") {
      localStorage.setItem("studentToken", token);
      localStorage.setItem("studentData", JSON.stringify(userData));
    } else if (userRole === "teacher") {
      localStorage.setItem("teacherToken", token);
      localStorage.setItem("teacherData", JSON.stringify(userData));
    } else if (userRole === "coach") {
      localStorage.setItem("coachToken", token);
      localStorage.setItem("coachData", JSON.stringify(userData));
    }
  };

  const logout = () => {
    handleLogout();
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setRole(null);
    navigate(ROUTES.HOME);
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

  const isAuthenticated = checkAuth();

  const value = {
    user,
    role,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
