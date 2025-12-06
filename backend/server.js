import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

// Routes
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";

// Config
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Notes Sharing API is running!",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Create default admin if not exists
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: "Likith" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await User.create({
        username: "Likith",
        password: hashedPassword,
        role: "admin",
      });
      console.log(
        "✅ Default admin created: Username: Likith, Password: admin"
      );
    } else {
      console.log("✅ Default admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create default admin after DB connection
    await createDefaultAdmin();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Notes Sharing API is ready!`);
    console.log(`🔐 Default Admin: Likith / admin`);
  });
});
