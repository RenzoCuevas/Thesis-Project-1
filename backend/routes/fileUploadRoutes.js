import express from "express";
import { upload, uploadCommentFile, uploadDiscussionFile } from "../controllers/fileUploadController.js"; // Add uploadDiscussionFile
import { createDiscussion } from "../controllers/discussionController.js"; // Import createDiscussion
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getDiscussionById } from "../controllers/discussionController.js";

const router = express.Router();
// Route for creating a discussion (text-only)
router.post("/discussions", authenticateUser, createDiscussion);

// Route for uploading a file for a discussion
router.post("/discussions/upload", authenticateUser, upload, uploadDiscussionFile);

// Route for uploading a file for a comment
router.post("/comments/:id/upload", authenticateUser, upload, uploadCommentFile);
router.get("/discussions/:id", getDiscussionById);
export default router;