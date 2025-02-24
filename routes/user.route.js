import express from "express";
import {
  userupdate,
  signup,
  login,
  signout,
  getUsers,
  isUserAutenticated,
  user,
} from "../controller/user.controller.js";
import authenticateJWT from "../middleware/jwt.js";

const router = express.Router();
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     description: Signup a new user with email, password, and username
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               username:
 *                 type: string
 *                 example: "username"
 *               phone:
 *                 type: int
 *                 example: 123456789
 *               birthday_year:
 *                 type: int
 *                 example: 1995
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */

router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Users
 *     description: Authenticate a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns a token
 *       401:
 *         description: Unauthorized
 */

router.post("/login", login);

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Sign out a user
 *     tags:
 *       - Users
 *     description: Logs the user out by invalidating the token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User signed out successfully
 *       401:
 *         description: Unauthorized
 */

router.post("/signout", signout);

/**
 * @swagger
 * /api/auth/userupdate/{id}:
 *   patch:
 *     summary: Update user data
 *     tags:
 *       - Users
 *     description: Update user data including email, password, username, phone, and birth year
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               username:
 *                 type: string
 *                 example: "newUsername"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               birthday_year:
 *                 type: integer
 *                 example: 1995
 *     responses:
 *       200:
 *         description: User data updated successfully
 *       400:
 *         description: Invalid data provided
 *       401:
 *         description: Unauthorized
 */

router.patch("/userupdate/:id", authenticateJWT, userupdate);

router.get("/all", getUsers);

router.get("/user", authenticateJWT, user);

router.get("/isAutenticated/:id", authenticateJWT, isUserAutenticated);

//check

export default router;
