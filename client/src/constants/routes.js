/**
 * Application routes
 */
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Auth routes
  ADMIN_LOGIN: "/admin/login",
  STUDENT_LOGIN: "/student/login",
  TEACHER_LOGIN: "/teacher/login",
  COACH_LOGIN: "/coach/login",
  LIBRARIAN_LOGIN: "/librarian/login",
  STUDENT_REGISTER: "/student/register",
  TEACHER_REGISTER: "/teacher/register",
  COACH_REGISTER: "/coach/register",
  LIBRARIAN_REGISTER: "/librarian/register",

  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PROFILE: "/admin/profile",
  ADMIN_SCHOOL_PROFILE: "/admin/school-profile",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_STUDENTS_CREATE: "/admin/students/create",
  ADMIN_STUDENTS_EDIT: "/admin/students/:id/edit",
  ADMIN_STUDENTS_VIEW: "/admin/students/:id",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_COURSES_CREATE: "/admin/courses/create",
  ADMIN_COURSES_EDIT: "/admin/courses/:id/edit",
  ADMIN_SPORTS: "/admin/sports",
  ADMIN_SPORTS_CREATE: "/admin/sports/create",
  ADMIN_LIBRARY: "/admin/library",
  ADMIN_LIBRARY_CREATE: "/admin/library/create",
  ADMIN_ATTENDANCE: "/admin/attendance",
  ADMIN_RESULTS: "/admin/results",
  ADMIN_NOTICES: "/admin/notices",
  ADMIN_COMPLAINTS: "/admin/complaints",
  ADMIN_TEACHERS: "/admin/teachers",
  ADMIN_COACHES: "/admin/coaches",

  // Admin route shortcuts (for nested routes)
  ADMIN_ROUTES: {
    STUDENTS: "/admin/students",
    TEACHERS: "/admin/teachers",
    COURSES: "/admin/courses",
    SPORTS: "/admin/sports",
    LIBRARY: "/admin/library",
    ATTENDANCE: "/admin/attendance",
    RESULTS: "/admin/results",
    NOTICES: "/admin/notices",
    COMPLAINTS: "/admin/complaints",
  },

  // Student routes
  STUDENT_DASHBOARD: "/student/dashboard",
  STUDENT_PROFILE: "/student/profile",
  STUDENT_COURSES: "/student/courses",
  STUDENT_ATTENDANCE: "/student/attendance",
  STUDENT_RESULTS: "/student/results",
  STUDENT_SPORTS: "/student/sports",
  STUDENT_LIBRARY: "/student/library",
  STUDENT_NOTICES: "/student/notices",
  STUDENT_COMPLAINTS: "/student/complaints",

  // Teacher routes
  TEACHER_DASHBOARD: "/teacher/dashboard",
  TEACHER_PROFILE: "/teacher/profile",
  TEACHER_CLASSES: "/teacher/classes",
  TEACHER_ATTENDANCE: "/teacher/attendance",
  TEACHER_RESULTS: "/teacher/results",
  TEACHER_NOTICES: "/teacher/notices",

  // Coach routes
  COACH_DASHBOARD: "/coach/dashboard",
  COACH_PROFILE: "/coach/profile",
  COACH_SPORTS: "/coach/sports",
  COACH_PARTICIPANTS: "/coach/participants",
  COACH_EVENTS: "/coach/events",
  COACH_PERFORMANCE: "/coach/performance",

  // Librarian routes
  LIBRARIAN_DASHBOARD: "/librarian/dashboard",
  LIBRARIAN_PROFILE: "/librarian/profile",
  LIBRARIAN_BOOKS: "/librarian/books",
  LIBRARIAN_BOOKS_CREATE: "/librarian/books/create",
  LIBRARIAN_BOOKS_EDIT: "/librarian/books/:id/edit",
  LIBRARIAN_TRANSACTIONS: "/librarian/transactions",
  LIBRARIAN_ISSUE: "/librarian/issue",
  LIBRARIAN_RETURN: "/librarian/return",
  LIBRARIAN_OVERDUE: "/librarian/overdue",
  LIBRARIAN_STATS: "/librarian/stats",

  // Error routes
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/401",
  SERVER_ERROR: "/500",
};

/**
 * Get route with params
 * @param {string} route - Route template
 * @param {Object} params - Route parameters
 * @returns {string} - Route with replaced params
 */
export const getRoute = (route, params = {}) => {
  let path = route;
  Object.keys(params).forEach((key) => {
    path = path.replace(`:${key}`, params[key]);
  });
  return path;
};
