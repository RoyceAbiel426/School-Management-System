import express from "express";
import {
  calculateFine,
  getLibraryTransactions,
  getStudentTransactions,
  issueBook,
  returnBook,
  updateFine,
} from "../controllers/libraryController.js";
import { adminAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/library/issue:
 *   post:
 *     tags: [Library]
 *     summary: Issue book to student
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
 *         description: Book issued
 *
 * /api/v1/library/return:
 *   post:
 *     tags: [Library]
 *     summary: Return issued book
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
 *       200:
 *         description: Book returned
 *
 * /api/v1/library/transactions:
 *   get:
 *     tags: [Library]
 *     summary: Get all library transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by transaction status
 *     responses:
 *       200:
 *         description: Transaction list
 *
 * /api/v1/library/student/{id}/transactions:
 *   get:
 *     tags: [Library]
 *     summary: Get student library transactions
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
 *         description: Student transaction list
 *
 * /api/v1/library/calculate-fine/{transactionId}:
 *   get:
 *     tags: [Library]
 *     summary: Calculate fine for transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fine calculation details
 *
 * /api/v1/library/fine/{transactionId}:
 *   put:
 *     tags: [Library]
 *     summary: Update fine for transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
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
 *         description: Fine updated
 */

// Library Transaction Management
router.post("/issue", adminAuth, issueBook);
router.post("/return", adminAuth, returnBook);
router.get("/transactions", adminAuth, getLibraryTransactions);
router.get(
  "/student/:id/transactions",
  requireRole("admin", "student"),
  getStudentTransactions,
);

// Fine Management
router.get("/calculate-fine/:transactionId", adminAuth, calculateFine);
router.put("/fine/:transactionId", adminAuth, updateFine);

export default router;
