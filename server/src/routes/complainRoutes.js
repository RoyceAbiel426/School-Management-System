import express from "express";
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complainController.js";
import { adminAuth, authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/complaints:
 *   post:
 *     tags: [Complaints]
 *     summary: Create complaint
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
 *         description: Complaint created
 *
 * /api/v1/complaints/school/{id}:
 *   get:
 *     tags: [Complaints]
 *     summary: List complaints by school
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
 *         description: Complaints list
 *
 * /api/v1/complaints/{id}:
 *   get:
 *     tags: [Complaints]
 *     summary: Get complaint by id
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
 *         description: Complaint details
 *   delete:
 *     tags: [Complaints]
 *     summary: Delete complaint by id
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
 *         description: Complaint deleted
 *
 * /api/v1/complaints/{id}/status:
 *   put:
 *     tags: [Complaints]
 *     summary: Update complaint status
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
 *         description: Complaint status updated
 */

// Complaint Management
router.post("/", authMiddleware, createComplaint); // All authenticated users
router.get("/school/:id", adminAuth, getComplaints); // Admin only
router.get("/:id", authMiddleware, getComplaintById); // User can view their own
router.put("/:id/status", adminAuth, updateComplaintStatus); // Admin only
router.delete("/:id", adminAuth, deleteComplaint); // Admin only

export default router;
