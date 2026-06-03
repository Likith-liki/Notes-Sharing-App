import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

const createInitialAdmin = async () => {
  try {
    await connectDB();
    const existing = await User.findOne({ username: "Likith" });
    if (existing) return console.log("Admin already exists");

    const hashed = await bcrypt.hash("admin", 10);
    const admin = await User.create({
      username: "Likith",
      password: hashed,
      role: "admin",
    });
    console.log("✅ Initial admin created:", admin);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createInitialAdmin();
