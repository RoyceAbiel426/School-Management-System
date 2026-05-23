// routes/studentRoutes.js
import express from "express";
import {
  enrollCourse,
  getAttendance,
  getProfile,
  getResults,
  getStudentDashboardData,
  joinSport,
  updateProfile,
} from "../controllers/studentController.js";
import { studentAuth } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/students/{id}/dashboard:
 *   get:
 *     tags: [Students]
 *     summary: Get student dashboard data
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
 *         description: Student dashboard data
 *
 * /api/v1/students/profile:
 *   get:
 *     tags: [Students]
 *     summary: Get authenticated student profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 *   put:
 *     tags: [Students]
 *     summary: Update authenticated student profile
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
 * /api/v1/students/courses/enroll:
 *   post:
 *     tags: [Students]
 *     summary: Enroll student in a course
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
 *         description: Enrollment successful
 *
 * /api/v1/students/sports/join:
 *   post:
 *     tags: [Students]
 *     summary: Join a sport
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
 *         description: Sport joined
 *
 * /api/v1/students/attendance:
 *   get:
 *     tags: [Students]
 *     summary: Get attendance history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Attendance records
 *
 * /api/v1/students/results:
 *   get:
 *     tags: [Students]
 *     summary: Get student results
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: grade
 *         schema:
 *           type: string
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student results
 */

// Get full dashboard data (courses, sports, books, attendance)
router.get("/:id/dashboard", studentAuth, getStudentDashboardData);

router.get("/profile", studentAuth, getProfile);
router.put("/profile", studentAuth, updateProfile);
router.post("/courses/enroll", studentAuth, enrollCourse);
router.post("/sports/join", studentAuth, joinSport);

// Attendance & Results
router.get("/attendance", studentAuth, getAttendance);
router.get("/results", studentAuth, getResults);

export default router;
