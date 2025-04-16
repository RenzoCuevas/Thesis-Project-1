
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
    return res.status(400).json({ error: "Title and content are required." });
  }

  const query = `
    INSERT INTO discussionposts (user_id, title, content, created_at)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(query, [userId, title, content], (err, result) => {
    if (err) {
      console.error("Error creating discussion:", err.message);
      return res.status(500).json({ error: "Failed to create discussion." });
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
        return res.status(500).json({ error: "Failed to fetch the new discussion." });
      }
      res.status(201).json(results[0]);
    });
  });
};


// Fetch comments for a discussion
export const getCommentsByDiscussionId = (req, res) => {
  const { id } = req.params; // Post ID

  const query = `
    SELECT c.id, c.user_id, c.comment AS text, c.file_path, c.created_at, u.name AS user
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err.message);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }

    console.log("Fetched comments:", results); // Debugging log
    res.status(200).json(results);
  });
};

export const getCommentsByPostId = (req, res) => {
  const { id } = req.params; // Post ID

  const query = `
    SELECT c.id, c.user_id, c.comment AS text, c.file_path, c.created_at, u.name AS user
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err.message);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
    res.status(200).json(results);
  });
};

export const uploadDiscussionFile = (req, res) => {
  console.log("Request body:", req.body); // Should contain title and content
  console.log("Uploaded file:", req.file); // Should contain file details

  const { title, content } = req.body;
  const userId = req.user.id;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const query = `
    INSERT INTO discussionposts (user_id, title, content, file_path, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [userId, title, content, filePath], (err, result) => {
    if (err) {
      console.error("Error saving discussion to database:", err.message);
      return res.status(500).json({ error: "Failed to save discussion." });
    }

    res.status(201).json({ message: "Discussion created successfully." });
  });
};

// Add a comment to a discussion
export const addCommentToDiscussion = (req, res) => {
  const { id } = req.params; // Discussion ID
  const { text } = req.body;
  const userId = req.user.id;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const insertQuery = `
    INSERT INTO comments (post_id, user_id, comment, created_at)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(insertQuery, [id, userId, text], (err, result) => {
    if (err) {
      console.error("Error adding comment to database:", err.message);
      return res.status(500).json({ error: "Failed to add comment to database" });
    }

    const commentId = result.insertId;

    const fetchQuery = `
      SELECT c.id, c.user_id, c.comment AS text, c.created_at, u.name AS user
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;

    db.query(fetchQuery, [commentId], (err, results) => {
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
  const { id } = req.params; // Comment ID
  const { text } = req.body;
  const userId = req.user.id; // Authenticated user ID

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const query = `
    UPDATE comments
    SET comment = ?
    WHERE id = ? AND user_id = ?
  `;

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
  const { id } = req.params; // Comment ID
  const userId = req.user.id; // Authenticated user ID

  const query = `
    DELETE FROM comments
    WHERE id = ? AND user_id = ?
  `;

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

export const getDiscussionById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT dp.id, dp.title, dp.content, dp.file_path, dp.created_at, u.name AS author
    FROM discussionposts dp
    LEFT JOIN users u ON dp.user_id = u.id
    WHERE dp.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching discussion:", err.message);
      return res.status(500).json({ error: "Failed to fetch discussion" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    console.log("Fetched discussion:", results[0]); // Debugging log
    res.status(200).json(results[0]);
  });
};