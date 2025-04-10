import {
  getAllDiscussions,
  createDiscussion as createDiscussionInDB,
  getCommentsByDiscussionId, // Ensure this matches the export in discussion.js
  addComment,
} from "../models/discussion.js";
import db from "../db.js";

// Fetch all discussions
export const getDiscussions = (req, res) => {
  getAllDiscussions((err, discussions) => {
    if (err) {
      console.error("Error fetching discussions:", err.message);
      return res.status(500).json({ error: "Failed to fetch discussions" });
    }
    res.status(200).json(discussions);
  });
};

// Create a new discussion
export const createDiscussion = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id; // Extract user ID from authenticated request

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  createDiscussionInDB(userId, title, content, (err, result) => {
    if (err) {
      console.error("Error creating discussion:", err.message);
      return res.status(500).json({ error: "Failed to create discussion" });
    }
    res.status(201).json({ id: result.insertId, user_id: userId, title, content });
  });
};

// Fetch comments for a discussion
export const getComments = (req, res) => {
  const { id } = req.params; // Post ID

  getCommentsByDiscussionId(id, (err, comments) => {
    if (err) {
      console.error("Error fetching comments:", err.message);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
    res.status(200).json(comments); // Return the comments
  });
};

export const addCommentToDiscussion = (req, res) => {
  const { id } = req.params; // Post ID
  const { text } = req.body; // Extract the comment text
  const userId = req.user.id; // Extract user ID from authenticated request

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  addComment(id, userId, text, (err, result) => {
    if (err) {
      console.error("Error adding comment to database:", err.message);
      return res.status(500).json({ error: "Failed to add comment to database" });
    }

    // Fetch the newly added comment with user details
    const commentId = result.insertId;
    const query = `
      SELECT c.id, c.user_id, c.comment AS text, c.created_at, u.name AS user
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    db.query(query, [commentId], (err, results) => {
      if (err) {
        console.error("Error fetching the new comment:", err.message);
        return res.status(500).json({ error: "Failed to fetch the new comment" });
      }
      res.status(201).json(results[0]); // Return the newly added comment
    });
  });
};