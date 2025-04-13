import express from "express"; // Import express
import {
  getDiscussions,
  createDiscussion,
  editDiscussion,
  deleteDiscussion,
  addCommentToDiscussion,
  editComment,
  deleteComment,
  uploadFile,
  getCommentsByDiscussionId, // Import the controller for fetching comments
} from "../controllers/discussionController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router(); // Initialize the router

// Routes
router.get("/", getDiscussions); // Get all discussions
router.post("/", authenticateUser, createDiscussion); // Add a new discussion
router.put("/:id", authenticateUser, editDiscussion); // Edit discussion
router.delete("/:id", authenticateUser, deleteDiscussion); // Delete discussion
router.get("/:id/comments", getCommentsByDiscussionId); // Fetch comments for a discussion
router.post("/:id/comments", authenticateUser, addCommentToDiscussion); // Add a comment to a discussion
router.put("/comments/:id", authenticateUser, editComment); // Edit comment
router.delete("/comments/:id", authenticateUser, deleteComment); // Delete comment
router.post("/upload", authenticateUser, multer().single("file"), uploadFile); // Upload file

export default router;