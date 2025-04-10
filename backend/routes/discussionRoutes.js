import express from "express";
import {
  getDiscussions,
  createDiscussion,
  addCommentToDiscussion,
  getComments,
} from "../controllers/discussionController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDiscussions);
router.post("/", authenticateUser, createDiscussion); // Require authentication
router.get("/:id/comments", getComments);
router.post("/:id/comments", authenticateUser, addCommentToDiscussion); // Require authentication

export default router;