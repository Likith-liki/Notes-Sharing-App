import express from "express";
import {
  register,
  login,
  getProfile,
  createAdmin,
} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register); // Only user registration
router.post("/login", login);

// Protected routes
router.get("/profile", auth, getProfile);

// Admin only routes
router.post("/admin/create", auth, admin, createAdmin); // Create new admin

// Admin only - get all users
router.get("/users", auth, admin, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const users = await User.find().select("-password");
    res.json({
      message: "Users fetched successfully",
      users: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
