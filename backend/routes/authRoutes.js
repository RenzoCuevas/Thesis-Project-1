import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import mysql from "../db.js"; 

const router = express.Router();
const JWT_SECRET = "your_jwt_secret"; // Change this to a strong secret key

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    try {

      const [existingUser] = await mysql.promise().query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) return res.status(400).json({ message: "Email already exists" });


      const hashedPassword = await bcrypt.hash(password, 10);


      await mysql.promise().query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
        name,
        email,
        hashedPassword,
        role || "student",
      ]);

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const [user] = await mysql.promise().query("SELECT * FROM users WHERE email = ?", [email]);
      if (user.length === 0) return res.status(401).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

      const token = jwt.sign({ id: user[0].id, role: user[0].role }, JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Login successful", token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// 🛡 Get Authenticated User Info
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [result] = await mysql.promise().query("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.id]);

    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    res.json({ user: result[0] });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
