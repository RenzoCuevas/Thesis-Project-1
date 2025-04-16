import express from "express";
import { upload, uploadCommentFile, uploadDiscussionFile } from "../controllers/fileUploadController.js"; // Add uploadDiscussionFile
import { createDiscussion } from "../controllers/discussionController.js"; // Import createDiscussion
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();
// Route for creating a discussion (text-only)
router.post("/discussions", authenticateUser, createDiscussion);

// Route for uploading a file for a discussion
router.post("/discussions/upload", authenticateUser, upload, uploadDiscussionFile);

// Route for uploading a file for a comment
router.post("/comments/:id/upload", authenticateUser, upload, uploadCommentFile);

export default router;