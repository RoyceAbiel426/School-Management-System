import express from "express";
import {
  createNotice,
  deleteNotice,
  deleteNotices,
  getNoticeById,
  getNotices,
  updateNotice,
} from "../controllers/noticeController.js";
import { adminAuth, authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/notices:
 *   post:
 *     tags: [Notices]
 *     summary: Create notice
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
 *         description: Notice created
 *
 * /api/v1/notices/school/{id}:
 *   get:
 *     tags: [Notices]
 *     summary: List notices by school
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
 *         description: Notices list
 *   delete:
 *     tags: [Notices]
 *     summary: Delete notices by school
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
 *         description: Notices deleted
 *
 * /api/v1/notices/{id}:
 *   get:
 *     tags: [Notices]
 *     summary: Get notice by id
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
 *         description: Notice details
 *   put:
 *     tags: [Notices]
 *     summary: Update notice by id
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
 *         description: Notice updated
 *   delete:
 *     tags: [Notices]
 *     summary: Delete notice by id
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
 *         description: Notice deleted
 */

// Notice Management
router.post("/", authMiddleware, createNotice); // Admin, Teacher (with role check)
router.get("/school/:id", authMiddleware, getNotices); // All authenticated users
router.get("/:id", authMiddleware, getNoticeById);
router.put("/:id", authMiddleware, updateNotice); // Admin, Notice creator
router.delete("/:id", adminAuth, deleteNotice); // Admin only
router.delete("/school/:id", adminAuth, deleteNotices); // Admin only

export default router;
