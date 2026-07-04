// ==============================================
// Export Controller
// Styled captions ko video me permanently burn karta hai
// aur downloadable MP4 file provide karta hai
// ==============================================

const path = require("path");
const fs = require("fs");

const { generateASS } = require("../utils/assGenerator");
const { burnCaptions } = require("../services/captionBurnService");
const { getVideoById, updateVideo } = require("../utils/videoStore");

const OUTPUT_DIR = path.join(__dirname, "..", "..", process.env.OUTPUT_DIR || "outputs");

/**
 * POST /api/export/:videoId
 * Body: { style: {...}, wordHighlight: boolean } (optional - override defaults)
 * Video me captions burn karke final MP4 banata hai
 */
const exportVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { style: styleOverrides } = req.body;

    const video = await getVideoById(videoId);
    if (!video) {
      const error = new Error("Video not found");
      error.statusCode = 404;
      throw error;
    }
    if (!video.captions || video.captions.length === 0) {
      const error = new Error("No captions found. Generate captions first.");
      error.statusCode = 400;
      throw error;
    }

    // User ke customization options ko existing style ke saath merge karo
    const mergedStyle = { ...video.style, ...(styleOverrides || {}) };
    await updateVideo(videoId, { style: mergedStyle, status: "exporting" });

    // ASS subtitle file generate karo
    const assContent = generateASS({
      captions: video.captions,
      style: mergedStyle,
      videoWidth: video.width || 1280,
      videoHeight: video.height || 720,
    });

    const assPath = path.join(OUTPUT_DIR, `${videoId}.ass`);
    fs.writeFileSync(assPath, assContent, "utf-8");

    const outputPath = path.join(OUTPUT_DIR, `${videoId}-final.mp4`);

    // FFmpeg se captions burn karo
    await burnCaptions(video.filePath, assPath, outputPath);

    await updateVideo(videoId, { exportedPath: outputPath, status: "completed" });

    res.json({
      success: true,
      message: "Video exported successfully with captions",
      data: {
        videoId,
        downloadUrl: `/api/export/${videoId}/download`,
      },
    });
  } catch (error) {
    await updateVideo(req.params.videoId, { status: "failed", errorMessage: error.message }).catch(() => {});
    next(error);
  }
};

/**
 * GET /api/export/:videoId/download
 * Final captioned MP4 file download karta hai
 */
const downloadVideo = async (req, res, next) => {
  try {
    const video = await getVideoById(req.params.videoId);
    if (!video || !video.exportedPath || !fs.existsSync(video.exportedPath)) {
      const error = new Error("Exported video not found. Please export first.");
      error.statusCode = 404;
      throw error;
    }

    const fileName = `captioned-${video.originalName || "video"}.mp4`;
    res.download(video.exportedPath, fileName);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/export/:videoId/status
 * Export ka current status check karo (progress polling ke liye)
 */
const getExportStatus = async (req, res, next) => {
  try {
    const video = await getVideoById(req.params.videoId);
    if (!video) {
      const error = new Error("Video not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: { status: video.status, errorMessage: video.errorMessage } });
  } catch (error) {
    next(error);
  }
};

module.exports = { exportVideo, downloadVideo, getExportStatus };
