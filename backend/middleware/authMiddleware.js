import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret"; // Use the same secret as in authRoutes.js

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Authenticated user:", req.user); // Debugging log
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};