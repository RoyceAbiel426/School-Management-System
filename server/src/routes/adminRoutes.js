import express from "express";
import {
  createAttendance,
  createBook,
  createCoach,
  createCourse,
  createResult,
  // School Profile
  createSchoolProfile,
  createSport,
  createStudent,
  deleteAttendance,
  deleteBook,
  deleteCoach,
  deleteCourse,
  deleteResult,
  deleteSport,
  deleteStudent,
  // Admin Profile
  getAdminProfile,
  // Attendance
  getAllAttendance,
  // Library
  getAllBooks,
  // Coaches
  getAllCoaches,
  // Courses
  getAllCourses,
  // Results
  getAllResults,
  // Sports
  getAllSports,
  // Students
  getAllStudents,
  getDashboardOverview,
  getSchoolProfile,
  getStudentById,
  updateAdminProfile,
  updateAttendance,
  updateBook,
  updateCoach,
  updateCourse,
  updateResult,
  updateSchoolProfile,
  updateSport,
  updateStudent,
} from "../controllers/adminController.js";
import { adminAuth, checkPermission } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard overview
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics
 *
 * /api/v1/admin/profile:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile details
 *   put:
 *     tags: [Admin]
 *     summary: Update admin profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Profile updated
 *
 * /api/v1/admin/school/profile:
 *   post:
 *     tags: [Admin]
 *     summary: Create school profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: School profile created
 *   put:
 *     tags: [Admin]
 *     summary: Update school profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: School profile updated
 *   get:
 *     tags: [Admin]
 *     summary: Get school profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: School profile details
 *
 * /api/v1/admin/students:
 *   get:
 *     tags: [Admin]
 *     summary: List students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Pagination page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by student status
 *     responses:
 *       200:
 *         description: Students list
 *   post:
 *     tags: [Admin]
 *     summary: Create student
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Student created
 *
 * /api/v1/admin/students/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get student by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details
 *   put:
 *     tags: [Admin]
 *     summary: Update student by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Student updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete student by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted
 *
 * /api/v1/admin/courses:
 *   get:
 *     tags: [Admin]
 *     summary: List courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course list
 *   post:
 *     tags: [Admin]
 *     summary: Create course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Course created
 *
 * /api/v1/admin/courses/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update course by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Course updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete course by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 *
 * /api/v1/admin/sports:
 *   get:
 *     tags: [Admin]
 *     summary: List sports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sports list
 *   post:
 *     tags: [Admin]
 *     summary: Create sport
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Sport created
 *
 * /api/v1/admin/sports/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update sport by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Sport updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete sport by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sport deleted
 *
 * /api/v1/admin/books:
 *   get:
 *     tags: [Admin]
 *     summary: List books
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book list
 *   post:
 *     tags: [Admin]
 *     summary: Create book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Book created
 *
 * /api/v1/admin/books/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update book by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Book updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete book by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *
 * /api/v1/admin/attendance:
 *   get:
 *     tags: [Admin]
 *     summary: List attendance records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by attendance date
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter by student id
 *     responses:
 *       200:
 *         description: Attendance list
 *   post:
 *     tags: [Admin]
 *     summary: Create attendance record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Attendance created
 *
 * /api/v1/admin/attendance/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update attendance by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Attendance updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete attendance by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance deleted
 *
 * /api/v1/admin/results:
 *   get:
 *     tags: [Admin]
 *     summary: List results
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Result list
 *   post:
 *     tags: [Admin]
 *     summary: Create result
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Result created
 *
 * /api/v1/admin/results/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update result by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Result updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete result by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Result deleted
 *
 * /api/v1/admin/coaches:
 *   get:
 *     tags: [Admin]
 *     summary: List coaches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coach list
 *   post:
 *     tags: [Admin]
 *     summary: Create coach
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Coach created
 *
 * /api/v1/admin/coaches/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update coach by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Coach updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete coach by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coach deleted
 */

