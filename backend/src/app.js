// ==============================================
// Express App Configuration
// Yahan hum saare middlewares aur routes mount karenge
// (Routes agle steps me add honge - upload, caption, export)
// ==============================================

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// ------------------- SECURITY MIDDLEWARES -------------------
// crossOriginResourcePolicy ko "cross-origin" set karna zaroori hai
// warna backend (port 5000) se serve hone wali video/audio files
// frontend (port 5173) ke <video> tag me block ho jaati hain (blank/black dikhti hain)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS - sirf frontend URL se requests allow karo
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Rate limiting - brute force / abuse se bachne ke liye
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // per IP max requests
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

// ------------------- BODY PARSERS -------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ------------------- LOGGING -------------------
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ------------------- STATIC FILES -------------------
// Uploaded aur processed videos serve karne ke liye
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/outputs", express.static(path.join(__dirname, "..", "outputs")));

// ------------------- HEALTH CHECK -------------------
app.get("/", (req, res) => {
  res.json({ success: true, message: "Vaani API is running 🎙️" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running fine 🚀" });
});

// ------------------- ROUTES -------------------
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/caption", require("./routes/captionRoutes"));
app.use("/api/export", require("./routes/exportRoutes"));

// ------------------- ERROR HANDLERS -------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
