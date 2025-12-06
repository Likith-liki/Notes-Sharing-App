import Note from "../models/Note.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getFileType } from "../config/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all published notes (for users) or all notes (for admins)
export const getNotes = async (req, res) => {
  try {
    let query = { isPublished: true };

    // Admins can see all notes (including unpublished)
    if (req.user.role === "admin") {
      delete query.isPublished;
    }

    const notes = await Note.find(query)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json({
      message: "Notes fetched successfully",
      notes: notes,
      count: notes.length,
    });
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// Get single note
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Users can only see published notes
    if (req.user.role !== "admin" && !note.isPublished) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      message: "Note fetched successfully",
      note: note,
    });
  } catch (err) {
    console.error("Get note error:", err);
    res.status(500).json({ message: "Failed to fetch note" });
  }
};

// Create note (Admin only)
export const createNote = async (req, res) => {
  const { title, description, topic, category, tags } = req.body;

  try {
    if (!title || !description || !topic) {
      return res
        .status(400)
        .json({ message: "Title, description, and topic are required" });
    }

    let fileData = null;
    if (req.file) {
      fileData = {
        path: `/uploads/${req.file.filename}`,
        type: getFileType(req.file.mimetype),
        size: req.file.size,
      };
    }

    const note = await Note.create({
      title: title.trim(),
      description: description.trim(),
      topic: topic.trim(),
      category: category || "general",
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      file: fileData?.path,
      fileType: fileData?.type,
      fileSize: fileData?.size,
      createdBy: req.user._id,
    });

    const populatedNote = await Note.findById(note._id).populate(
      "createdBy",
      "username"
    );

    res.status(201).json({
      message: "Note created successfully",
      note: populatedNote,
    });
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ message: "Failed to create note" });
  }
};

// Update note (Admin only)
export const updateNote = async (req, res) => {
  const { title, description, topic, category, tags, isPublished } = req.body;

  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    let filePath = note.file;

    // If new file uploaded, delete old file
    if (req.file) {
      if (note.file) {
        const oldFilePath = path.join(__dirname, "..", note.file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      filePath = `/uploads/${req.file.filename}`;
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim() || note.title,
        description: description?.trim() || note.description,
        topic: topic?.trim() || note.topic,
        category: category || note.category,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : note.tags,
        file: filePath,
        fileType: req.file ? getFileType(req.file.mimetype) : note.fileType,
        fileSize: req.file ? req.file.size : note.fileSize,
        isPublished: isPublished !== undefined ? isPublished : note.isPublished,
      },
      { new: true, runValidators: true }
    ).populate("createdBy", "username");

    res.json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ message: "Failed to update note" });
  }
};

// Delete note (Admin only)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete associated file
    if (note.file) {
      const filePath = path.join(__dirname, "..", note.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

// Get note file (for download/view)
export const getNoteFile = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || !note.file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Users can only access published notes
    if (req.user.role !== "admin" && !note.isPublished) {
      return res.status(403).json({ message: "Access denied" });
    }

    const filePath = path.join(__dirname, "..", note.file);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.sendFile(path.resolve(filePath));
  } catch (err) {
    console.error("Get file error:", err);
    res.status(500).json({ message: "Failed to get file" });
  }
};
