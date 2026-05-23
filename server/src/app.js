import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
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
  }),
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
  }),
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
/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     description: Returns service health information.
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 environment:
 *                   type: string
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

/**
 * @openapi
 * /:
 *   get:
 *     tags: [System]
 *     summary: API root metadata
 *     responses:
 *       200:
 *         description: API metadata
 */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Edu-Pro School Management System API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api/v1",
      documentation: "/api-docs",
    },
  });
});

/**
 * @openapi
 * /api/v1:
 *   get:
 *     tags: [System]
 *     summary: API v1 index
 *     responses:
 *       200:
 *         description: v1 endpoint map
 */
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API v1 is running",
    version: "v1",
    endpoints: {
      auth: "/api/v1/auth",
      admin: "/api/v1/admin",
      students: "/api/v1/students",
      teachers: "/api/v1/teachers",
      classgroups: "/api/v1/classgroups",
      notices: "/api/v1/notices",
      complaints: "/api/v1/complaints",
      modules: "/api/v1/modules",
      library: "/api/v1/library",
    },
  });
});

/**
 * @openapi
 * /api/v1/docs:
 *   get:
 *     tags: [System]
 *     summary: Legacy docs metadata endpoint
 *     description: Returns pointers to documentation. Interactive docs are served at /api-docs.
 *     responses:
 *       200:
 *         description: Documentation metadata
 */
app.get("/api/v1/docs", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API documentation endpoint",
    note: "Refer to project docs for full request/response schemas.",
    docsPath: "/api-docs",
  });
});

// Suppress browser favicon requests from hitting the global 404 handler.
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Suppress Socket.IO polling probe requests when Socket.IO server is not enabled.
app.use("/socket.io", (req, res) => {
  res.status(204).end();
});

app.use(
  "/api-docs",
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "School Management API Docs",
  }),
);

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
