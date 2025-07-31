import express from "express";
import {
  adminLogin,
  getDashboardOverview,
  // Students
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  // Courses
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  // Sports
  getAllSports,
  createSport,
  updateSport,
  deleteSport,
  // Library
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  // Attendance
  getAllAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  // Results
  getAllResults,
  createResult,
  updateResult,
  deleteResult,
  // Coaches
  getAllCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
} from "../controllers/adminController.js";
import { adminAuthMiddleware, checkPermission } from "../middlewares/adminAuth.js";

const router = express.Router();

// Admin Authentication
router.post("/login", adminLogin);

// Dashboard
router.get("/dashboard", adminAuthMiddleware, getDashboardOverview);

// Students Routes
router.get("/students", adminAuthMiddleware, checkPermission("students", "view"), getAllStudents);
router.get("/students/:id", adminAuthMiddleware, checkPermission("students", "view"), getStudentById);
router.post("/students", adminAuthMiddleware, checkPermission("students", "create"), createStudent);
router.put("/students/:id", adminAuthMiddleware, checkPermission("students", "edit"), updateStudent);
router.delete("/students/:id", adminAuthMiddleware, checkPermission("students", "delete"), deleteStudent);

// Courses Routes
router.get("/courses", adminAuthMiddleware, checkPermission("courses", "view"), getAllCourses);
router.post("/courses", adminAuthMiddleware, checkPermission("courses", "create"), createCourse);
router.put("/courses/:id", adminAuthMiddleware, checkPermission("courses", "edit"), updateCourse);
router.delete("/courses/:id", adminAuthMiddleware, checkPermission("courses", "delete"), deleteCourse);

// Sports Routes
router.get("/sports", adminAuthMiddleware, checkPermission("sports", "view"), getAllSports);
router.post("/sports", adminAuthMiddleware, checkPermission("sports", "create"), createSport);
router.put("/sports/:id", adminAuthMiddleware, checkPermission("sports", "edit"), updateSport);
router.delete("/sports/:id", adminAuthMiddleware, checkPermission("sports", "delete"), deleteSport);

// Library Routes
router.get("/books", adminAuthMiddleware, checkPermission("library", "view"), getAllBooks);
router.post("/books", adminAuthMiddleware, checkPermission("library", "create"), createBook);
router.put("/books/:id", adminAuthMiddleware, checkPermission("library", "edit"), updateBook);
router.delete("/books/:id", adminAuthMiddleware, checkPermission("library", "delete"), deleteBook);

// Attendance Routes
router.get("/attendance", adminAuthMiddleware, checkPermission("attendance", "view"), getAllAttendance);
router.post("/attendance", adminAuthMiddleware, checkPermission("attendance", "create"), createAttendance);
router.put("/attendance/:id", adminAuthMiddleware, checkPermission("attendance", "edit"), updateAttendance);
router.delete("/attendance/:id", adminAuthMiddleware, checkPermission("attendance", "delete"), deleteAttendance);

// Results Routes
router.get("/results", adminAuthMiddleware, checkPermission("results", "view"), getAllResults);
router.post("/results", adminAuthMiddleware, checkPermission("results", "create"), createResult);
router.put("/results/:id", adminAuthMiddleware, checkPermission("results", "edit"), updateResult);
router.delete("/results/:id", adminAuthMiddleware, checkPermission("results", "delete"), deleteResult);

// Coaches Routes
router.get("/coaches", adminAuthMiddleware, checkPermission("coaches", "view"), getAllCoaches);
router.post("/coaches", adminAuthMiddleware, checkPermission("coaches", "create"), createCoach);
router.put("/coaches/:id", adminAuthMiddleware, checkPermission("coaches", "edit"), updateCoach);
router.delete("/coaches/:id", adminAuthMiddleware, checkPermission("coaches", "delete"), deleteCoach);

export default router; 