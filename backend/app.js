import express from "express";
import cors from "cors";
import discussionRoutes from "./routes/discussionRoutes.js";
import itemInfoRoutes from "./routes/itemInfoRoutes.js";
import fileUploadRoutes from "./routes/fileUploadRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this to parse form data

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// Register routes
app.use("/api/discussions", discussionRoutes);
app.use("/api/item-info", itemInfoRoutes);
// Register routes
app.use("/api", fileUploadRoutes);

export default app;