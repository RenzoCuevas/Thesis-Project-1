//discussionRoutes
const express = require("express");
const router = express.Router();
const {
  getDiscussions,
  createDiscussion,
  addComment
} = require("../controllers/discussionController");

router.get("/", getDiscussions);
router.post("/", createDiscussion);
router.post("/:id/comments", addComment);


export default discussionRoutes;