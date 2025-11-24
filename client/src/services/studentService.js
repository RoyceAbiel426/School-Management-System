import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "./api";

/**
 * Student Service
 * Handles all student-related API calls
 */

export const studentService = {
  /**
   * Dashboard
   */
  getDashboard: async (studentId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.STUDENT.DASHBOARD(studentId)
    );
    return response.data;
  },

  /**
   * Profile
   */
  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.PROFILE);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put(API_ENDPOINTS.STUDENT.PROFILE, data);
    return response.data;
  },

  /**
   * Courses
   */
  getCourses: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.COURSES);
    return response.data;
  },

  enrollCourse: async (courseId) => {
    const response = await apiClient.post(API_ENDPOINTS.STUDENT.ENROLL_COURSE, {
      courseId,
    });
    return response.data;
  },

  /**
   * Sports
   */
  getSports: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.SPORTS);
    return response.data;
  },

  joinSport: async (sportId) => {
    const response = await apiClient.post(API_ENDPOINTS.STUDENT.JOIN_SPORT, {
      sportId,
    });
    return response.data;
  },

  /**
   * Attendance
   */
  getAttendance: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.ATTENDANCE, {
      params,
    });
    return response.data;
  },

  /**
   * Results
   */
  getResults: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.RESULTS, {
      params,
    });
    return response.data;
  },
};

export default studentService;
