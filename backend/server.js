import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js"; // Ensure this file is using ES Modules (rename db.js to db.mjs if needed)
import authRoutes from "./routes/authRoutes.js"; // Ensure authRoutes.js is using ES Modules

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer for handling image uploads
const upload = multer({ dest: "uploads/" });

// Authentication Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("LMS Backend is Running...");
});

// Image Upload & Analysis Route
app.post("/api/analyze-image", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Prepare image for Flask API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    // Send image to Flask CNN API
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
  console.log(`Server is running on port ${PORT}`);
});
