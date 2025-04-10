import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret"; // Use the same secret as in authRoutes.js

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};