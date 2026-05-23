import express from "express";
import {
  assignModuleToCourse,
  createModule,
  deleteModule,
  getModuleById,
  getModules,
  updateModule,
} from "../controllers/moduleController.js";
import { adminAuth, authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/modules:
 *   post:
 *     tags: [Modules]
 *     summary: Create module
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
 *         description: Module created
 *   get:
 *     tags: [Modules]
 *     summary: List modules
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course id
 *       - in: query
 *         name: grade
 *         schema:
 *           type: string
 *         description: Filter by grade
 *     responses:
 *       200:
 *         description: Module list
 *
 * /api/v1/modules/{id}:
 *   get:
 *     tags: [Modules]
 *     summary: Get module by id
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
 *         description: Module details
 *   put:
 *     tags: [Modules]
 *     summary: Update module by id
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
 *         description: Module updated
 *   delete:
 *     tags: [Modules]
 *     summary: Delete module by id
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
 *         description: Module deleted
 *
 * /api/v1/modules/{id}/assign-course:
 *   post:
 *     tags: [Modules]
 *     summary: Assign module to course
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
 *         description: Module assigned to course
 */

// Module Management (Admin only)
router.post("/", adminAuth, createModule);
router.get("/", authMiddleware, getModules);
router.get("/:id", authMiddleware, getModuleById);
router.put("/:id", adminAuth, updateModule);
router.delete("/:id", adminAuth, deleteModule);

// Module-Course Assignment
router.post("/:id/assign-course", adminAuth, assignModuleToCourse);

export default router;
