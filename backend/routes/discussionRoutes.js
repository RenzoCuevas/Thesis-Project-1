import express from "express";
import {
  getDiscussions,
  createDiscussion,
  editDiscussion,
  deleteDiscussion,
  addCommentToDiscussion,
  editComment,
  deleteComment,
  getCommentsByDiscussionId,
  getDiscussionById, // Import the missing function
} from "../controllers/discussionController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.get("/", getDiscussions); // Get all discussions
router.post("/", authenticateUser, createDiscussion); // Add a new discussion
router.put("/:id", authenticateUser, editDiscussion); // Edit discussion
router.delete("/:id", authenticateUser, deleteDiscussion); // Delete discussion
router.get("/:id/comments", getCommentsByDiscussionId); // Fetch comments for a discussion
router.post("/:id/comments", authenticateUser, addCommentToDiscussion); // Add a comment to a discussion
router.put("/comments/:id", authenticateUser, editComment); // Edit comment
router.delete("/comments/:id", authenticateUser, deleteComment); // Delete comment
router.get("/discussions/:id", getDiscussionById); // Fetch a single discussion by ID

export default router;