import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "notes-sharing-app",
    // Images go through Cloudinary's image pipeline; everything else
    // (PDF, docx, xlsx, txt, etc.) is stored as "raw" so it isn't subject
    // to Cloudinary's image-delivery restrictions (which can block PDFs).
    resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
  }),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
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
  if (
    mimetype.includes("spreadsheet") ||
    mimetype.includes("excel") ||
    mimetype.includes("sheet")
  )
    return "spreadsheet";
  if (
    mimetype.includes("word") ||
    mimetype.includes("document") ||
    mimetype.includes("officedocument")
  )
    return "document";
  return "text";
};

export default upload;
