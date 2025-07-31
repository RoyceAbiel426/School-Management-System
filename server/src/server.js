import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimiter from './middlewares/rateLimiter.js';
import { connectDB } from "./config/connectDB.js";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Validate environment variables
const requiredEnvVars = ["PORT", "MONGO_URL", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length) {
  console.error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl 
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    message: isDevelopment ? err.message : "Internal server error",
    ...(isDevelopment && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });