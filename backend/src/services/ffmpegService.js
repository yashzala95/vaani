// ==============================================
// FFmpeg Service
// Video se audio extract karna + video metadata nikalna
// ==============================================

const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

// Agar .env me explicit path diya hai (Windows PATH issues se bachne ke liye),
// to use set karo. Warna fluent-ffmpeg system PATH se dhoondega.
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
  console.log(`🔧 Using custom FFmpeg path: ${process.env.FFMPEG_PATH}`);
}
if (process.env.FFPROBE_PATH) {
  ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
  console.log(`🔧 Using custom FFprobe path: ${process.env.FFPROBE_PATH}`);
}

const OUTPUT_DIR = path.join(__dirname, "..", "..", process.env.OUTPUT_DIR || "outputs");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Video file ka duration aur basic metadata nikalta hai
 * @param {string} videoPath
 * @returns {Promise<object>}
 */
const getVideoMetadata = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        return reject(new Error(`Failed to read video metadata: ${err.message}`));
      }
      resolve({
        duration: metadata.format.duration, // seconds
        width: metadata.streams[0]?.width,
        height: metadata.streams[0]?.height,
      });
    });
  });
};

/**
 * Video se audio extract karke .wav file banata hai
 * Whisper ke liye 16kHz mono WAV best format hai
 * @param {string} videoPath - input video ka path
 * @param {string} videoId - unique id (output filename ke liye)
 * @returns {Promise<string>} - audio file ka path
 */
const extractAudio = (videoPath, videoId) => {
  return new Promise((resolve, reject) => {
    const audioOutputPath = path.join(OUTPUT_DIR, `${videoId}.wav`);

    ffmpeg(videoPath)
      .noVideo()
      .audioChannels(1) // mono
      .audioFrequency(16000) // 16kHz - whisper ke liye ideal
      .format("wav")
      .on("start", (cmd) => {
        console.log(`🎙️  FFmpeg audio extraction started: ${cmd}`);
      })
      .on("error", (err) => {
        console.error("❌ FFmpeg audio extraction error:", err.message);
        reject(new Error(`Audio extraction failed: ${err.message}`));
      })
      .on("end", () => {
        console.log(`✅ Audio extracted successfully: ${audioOutputPath}`);
        resolve(audioOutputPath);
      })
      .save(audioOutputPath);
  });
};

module.exports = { getVideoMetadata, extractAudio };
