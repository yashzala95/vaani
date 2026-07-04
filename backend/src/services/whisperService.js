// ==============================================
// Whisper Service
// Python transcribe.py script ko child process ke
// through call karta hai aur JSON result parse karta hai
// ==============================================

const { spawn } = require("child_process");
const path = require("path");

const SCRIPT_PATH = path.join(__dirname, "..", "..", "scripts", "transcribe.py");

/**
 * Audio file ko transcribe karta hai Whisper model se
 * @param {string} audioPath - .wav file ka path
 * @param {string} language - language code ya "auto"
 * @returns {Promise<object>} - { language, duration, segments }
 */
const transcribeAudio = (audioPath, language = "auto") => {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON_PATH || "python3";
    const modelSize = process.env.WHISPER_MODEL || "small";

    console.log(`🧠 Starting transcription (model: ${modelSize}, lang: ${language})...`);

    const pythonProcess = spawn(pythonPath, [
      SCRIPT_PATH,
      audioPath,
      modelSize,
      language,
    ]);

    let outputData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      // Whisper progress logs yahan aate hain (info, warnings) - fatal nahi hote
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0 && !outputData) {
        console.error("❌ Python stderr:", errorData);
        return reject(new Error("Transcription failed. Check if Python + faster-whisper are installed correctly."));
      }

      try {
        // Last line hi JSON hoti hai (agar warnings print hui hon beech me)
        const lines = outputData.trim().split("\n");
        const jsonLine = lines[lines.length - 1];
        const result = JSON.parse(jsonLine);

        if (result.error) {
          return reject(new Error(result.error));
        }

        console.log(`✅ Transcription complete: ${result.segments.length} segments found`);
        resolve(result);
      } catch (parseErr) {
        console.error("❌ Failed to parse Whisper output:", outputData);
        reject(new Error("Failed to parse transcription result."));
      }
    });

    pythonProcess.on("error", (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}. Is Python installed?`));
    });
  });
};

module.exports = { transcribeAudio };
