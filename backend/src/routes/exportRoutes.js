// ==============================================
// Export Routes
// ==============================================

const express = require("express");
const router = express.Router();

const { exportVideo, downloadVideo, getExportStatus } = require("../controllers/exportController");

// POST /api/export/:videoId -> captions burn karke video export karo
router.post("/:videoId", exportVideo);

// GET /api/export/:videoId/status -> export status check karo
router.get("/:videoId/status", getExportStatus);

// GET /api/export/:videoId/download -> final video download karo
router.get("/:videoId/download", downloadVideo);

module.exports = router;
