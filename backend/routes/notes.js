import express from "express";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getNoteFile,
} from "../controllers/noteController.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import upload, { handleUploadError } from "../config/upload.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// User routes
router.get("/", getNotes);
router.get("/:id", getNote);
router.get("/:id/file", getNoteFile);

// Admin only routes
router.post("/", admin, upload.single("file"), handleUploadError, createNote);
router.put("/:id", admin, upload.single("file"), handleUploadError, updateNote);
router.delete("/:id", admin, deleteNote);

export default router;
