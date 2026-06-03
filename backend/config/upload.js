import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "notes-sharing-app",
    resource_type: "auto",
    allowed_formats: [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "txt",
    ],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

export const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  next();
};

export const getFileType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.includes("spreadsheet")) return "spreadsheet";
  if (mimetype.includes("word")) return "document";
  return "text";
};

export default upload;
