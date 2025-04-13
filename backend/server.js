import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import app from "./app.js"; // Importing app from app.js
import authRoutes from "./routes/authRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";

dotenv.config();

// Multer for handling image uploads
const upload = multer({ dest: "uploads/" });

// Authentication Routes
app.use("/api/auth", authRoutes);

// Image Analysis Route
app.post("/api/analyze-image", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post("http://127.0.0.1:5001/predict", formData, {
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error processing image:", error.message);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});