// routes/authRoutes.js
import express from "express";
import { adminLogin, registerAdmin } from "../controllers/adminController.js";
import {
  loginStudent,
  registerStudent,
} from "../controllers/studentAuthController.js";
import { teacherLogin } from "../controllers/teacherController.js";
import { strictRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/student/login:
 *   post:
 *     tags: [Auth]
 *     summary: Student login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/auth/student/register:
 *   post:
 *     tags: [Auth]
 *     summary: Student registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Student registered
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/auth/admin/register:
 *   post:
 *     tags: [Auth]
 *     summary: Admin registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Admin registered
 *
 * /api/v1/auth/admin/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *
 * /api/v1/auth/teacher/login:
 *   post:
 *     tags: [Auth]
 *     summary: Teacher login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

// Student Authentication (with strict rate limiting)
router.post("/student/login", strictRateLimiter, loginStudent);
router.post("/student/register", strictRateLimiter, registerStudent);

// Admin Authentication (with strict rate limiting)
router.post("/admin/register", strictRateLimiter, registerAdmin);
router.post("/admin/login", strictRateLimiter, adminLogin);

// Teacher Authentication (with strict rate limiting)
router.post("/teacher/login", strictRateLimiter, teacherLogin);

export default router;
