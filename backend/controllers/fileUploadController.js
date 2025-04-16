import multer from "multer";
import db from "../db.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
}).single("file");



export const uploadDiscussionFile = (req, res) => {
  console.log("Request body:", req.body); // Should contain post_id
  console.log("Uploaded file:", req.file); // Should contain file details

  const { post_id } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!post_id || !filePath) {
    return res.status(400).json({ error: "Post ID and file are required." });
  }

  // Update the discussion with the file path
  const query = `
    UPDATE discussionposts SET file_path = ? WHERE id = ?
  `;

  db.query(query, [filePath, post_id], (err, result) => {
    if (err) {
      console.error("Error updating discussion with file:", err.message);
      return res.status(500).json({ error: "Failed to associate file with discussion." });
    }

    res.status(200).json({ message: "File uploaded and associated with discussion successfully." });
  });
};

// Upload file for a comment
export const uploadCommentFile = (req, res) => {
  console.log("Request received at /comments/:id/upload");
  console.log("Params:", req.params); // Should contain { id }
  console.log("Body:", req.body); // Should contain text
  console.log("File:", req.file); // Should contain file details
  console.log("Authenticated user:", req.user); // Should contain user details

  const { id } = req.params; // This is the post_id
  const { text } = req.body;
  const userId = req.user ? req.user.id : null;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const query = `
    INSERT INTO comments (post_id, user_id, comment, file_path, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [id, userId, text, filePath], (err, result) => {
    if (err) {
      console.error("Error saving comment to database:", err.message);
      return res.status(500).json({ error: "Failed to save comment" });
    }

    const commentId = result.insertId;

    const fetchQuery = `
      SELECT c.id, c.comment AS text, c.file_path, c.created_at, u.name AS user
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    db.query(fetchQuery, [commentId], (err, results) => {
      if (err) {
        console.error("Error fetching the new comment:", err.message);
        return res.status(500).json({ error: "Failed to fetch the new comment" });
      }
      console.log("Response to frontend:", results[0]); // Log the response
      res.status(201).json(results[0]);
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