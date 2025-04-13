import express from "express";
import { getItemInfo } from "../controllers/itemInfoController.js";

const router = express.Router();

// Route to fetch item information
router.get("/:itemName", getItemInfo);

export default router;