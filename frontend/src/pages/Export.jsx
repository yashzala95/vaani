// ==============================================
// Export Page
// Burns captions into the video and lets the user
// preview + download the final MP4
// ==============================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle2, Film, RotateCcw } from "lucide-react";

import CaptionOverlay from "../components/CaptionEditor/CaptionOverlay";
import Toast from "../components/common/Toast";
import BackButton from "../components/common/BackButton";
import { useApp } from "../context/AppContext";
import { exportVideo, getDownloadUrl, getExportedPreviewUrl } from "../services/api";

const Export = () => {
  const navigate = useNavigate();
  const { videoData, captions, style, resetProject } = useApp();

  const [exporting, setExporting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [exportedUrl, setExportedUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!videoData) navigate("/");
  }, [videoData, navigate]);

  const previewCaption = captions[0] || null;

  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      await exportVideo(videoData.videoId, style);
      // Final burned-in video ka direct preview URL (download attachment nahi, seedha stream hota hai)
      setExportedUrl(`${getExportedPreviewUrl(videoData.videoId)}?t=${Date.now()}`);
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleStartNew = () => {
    resetProject();
    navigate("/");
  };

  if (!videoData) return null;

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      <BackButton onClick={() => navigate("/editor")} label="Back to Editor" />

      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Export Your Video</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Captions will be permanently burned into the video — ready for MP4 download
        </p>
      </div>

      {/* Preview: final exported video after completion, otherwise a live style preview */}
      <div className="card overflow-hidden mb-6">
        <div className="relative bg-black flex items-center justify-center">
          {completed ? (
            <video src={exportedUrl} controls autoPlay className="max-h-[420px] w-full" />
          ) : (
            <>
              <video src={videoData.videoUrl} controls className="max-h-[420px] w-full" />
              <CaptionOverlay caption={previewCaption} style={style} currentTime={previewCaption?.start || 0} />
            </>
          )}
        </div>
      </div>

      {/* Style summary */}
      <div className="card p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <SummaryItem label="Font Size" value={`${style.fontSize}px`} />
        <SummaryItem label="Position" value={style.position} />
        <SummaryItem label="Animation" value={style.animation} />
        <SummaryItem label="Captions" value={captions.length} />
      </div>

      {/* Action Area */}
      <div className="card p-8 text-center">
        {completed ? (
          <div className="animate-fade-in space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Export Complete! 🎉</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your video is ready with captions — preview it above or download it
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <a href={getDownloadUrl(videoData.videoId)} className="btn-primary flex items-center gap-2" download>
                <Download className="w-4 h-4" /> Download MP4
              </a>
              <button onClick={handleStartNew} className="btn-secondary flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Start New Project
              </button>
            </div>
          </div>
        ) : exporting ? (
          <div className="space-y-4 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-lg">
                <Film className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h3 className="font-semibold">Burning captions into video...</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This may take a moment depending on your video's length. Please wait.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-500/10 flex items-center justify-center">
              <Film className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="font-semibold">Ready to export</h3>
            <button onClick={handleExport} className="btn-primary flex items-center gap-2 mx-auto">
              <Download className="w-4 h-4" /> Export Video
            </button>
          </div>
        )}
      </div>

      <Toast message={error} type="error" onClose={() => setError("")} />
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
    <p className="font-semibold capitalize">{value}</p>
  </div>
);

export default Export;
