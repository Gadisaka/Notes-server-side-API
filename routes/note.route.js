import express from "express";
import {
  createNote,
  viewNote,
  deleteNote,
  updateNote,
  clearCompleted,
} from "../controller/note.controller.js";
import authenticateJWT from "../middleware/jwt.js";

const router = express.Router();

/**
 * @swagger
 * /api/note/create:
 *   post:
 *     summary: Create a new note
 *     tags:
 *       - Notes
 *     description: Create a new note
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 example: "This is a sample note content."
 *     responses:
 *       201:
 *         description: Note created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/create", authenticateJWT, createNote);

/**
 * @swagger
 * /api/note/all:
 *   get:
 *     summary: Retrieve all notes
 *     tags:
 *       - Notes
 *     description: Retrieve all notes created by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   content:
 *                     type: string
 *                     example: "Finish homework and grocery shopping."
 *                   user_id:
 *                     type: string
 *                     example: "8"
 *                   is_completed:
 *                     type: boolean
 *                     example: false
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 */

router.get("/all", authenticateJWT, viewNote);

/**
 * @swagger
 * /api/note/delete/{id}:
 *   delete:
 *     summary: Delete an existing note
 *     tags:
 *       - Notes
 *     description: Delete a note for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */

router.delete("/delete/:id", authenticateJWT, deleteNote);

/**
 * @swagger
 * /api/note/update/{id}:
 *   patch:
 *     summary: Mark a note as completed
 *     tags:
 *       - Notes
 *     description: Update a note's `is_completed` status from `false` to `true` for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to mark as completed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Note marked as completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 content:
 *                   type: string
 *                   example: "Finish homework and grocery shopping."
 *                 user_id:
 *                   type: string
 *                   example: "user_12345"
 *                 is_completed:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid request - The note is already marked as completed
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       404:
 *         description: Note not found
 */

router.patch("/update/:id", authenticateJWT, updateNote);

/**
 * @swagger
 * /api/note/clear:
 *   delete:
 *     summary: Clear completed notes
 *     tags:
 *       - Notes
 *     description: Deletes all completed notes for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Completed notes cleared successfully
 *       401:
 *         description: Unauthorized
 */

router.delete("/clear", authenticateJWT, clearCompleted);

export default router;
