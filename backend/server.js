// ==============================================
// Server Entry Point
// ==============================================

require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Database se connect karo (optional)
connectDB();

const server = app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🎬 AI Caption Generator - Backend       ║
  ║   🚀 Server running on port ${PORT}          ║
  ║   🌍 Mode: ${process.env.NODE_ENV || "development"}                    ║
  ╚══════════════════════════════════════════╝
  `);
});

// Unhandled promise rejections ko gracefully handle karo
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
