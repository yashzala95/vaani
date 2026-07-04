// ==============================================
// Video Model (MongoDB - Optional)
// Agar DB connected nahi hai to ye model use hi nahi hoga,
// controller me hum in-memory fallback bhi rakhenge
// ==============================================

const mongoose = require("mongoose");

const captionSchema = new mongoose.Schema(
  {
    start: { type: Number, required: true }, // seconds me
    end: { type: Number, required: true },
    text: { type: String, required: true },
    words: [
      {
        word: String,
        start: Number,
        end: Number,
      },
    ],
  },
  { _id: true }
);

const videoSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // UUID use karte hain, MongoDB ka default ObjectId nahi
    originalName: { type: String, required: true },
    fileName: { type: String, required: true }, // disk par saved naam
    filePath: { type: String, required: true },
    audioPath: { type: String },
    duration: { type: Number }, // seconds
    width: { type: Number },
    height: { type: Number },
    exportedPath: { type: String }, // final captioned video ka path
    status: {
      type: String,
      enum: ["uploaded", "extracting_audio", "transcribing", "ready", "exporting", "completed", "failed"],
      default: "uploaded",
    },
    captions: [captionSchema],
    // Styling preferences (Step 4-5 me use honge)
    style: {
      fontSize: { type: Number, default: 28 },
      fontColor: { type: String, default: "#FFFFFF" },
      backgroundColor: { type: String, default: "rgba(0,0,0,0.6)" },
      position: { type: String, enum: ["top", "center", "bottom"], default: "bottom" },
      outline: { type: Boolean, default: true },
      shadow: { type: Boolean, default: true },
      animation: { type: String, enum: ["none", "fade", "pop", "slide"], default: "fade" },
      wordHighlight: { type: Boolean, default: false },
    },
    language: { type: String, default: "auto" },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
