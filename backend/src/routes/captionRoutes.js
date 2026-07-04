// ==============================================
// Caption Routes
// ==============================================

const express = require("express");
const router = express.Router();

const {
  generateCaptions,
  getCaptions,
  updateCaptions,
  exportSRT,
  exportVTT,
} = require("../controllers/captionController");

// POST /api/caption/:videoId/generate -> Whisper se captions generate karo
router.post("/:videoId/generate", generateCaptions);

// GET /api/caption/:videoId -> captions fetch karo
router.get("/:videoId", getCaptions);

// PUT /api/caption/:videoId -> captions edit karo (text/timing)
router.put("/:videoId", updateCaptions);

// GET /api/caption/:videoId/srt -> SRT file download
router.get("/:videoId/srt", exportSRT);

// GET /api/caption/:videoId/vtt -> VTT file download
router.get("/:videoId/vtt", exportVTT);

module.exports = router;
