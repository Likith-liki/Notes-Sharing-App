import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    file: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ["pdf", "image", "document", "spreadsheet", "text"],
      default: "pdf",
    },
    fileSize: {
      type: Number,
    },
    category: {
      type: String,
      default: "general",
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
    // Admin who created the note
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
