//discussionController
import Discussion from "../models/discussion.js";  // use import instead of require

// Get all discussions
export const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new discussion
export const createDiscussion = async (req, res) => {
  const { title, description } = req.body;
  const discussion = new Discussion({ title, description });
  try {
    const saved = await discussion.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add a comment to a discussion
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { user, text } = req.body;

  try {
    const discussion = await Discussion.findById(id);
    if (!discussion) return res.status(404).json({ message: "Not found" });

    discussion.comments.push({ user, text });
    const updated = await discussion.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
