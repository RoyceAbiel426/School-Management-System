import express from "express";
import {
  createClassGroup,
  deleteClassGroup,
  deleteClassGroups,
  getClassGroupDetail,
  getClassGroups,
  getClassGroupStudents,
  updateClassGroup,
} from "../controllers/classGroupController.js";
import { adminAuth, authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/classgroups:
 *   post:
 *     tags: [ClassGroups]
 *     summary: Create class group
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
 *         description: Class group created
 *
 * /api/v1/classgroups/school/{id}:
 *   get:
 *     tags: [ClassGroups]
 *     summary: List class groups by school
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: grade
 *         schema:
 *           type: string
 *         description: Optional grade filter
 *     responses:
 *       200:
 *         description: Class group list
 *   delete:
 *     tags: [ClassGroups]
 *     summary: Delete class groups by school
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
 *         description: Class groups deleted
 *
 * /api/v1/classgroups/{id}:
 *   get:
 *     tags: [ClassGroups]
 *     summary: Get class group details
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
 *         description: Class group details
 *   put:
 *     tags: [ClassGroups]
 *     summary: Update class group
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
 *         description: Class group updated
 *   delete:
 *     tags: [ClassGroups]
 *     summary: Delete class group
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
 *         description: Class group deleted
 *
 * /api/v1/classgroups/{id}/students:
 *   get:
 *     tags: [ClassGroups]
 *     summary: List students in class group
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
 *         description: Class group students
 */

// Class Group Management (Admin only)
router.post("/", adminAuth, createClassGroup);
router.get("/school/:id", adminAuth, getClassGroups);
router.get("/:id", authMiddleware, getClassGroupDetail);
router.get("/:id/students", authMiddleware, getClassGroupStudents);
router.put("/:id", adminAuth, updateClassGroup);
router.delete("/:id", adminAuth, deleteClassGroup);
router.delete("/school/:id", adminAuth, deleteClassGroups);

export default router;
