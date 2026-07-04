// ==============================================
// Caption Controller
// Transcription generate karna, captions edit karna,
// aur SRT/VTT files export karna
// ==============================================

const { transcribeAudio } = require("../services/whisperService");
const { processSegmentsToCaptions } = require("../utils/captionProcessor");
const { generateSRT } = require("../utils/srtGenerator");
const { generateVTT } = require("../utils/vttGenerator");
const { getVideoById, updateVideo } = require("../utils/videoStore");

/**
 * POST /api/caption/:videoId/generate
 * Video ke audio ko transcribe karke captions generate karta hai
 */
const generateCaptions = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { language } = req.body; // optional - "auto" default

    const video = await getVideoById(videoId);
    if (!video) {
      const error = new Error("Video not found");
      error.statusCode = 404;
      throw error;
    }
    if (!video.audioPath) {
      const error = new Error("Audio not extracted yet for this video");
      error.statusCode = 400;
      throw error;
    }

    await updateVideo(videoId, { status: "transcribing" });

    // Whisper se transcribe karo
    const result = await transcribeAudio(video.audioPath, language || "auto");

    // Raw segments ko readable captions me convert karo (auto line-break)
    const captions = processSegmentsToCaptions(result.segments);

    await updateVideo(videoId, {
      captions,
      language: result.language,
      status: "ready",
    });

    res.json({
      success: true,
      message: "Captions generated successfully",
      data: {
        videoId,
        language: result.language,
        captions,
      },
    });
  } catch (error) {
    // Failure hone par status update karo
    await updateVideo(req.params.videoId, { status: "failed", errorMessage: error.message }).catch(() => {});
    next(error);
  }
};

/**
 * GET /api/caption/:videoId
 * Video ke saare captions fetch karo
 */
const getCaptions = async (req, res, next) => {
  try {
    const video = await getVideoById(req.params.videoId);
    if (!video) {
      const error = new Error("Video not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: { captions: video.captions || [], status: video.status } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/caption/:videoId
 * Captions ko manually edit karo (text, timing, ya poora array replace)
 */
const updateCaptions = async (req, res, next) => {
  try {
    const { captions } = req.body;

    if (!Array.isArray(captions)) {
      const error = new Error("captions must be an array");
      error.statusCode = 400;
      throw error;
    }

    const video = await getVideoById(req.params.videoId);
    if (!video) {
      const error = new Error("Video not found");
      error.statusCode = 404;
      throw error;
    }

    const updated = await updateVideo(req.params.videoId, { captions });

    res.json({ success: true, message: "Captions updated", data: { captions: updated.captions } });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/caption/:videoId/srt
 * SRT file download karo
 */
const exportSRT = async (req, res, next) => {
  try {
    const video = await getVideoById(req.params.videoId);
    if (!video || !video.captions?.length) {
      const error = new Error("No captions found for this video");
      error.statusCode = 404;
      throw error;
    }

    const srtContent = generateSRT(video.captions);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="captions-${req.params.videoId}.srt"`);
    res.send(srtContent);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/caption/:videoId/vtt
 * VTT file download karo
 */
const exportVTT = async (req, res, next) => {
  try {
    const video = await getVideoById(req.params.videoId);
    if (!video || !video.captions?.length) {
      const error = new Error("No captions found for this video");
      error.statusCode = 404;
      throw error;
    }

    const vttContent = generateVTT(video.captions);

    res.setHeader("Content-Type", "text/vtt");
    res.setHeader("Content-Disposition", `attachment; filename="captions-${req.params.videoId}.vtt"`);
    res.send(vttContent);
  } catch (error) {
    next(error);
  }
};

module.exports = { generateCaptions, getCaptions, updateCaptions, exportSRT, exportVTT };
