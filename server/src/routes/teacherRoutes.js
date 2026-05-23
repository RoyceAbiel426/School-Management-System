import express from "express";
import {
  deleteTeacher,
  deleteTeachers,
  deleteTeachersByClass,
  getTeacherDetail,
  getTeachers,
  teacherAttendance,
  teacherRegister,
  updateTeacherSubject,
} from "../controllers/teacherController.js";
import { adminAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/teachers/register:
 *   post:
 *     tags: [Teachers]
 *     summary: Register a teacher
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
 *         description: Teacher registered
 *
 * /api/v1/teachers/school/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: List teachers by school
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
 *         description: Teachers list
 *   delete:
 *     tags: [Teachers]
 *     summary: Delete all teachers by school
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
 *         description: Teachers deleted
 *
 * /api/v1/teachers/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: Get teacher details
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
 *         description: Teacher details
 *   delete:
 *     tags: [Teachers]
 *     summary: Delete teacher by id
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
 *         description: Teacher deleted
 *
 * /api/v1/teachers/{id}/subject:
 *   put:
 *     tags: [Teachers]
 *     summary: Update teacher subject
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
 *         description: Subject updated
 *
 * /api/v1/teachers/class/{id}:
 *   delete:
 *     tags: [Teachers]
 *     summary: Delete all teachers by class
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
 *         description: Class teachers deleted
 *
 * /api/v1/teachers/{id}/attendance:
 *   post:
 *     tags: [Teachers]
 *     summary: Mark teacher attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Attendance recorded
 */

// Teacher Registration (Admin only - Login handled in authRoutes)
router.post("/register", adminAuth, teacherRegister);

// Teacher Management (Admin only)
router.get("/school/:id", adminAuth, getTeachers);
router.get("/:id", requireRole("admin", "teacher"), getTeacherDetail);
router.put("/:id/subject", adminAuth, updateTeacherSubject);
router.delete("/:id", adminAuth, deleteTeacher);
router.delete("/school/:id", adminAuth, deleteTeachers);
router.delete("/class/:id", adminAuth, deleteTeachersByClass);

// Teacher Attendance (Self-tracking or Admin)
router.post(
  "/:id/attendance",
  requireRole("admin", "teacher"),
  teacherAttendance,
);

export default router;
