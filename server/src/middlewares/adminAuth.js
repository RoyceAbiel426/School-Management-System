import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminAuthMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, adminID, role }
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin role required" });
    }

    // Verify admin still exists and is active
    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.status !== "active") {
      return res.status(401).json({ message: "Admin account not found or inactive" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Error in adminAuthMiddleware:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check specific permissions
export const checkPermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Admin authentication required" });
    }

    if (!req.admin.hasPermission(resource, action)) {
      return res.status(403).json({ 
        message: `Access denied: ${action} permission required for ${resource}` 
      });
    }

    next();
  };
}; 