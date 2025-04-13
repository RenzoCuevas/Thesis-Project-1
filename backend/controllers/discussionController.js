import {
  getAllDiscussions,
  createDiscussion as createDiscussionInDB,
  getCommentsByDiscussionId as fetchCommentsFromDB,
  addComment,
} from "../models/discussion.js";
import db from "../db.js";

// Fetch all discussions
export const getDiscussions = (req, res) => {
  const query = `
    SELECT dp.id, dp.title, dp.content, dp.created_at, u.name AS author, dp.user_id
    FROM discussionposts dp
    JOIN users u ON dp.user_id = u.id
    ORDER BY dp.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching discussions:", err.message);
      return res.status(500).json({ error: "Failed to fetch discussions" });
    }
    res.status(200).json(results);
  });
};

// Create a new discussion
export const createDiscussion = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const query = "INSERT INTO discussionposts (user_id, title, content) VALUES (?, ?, ?)";
  db.query(query, [userId, title, content], (err, result) => {
    if (err) {
      console.error("Error creating discussion:", err.message);
      return res.status(500).json({ error: "Failed to create discussion" });
    }

    const postId = result.insertId;
    const fetchQuery = `
      SELECT dp.id, dp.title, dp.content, dp.created_at, u.name AS author, dp.user_id
      FROM discussionposts dp
      JOIN users u ON dp.user_id = u.id
      WHERE dp.id = ?
    `;
    db.query(fetchQuery, [postId], (err, results) => {
      if (err) {
        console.error("Error fetching the new discussion:", err.message);
        return res.status(500).json({ error: "Failed to fetch the new discussion" });
      }
      res.status(201).json(results[0]);
    });
  });
};

const handleCreatePost = async (newPost) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/api/discussions",
      newPost,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPosts((prevPosts) => [response.data, ...prevPosts]);
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

// Fetch comments for a discussion
export const getCommentsByDiscussionId = (req, res) => {
  const { id } = req.params;

  fetchCommentsFromDB(id, (err, comments) => {
    if (err) {
      console.error("Error fetching comments:", err.message);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
    res.status(200).json(comments);
  });
};

// Add a comment to a discussion
export const addCommentToDiscussion = (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  addComment(id, userId, text, (err, result) => {
    if (err) {
      console.error("Error adding comment to database:", err.message);
      return res.status(500).json({ error: "Failed to add comment to database" });
    }

    if (!result.insertId) {
      return res.status(500).json({ error: "Failed to add comment" });
    }

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
      res.status(201).json(results[0]);
    });
  });
};

// Edit a comment
export const editComment = (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const query = "UPDATE comments SET comment = ? WHERE id = ? AND user_id = ?";
  db.query(query, [text, id, userId], (err, result) => {
    if (err) {
      console.error("Error updating comment:", err.message);
      return res.status(500).json({ error: "Failed to update comment" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "You are not authorized to edit this comment" });
    }

    res.status(200).json({ message: "Comment updated successfully" });
  });
};

// Delete a comment
export const deleteComment = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const query = "DELETE FROM comments WHERE id = ? AND user_id = ?";
  db.query(query, [id, userId], (err, result) => {
    if (err) {
      console.error("Error deleting comment:", err.message);
      return res.status(500).json({ error: "Failed to delete comment" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  });
};

// Edit a discussion
export const editDiscussion = (req, res) => {
  const { id } = req.params; 
  const { title, content } = req.body; 
  const userId = req.user.id; 

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  // Update the discussion in the database
  const updateQuery = "UPDATE discussionposts SET title = ?, content = ? WHERE id = ? AND user_id = ?";
  db.query(updateQuery, [title, content, id, userId], (err, result) => {
    if (err) {
      console.error("Error updating discussion:", err.message);
      return res.status(500).json({ error: "Failed to update discussion" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "You are not authorized to edit this discussion" });
    }

    // Fetch the updated discussion
    const fetchQuery = `
      SELECT dp.id, dp.title, dp.content, dp.created_at, u.name AS author, dp.user_id
      FROM discussionposts dp
      JOIN users u ON dp.user_id = u.id
      WHERE dp.id = ?
    `;
    db.query(fetchQuery, [id], (err, results) => {
      if (err) {
        console.error("Error fetching updated discussion:", err.message);
        return res.status(500).json({ error: "Failed to fetch updated discussion" });
      }

      res.status(200).json(results[0]); // Return the updated post
    });
  });
};

// Delete a discussion
export const deleteDiscussion = (req, res) => {
  const { id } = req.params; 
  const userId = req.user.id; 

  console.log("Deleting discussion with ID:", id);
  console.log("Authenticated user ID:", userId);

  // Delete associated comments first
  const deleteCommentsQuery = "DELETE FROM comments WHERE post_id = ?";
  db.query(deleteCommentsQuery, [id], (err) => {
    if (err) {
      console.error("Error deleting associated comments:", err.message);
      return res.status(500).json({ error: "Failed to delete associated comments" });
    }

    // Delete the discussion
    const deleteDiscussionQuery = "DELETE FROM discussionposts WHERE id = ? AND user_id = ?";
    db.query(deleteDiscussionQuery, [id, userId], (err, result) => {
      if (err) {
        console.error("Error deleting discussion:", err.message);
        return res.status(500).json({ error: "Failed to delete discussion" });
      }

      if (result.affectedRows === 0) {
        console.warn("No discussion found or unauthorized access");
        return res.status(403).json({ error: "You are not authorized to delete this discussion" });
      }

      console.log("Discussion deleted successfully");
      res.status(200).json({ message: "Discussion deleted successfully" });
    });
  });
};

// File upload
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage }).single("file");

export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: "Invalid file type. Only images are allowed." });
  }

  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
};