// Dashboard (Admin only)
router.get("/dashboard", adminAuth, getDashboardOverview);

// Admin Profile Management
router.get("/profile", adminAuth, getAdminProfile);
router.put("/profile", adminAuth, updateAdminProfile);

// School Profile Management
router.post("/school/profile", adminAuth, createSchoolProfile);
router.put("/school/profile", adminAuth, updateSchoolProfile);
router.get("/school/profile", adminAuth, getSchoolProfile);

// Students Routes
router.get(
  "/students",
  adminAuth,
  checkPermission("students", "view"),
  getAllStudents,
);
router.get(
  "/students/:id",
  adminAuth,
  checkPermission("students", "view"),
  getStudentById,
);
router.post(
  "/students",
  adminAuth,
  checkPermission("students", "create"),
  createStudent,
);
router.put(
  "/students/:id",
  adminAuth,
  checkPermission("students", "edit"),
  updateStudent,
);
router.delete(
  "/students/:id",
  adminAuth,
  checkPermission("students", "delete"),
  deleteStudent,
);

// Courses Routes
router.get(
  "/courses",
  adminAuth,
  checkPermission("courses", "view"),
  getAllCourses,
);
router.post(
  "/courses",
  adminAuth,
  checkPermission("courses", "create"),
  createCourse,
);
router.put(
  "/courses/:id",
  adminAuth,
  checkPermission("courses", "edit"),
  updateCourse,
);
router.delete(
  "/courses/:id",
  adminAuth,
  checkPermission("courses", "delete"),
  deleteCourse,
);

// Sports Routes
router.get(
  "/sports",
  adminAuth,
  checkPermission("sports", "view"),
  getAllSports,
);
router.post(
  "/sports",
  adminAuth,
  checkPermission("sports", "create"),
  createSport,
);
router.put(
  "/sports/:id",
  adminAuth,
  checkPermission("sports", "edit"),
  updateSport,
);
router.delete(
  "/sports/:id",
  adminAuth,
  checkPermission("sports", "delete"),
  deleteSport,
);

// Library Routes
router.get(
  "/books",
  adminAuth,
  checkPermission("library", "view"),
  getAllBooks,
);
router.post(
  "/books",
  adminAuth,
  checkPermission("library", "create"),
  createBook,
);
router.put(
  "/books/:id",
  adminAuth,
  checkPermission("library", "edit"),
  updateBook,
);
router.delete(
  "/books/:id",
  adminAuth,
  checkPermission("library", "delete"),
  deleteBook,
);

// Attendance Routes
router.get(
  "/attendance",
  adminAuth,
  checkPermission("attendance", "view"),
  getAllAttendance,
);
router.post(
  "/attendance",
  adminAuth,
  checkPermission("attendance", "create"),
  createAttendance,
);
router.put(
  "/attendance/:id",
  adminAuth,
  checkPermission("attendance", "edit"),
  updateAttendance,
);
router.delete(
  "/attendance/:id",
  adminAuth,
  checkPermission("attendance", "delete"),
  deleteAttendance,
);

// Results Routes
router.get(
  "/results",
  adminAuth,
  checkPermission("results", "view"),
  getAllResults,
);
router.post(
  "/results",
  adminAuth,
  checkPermission("results", "create"),
  createResult,
);
router.put(
  "/results/:id",
  adminAuth,
  checkPermission("results", "edit"),
  updateResult,
);
router.delete(
  "/results/:id",
  adminAuth,
  checkPermission("results", "delete"),
  deleteResult,
);

// Coaches Routes
router.get(
  "/coaches",
  adminAuth,
  checkPermission("coaches", "view"),
  getAllCoaches,
);
router.post(
  "/coaches",
  adminAuth,
  checkPermission("coaches", "create"),
  createCoach,
);
router.put(
  "/coaches/:id",
  adminAuth,
  checkPermission("coaches", "edit"),
  updateCoach,
);
router.delete(
  "/coaches/:id",
  adminAuth,
  checkPermission("coaches", "delete"),
  deleteCoach,
);

export default router;
