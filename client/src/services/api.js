import axios from "axios";

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Add auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage based on user role
    const adminToken = localStorage.getItem("adminToken");
    const studentToken = localStorage.getItem("studentToken");
    const teacherToken = localStorage.getItem("teacherToken");
    const coachToken = localStorage.getItem("coachToken");

    // Add token to headers if exists
    const token = adminToken || studentToken || teacherToken || coachToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle errors globally
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear all tokens and redirect to login
      localStorage.removeItem("adminToken");
      localStorage.removeItem("studentToken");
      localStorage.removeItem("teacherToken");
      localStorage.removeItem("coachToken");
      localStorage.removeItem("adminData");
      localStorage.removeItem("studentData");
      localStorage.removeItem("teacherData");
      localStorage.removeItem("coachData");

      // Redirect to login
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("Resource not found:", error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Generic request methods
 */
export const apiClient = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),
};

export default api;
