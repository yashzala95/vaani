// ==============================================
// Upload Routes
// ==============================================

const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadVideo, getVideoDetails } = require("../controllers/uploadController");

// POST /api/upload -> video file upload karo (field name: "video")
router.post("/", upload.single("video"), uploadVideo);

// GET /api/upload/:id -> video ki details lo
router.get("/:id", getVideoDetails);

module.exports = router;
