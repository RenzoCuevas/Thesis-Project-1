const express = require("express");
const cors = require("cors");
const discussionRoutes = require("./routes/discussionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/discussions", discussionRoutes);

module.exports = app;
