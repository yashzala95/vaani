// ==============================================
// Multer Upload Middleware
// Video file ko validate aur disk par store karta hai
// ==============================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const UPLOAD_DIR = path.join(__dirname, "..", "..", process.env.UPLOAD_DIR || "uploads");

// Agar uploads folder exist nahi karta to bana do
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Sirf ye video formats allow honge
const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/quicktime", // .mov
  "video/x-matroska", // .mkv
  "video/webm",
  "video/x-msvideo", // .avi
];

// ------------------- STORAGE CONFIG -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Unique filename banao taaki collision na ho
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

// ------------------- FILE FILTER (Security) -------------------
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4, MOV, MKV, WEBM, AVI allowed."), false);
  }
};

// ------------------- MULTER INSTANCE -------------------
const maxSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || "500", 10);

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxSizeMB * 1024 * 1024, // MB ko bytes me convert karo
  },
});

module.exports = upload;
