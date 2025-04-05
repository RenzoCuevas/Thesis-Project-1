const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const discussionSchema = new mongoose.Schema({
  title: String,
  description: String,
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Discussion", discussionSchema);
