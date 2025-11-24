import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "./api";

/**
 * Admin Service
 * Handles all admin-related API calls
 */

export const adminService = {
  /**
   * Dashboard
   */
  getDashboard: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },

  /**
   * School Profile
   */
  getSchoolProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SCHOOL_PROFILE);
    return response.data;
  },

  createSchoolProfile: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.ADMIN.SCHOOL_PROFILE,
      data
    );
    return response.data;
  },

  updateSchoolProfile: async (data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.SCHOOL_PROFILE,
      data
    );
    return response.data;
  },

  /**
   * Students
   */
  getAllStudents: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.STUDENTS, {
      params,
    });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id));
    return response.data;
  },

  createStudent: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.STUDENTS, data);
    return response.data;
  },

  updateStudent: async (id, data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id)
    );
    return response.data;
  },

  /**
   * Courses
   */
  getAllCourses: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.COURSES, {
      params,
    });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.COURSE_BY_ID(id));
    return response.data;
  },

  createCourse: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.COURSES, data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.COURSE_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ADMIN.COURSE_BY_ID(id)
    );
    return response.data;
  },

  /**
   * Sports
   */
  getAllSports: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SPORTS, {
      params,
    });
    return response.data;
  },

  getSportById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SPORT_BY_ID(id));
    return response.data;
  },

  createSport: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.SPORTS, data);
    return response.data;
  },

  updateSport: async (id, data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.SPORT_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteSport: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ADMIN.SPORT_BY_ID(id)
    );
    return response.data;
  },

  /**
   * Library / Books
   */
  getAllBooks: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.BOOKS, { params });
    return response.data;
  },

  getBookById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.BOOK_BY_ID(id));
    return response.data;
  },

  createBook: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.BOOKS, data);
    return response.data;
  },

  updateBook: async (id, data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.BOOK_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.ADMIN.BOOK_BY_ID(id));
    return response.data;
  },

  /**
   * Attendance
   */
  getAllAttendance: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ATTENDANCE, {
      params,
    });
    return response.data;
  },

  createAttendance: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.ATTENDANCE, data);
    return response.data;
  },

  updateAttendance: async (id, data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.ATTENDANCE_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteAttendance: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ADMIN.ATTENDANCE_BY_ID(id)
    );
    return response.data;
  },

  /**
   * Results
   */
  getAllResults: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.RESULTS, {
      params,
    });
    return response.data;
  },

  createResult: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.RESULTS, data);
    return response.data;
  },

  updateResult: async (id, data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.RESULT_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteResult: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ADMIN.RESULT_BY_ID(id)
    );
    return response.data;
  },

  /**
   * Coaches
   */
  getAllCoaches: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.COACHES, {
      params,
    });
    return response.data;
  },

  getCoachById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.COACH_BY_ID(id));
    return response.data;
  },

  createCoach: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.COACHES, data);
    return response.data;
  },

  updateCoach: async (id, data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.COACH_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteCoach: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ADMIN.COACH_BY_ID(id)
    );
    return response.data;
  },

  /**
   * Teachers
   */
  getAllTeachers: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.TEACHERS, {
      params,
    });
    return response.data;
  },

  getTeacherById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.TEACHER_BY_ID(id));
    return response.data;
  },

  updateTeacher: async (id, data) => {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.TEACHER_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteTeacher: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.ADMIN.TEACHER_BY_ID(id)
    );
    return response.data;
  },
};

export default adminService;
