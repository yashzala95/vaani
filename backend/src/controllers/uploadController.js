// ==============================================
// Upload Controller
// Video upload receive karta hai, metadata + audio extract karta hai
// ==============================================

const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const { getVideoMetadata, extractAudio } = require("../services/ffmpegService");
const { createVideo, getVideoById } = require("../utils/videoStore");

/**
 * POST /api/upload
 * Video file upload karo, metadata nikaalo, audio extract karo
 */
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No video file uploaded. Please select a video.");
      error.statusCode = 400;
      throw error;
    }

    const videoId = uuidv4();
    const videoPath = req.file.path;

    console.log(`📤 Video uploaded: ${req.file.originalname} -> ${videoPath}`);

    // Video ka metadata nikalo (duration, resolution)
    let metadata;
    try {
      metadata = await getVideoMetadata(videoPath);
    } catch (err) {
      // Agar metadata read na ho paye, cleanup karke error do
      fs.unlinkSync(videoPath);
      const error = new Error("Uploaded file is not a valid video.");
      error.statusCode = 400;
      throw error;
    }

    // DB / memory store me record banao
    const videoRecord = await createVideo({
      _id: videoId,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: videoPath,
      duration: metadata.duration,
      width: metadata.width,
      height: metadata.height,
      status: "extracting_audio",
    });

    // Audio extraction start karo (async - response ke baad bhi chal sakta hai,
    // lekin hum yahan await kar rahe hain taaki client ko pata chale ki audio ready hai)
    const audioPath = await extractAudio(videoPath, videoId);

    // Record update karo audio path ke saath
    const { updateVideo } = require("../utils/videoStore");
    await updateVideo(videoId, { audioPath, status: "uploaded" });

    res.status(201).json({
      success: true,
      message: "Video uploaded and audio extracted successfully",
      data: {
        videoId,
        originalName: req.file.originalname,
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        videoUrl: `/uploads/${req.file.filename}`,
        status: "uploaded",
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/upload/:id
 * Video record ki details fetch karo
 */
const getVideoDetails = async (req, res, next) => {
  try {
    const video = await getVideoById(req.params.id);
    if (!video) {
      const error = new Error("Video not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadVideo, getVideoDetails };
