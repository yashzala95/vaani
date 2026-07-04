// ==============================================
// Caption Burn Service
// FFmpeg (libass) use karke .ass subtitle file ko
// video ke andar permanently burn karta hai
// ==============================================

const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

/**
 * Windows paths me backslash aur colon FFmpeg filter syntax me
 * special characters hote hain, isliye escape karna zaroori hai
 * C:\folder\file.ass -> C\:/folder/file.ass
 */
const escapeFilterPath = (filePath) => {
  return filePath.replace(/\\/g, "/").replace(/:/g, "\\:");
};

/**
 * Video me ASS subtitles burn karta hai (permanently embed)
 * @param {string} videoPath - original video ka path
 * @param {string} assPath - .ass subtitle file ka path
 * @param {string} outputPath - final output video ka path
 * @param {function} onProgress - progress callback (percent)
 * @returns {Promise<string>} - output path
 */
const burnCaptions = (videoPath, assPath, outputPath, onProgress) => {
  return new Promise((resolve, reject) => {
    const escapedAssPath = escapeFilterPath(assPath);

    ffmpeg(videoPath)
      .videoFilters(`ass='${escapedAssPath}'`)
      .outputOptions([
        "-c:a copy", // audio ko re-encode nahi karna, fast + quality preserve
        "-c:v libx264", // widely compatible video codec
        "-preset fast",
        "-crf 20", // achi quality
      ])
      .on("start", (cmd) => {
        console.log(`🔥 Burning captions started: ${cmd}`);
      })
      .on("progress", (progress) => {
        if (onProgress && progress.percent) {
          onProgress(Math.min(100, Math.round(progress.percent)));
        }
      })
      .on("error", (err) => {
        console.error("❌ Caption burn error:", err.message);
        reject(new Error(`Failed to burn captions: ${err.message}`));
      })
      .on("end", () => {
        console.log(`✅ Captions burned successfully: ${outputPath}`);
        resolve(outputPath);
      })
      .save(outputPath);
  });
};

module.exports = { burnCaptions };
