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

// Student Authentication (with strict rate limiting)
router.post("/student/login", strictRateLimiter, loginStudent);
router.post("/student/register", strictRateLimiter, registerStudent);

// Admin Authentication (with strict rate limiting)
router.post("/admin/register", strictRateLimiter, registerAdmin);
router.post("/admin/login", strictRateLimiter, adminLogin);

// Teacher Authentication (with strict rate limiting)
router.post("/teacher/login", strictRateLimiter, teacherLogin);

export default router;
