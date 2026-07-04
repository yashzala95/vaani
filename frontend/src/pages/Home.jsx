// ==============================================
// Home Page (Dashboard)
// Upload -> Preview -> Generate Captions -> Editor flow
// ==============================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import UploadBox from "../components/UploadBox/UploadBox";
import VideoPreview from "../components/VideoPreview/VideoPreview";
import ProcessingScreen from "../components/common/ProcessingScreen";
import Toast from "../components/common/Toast";
import { FloatingBadges } from "../components/common/FloatingDecor";
import { useApp } from "../context/AppContext";
import { uploadVideo, generateCaptions, getAssetUrl } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const { videoData, setVideoData, setCaptions, setStyle, DEFAULT_STYLE } = useApp();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [language, setLanguage] = useState("auto");
  const [error, setError] = useState("");

  // ------------------- FILE SELECT + UPLOAD -------------------
  const handleFileSelected = async (file) => {
    setError("");
    setSelectedFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file)); // Instant local preview (upload complete hone se pehle hi)
    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadVideo(file, setUploadProgress);
      const data = response.data.data;

      setVideoData({
        videoId: data.videoId,
        videoUrl: getAssetUrl(data.videoUrl),
        originalName: data.originalName,
        duration: data.duration,
        width: data.width,
        height: data.height,
      });
      setStyle(DEFAULT_STYLE);
    } catch (err) {
      const message = err.response?.data?.message || "Upload failed. Please try again.";
      setError(message);
      setLocalPreviewUrl(null);
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  // ------------------- RESET -------------------
  const handleReset = () => {
    setVideoData(null);
    setLocalPreviewUrl(null);
    setSelectedFile(null);
    setUploadProgress(0);
    setLanguage("auto");
  };

  // ------------------- GENERATE CAPTIONS -------------------
  const handleGenerate = async () => {
    if (!videoData?.videoId) return;
    setGenerating(true);
    setError("");

    try {
      const response = await generateCaptions(videoData.videoId, language);
      setCaptions(response.data.data.captions);
      navigate("/editor");
    } catch (err) {
      const message = err.response?.data?.message || "Caption generation failed. Please try again.";
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  // Preview ke liye local blob URL use karo jab tak upload complete na ho, fir server URL
  const previewUrl = videoData?.videoUrl || localPreviewUrl;

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Hero heading - sirf tab dikhta hai jab kuch upload nahi hua */}
      {!previewUrl && !uploading && (
        <div className="text-center mb-10 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-200/60 dark:bg-accent-500/10 text-accent-700 dark:text-accent-300 text-xs font-semibold mb-4">
            ✨ Powered by AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Automatic Video <span className="text-primary-500">Captions</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Upload your video and let AI generate accurate, time-synced captions automatically — fast and free.
          </p>
        </div>
      )}

      <div className="relative z-10 w-full flex justify-center">
        {!previewUrl && !uploading && !generating && <FloatingBadges />}

        {/* Generating -> Processing Screen */}
        {generating ? (
          <ProcessingScreen />
        ) : previewUrl ? (
          <VideoPreview
            videoUrl={previewUrl}
            videoName={selectedFile?.name || videoData?.originalName}
            duration={videoData?.duration || 0}
            language={language}
            onLanguageChange={setLanguage}
            onGenerate={handleGenerate}
            onReset={handleReset}
            generating={generating}
          />
        ) : (
          <UploadBox onFileSelected={handleFileSelected} uploading={uploading} uploadProgress={uploadProgress} />
        )}
      </div>

      <Toast message={error} type="error" onClose={() => setError("")} />
    </div>
  );
};

export default Home;
