import db from "../db.js";

// Fetch all discussions
export const getAllDiscussions = (callback) => {
  const query = `
    SELECT dp.id, dp.user_id, dp.title, dp.content, dp.created_at, u.name AS author
    FROM discussionposts dp
    JOIN users u ON dp.user_id = u.id
    ORDER BY dp.created_at DESC
  `;
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

// Create a new discussion
export const createDiscussion = (userId, title, content, callback) => {
  const query = "INSERT INTO discussionposts (user_id, title, content) VALUES (?, ?, ?)";
  db.query(query, [userId, title, content], (err, result) => {
    callback(err, result);
  });
};


// Fetch comments for a discussion
export const getCommentsByDiscussionId = (postId, callback) => {
  const query = `
    SELECT c.id, c.user_id, c.comment AS text, c.created_at, u.name AS user
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `;
  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
    }
    callback(err, results);
  });
};

export const addComment = (postId, userId, comment, callback) => {
  const query = "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)";
  db.query(query, [postId, userId, comment], (err, result) => {
    if (err) {
      console.error("Error inserting comment into database:", err.message);
    }
    callback(err, result);
  });
};