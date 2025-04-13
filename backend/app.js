import express from "express";
import cors from "cors";
import discussionRoutes from "./routes/discussionRoutes.js";
import itemInfoRoutes from "./routes/itemInfoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/discussions", discussionRoutes);
app.use("/api/item-info", itemInfoRoutes); 

export default app;