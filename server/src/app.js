import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import rateLimiter from "./middlewares/rateLimiter.js";

// Import route files
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import classGroupRoutes from "./routes/classGroupRoutes.js";
import complainRoutes from "./routes/complainRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

// Initialize Express application
const app = express();

// =====================
// Security Middleware
// =====================
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// =====================
// CORS Configuration
// =====================
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// =====================
// Body Parsing Middleware
// =====================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================
// Rate Limiting
// =====================
app.use(rateLimiter);

// =====================
// Request Logging (Development Only)
// =====================
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// =====================
// Health Check & Root Endpoints
// =====================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Edu-Pro School Management System API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api/v1",
      documentation: "/api/v1/docs",
    },
  });
});

// =====================
// API Routes (v1)
// =====================

// Authentication routes (public)
app.use("/api/v1/auth", authRoutes);

// Admin routes (protected - admin only)
app.use("/api/v1/admin", adminRoutes);

// Student routes (protected - student only)
app.use("/api/v1/students", studentRoutes);

// Teacher routes (protected - admin/teacher)
app.use("/api/v1/teachers", teacherRoutes);

// Class Group routes (protected - admin/teacher/student view)
app.use("/api/v1/classgroups", classGroupRoutes);

// Notice routes (protected - all authenticated users)
app.use("/api/v1/notices", noticeRoutes);

// Complaint routes (protected - all authenticated users)
app.use("/api/v1/complaints", complainRoutes);

// Module routes (protected - admin/teacher view)
app.use("/api/v1/modules", moduleRoutes);

// Library routes (protected - admin/student view)
app.use("/api/v1/library", libraryRoutes);

// =====================
// Error Handling
// =====================

// 404 handler for undefined routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Export the Express application
export default app;
