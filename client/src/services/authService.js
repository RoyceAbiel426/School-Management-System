import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "./api";

/**
 * Auth Service
 * Handles all authentication related API calls
 */

/**
 * Admin authentication
 */
export const adminAuth = {
  register: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.ADMIN_REGISTER,
      data
    );
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.ADMIN_LOGIN,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminData", JSON.stringify(response.data.admin));
    }
    return response.data;
  },
};

/**
 * Student authentication
 */
export const studentAuth = {
  register: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.STUDENT_REGISTER,
      data
    );
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.STUDENT_LOGIN,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("studentToken", response.data.token);
      localStorage.setItem(
        "studentData",
        JSON.stringify(response.data.student)
      );
    }
    return response.data;
  },
};

/**
 * Teacher authentication
 */
export const teacherAuth = {
  register: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.TEACHER_REGISTER,
      data
    );
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.TEACHER_LOGIN,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("teacherToken", response.data.token);
      localStorage.setItem(
        "teacherData",
        JSON.stringify(response.data.teacher)
      );
    }
    return response.data;
  },
};

/**
 * Coach authentication
 */
export const coachAuth = {
  register: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.COACH_REGISTER,
      data
    );
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.COACH_LOGIN,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("coachToken", response.data.token);
      localStorage.setItem("coachData", JSON.stringify(response.data.coach));
    }
    return response.data;
  },
};

/**
 * Librarian authentication
 */
export const librarianAuth = {
  register: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.LIBRARIAN_REGISTER,
      data
    );
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.LIBRARIAN_LOGIN,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("librarianToken", response.data.token);
      localStorage.setItem(
        "librarianData",
        JSON.stringify(response.data.librarian)
      );
    }
    return response.data;
  },
};

/**
 * Logout (clears all tokens)
 */
export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("studentToken");
  localStorage.removeItem("teacherToken");
  localStorage.removeItem("coachToken");
  localStorage.removeItem("librarianToken");
  localStorage.removeItem("adminData");
  localStorage.removeItem("studentData");
  localStorage.removeItem("teacherData");
  localStorage.removeItem("coachData");
  localStorage.removeItem("librarianData");
};

/**
 * Get current user data
 */
export const getCurrentUser = () => {
  const adminData = localStorage.getItem("adminData");
  const studentData = localStorage.getItem("studentData");
  const teacherData = localStorage.getItem("teacherData");
  const coachData = localStorage.getItem("coachData");
  const librarianData = localStorage.getItem("librarianData");

  if (adminData) return { ...JSON.parse(adminData), role: "admin" };
  if (studentData) return { ...JSON.parse(studentData), role: "student" };
  if (teacherData) return { ...JSON.parse(teacherData), role: "teacher" };
  if (coachData) return { ...JSON.parse(coachData), role: "coach" };
  if (librarianData) return { ...JSON.parse(librarianData), role: "librarian" };

  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!(
    localStorage.getItem("adminToken") ||
    localStorage.getItem("studentToken") ||
    localStorage.getItem("teacherToken") ||
    localStorage.getItem("coachToken") ||
    localStorage.getItem("librarianToken")
  );
};

/**
 * Get user role
 */
export const getUserRole = () => {
  if (localStorage.getItem("adminToken")) return "admin";
  if (localStorage.getItem("studentToken")) return "student";
  if (localStorage.getItem("teacherToken")) return "teacher";
  if (localStorage.getItem("coachToken")) return "coach";
  if (localStorage.getItem("librarianToken")) return "librarian";
  return null;
};
