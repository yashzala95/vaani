// ==============================================
// Editor Page
// Video preview + Caption overlay + Timeline +
// Caption editing + Style customization
// ==============================================

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ArrowRight, FileText } from "lucide-react";

import CaptionOverlay from "../components/CaptionEditor/CaptionOverlay";
import CaptionList from "../components/CaptionEditor/CaptionList";
import Timeline from "../components/Timeline/Timeline";
import CustomizationPanel from "../components/CustomizationPanel/CustomizationPanel";
import Toast from "../components/common/Toast";
import BackButton from "../components/common/BackButton";
import { useApp } from "../context/AppContext";
import { updateCaptions, getSRTDownloadUrl, getVTTDownloadUrl } from "../services/api";

const Editor = () => {
  const navigate = useNavigate();
  const { videoData, captions, setCaptions, style, setStyle } = useApp();

  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Agar seedha /editor pe aa gaye bina video upload kiye, to home bhej do
  useEffect(() => {
    if (!videoData) {
      navigate("/");
    }
  }, [videoData, navigate]);

  // ------------------- ACTIVE CAPTION -------------------
  const activeIndex = useMemo(() => {
    return captions.findIndex((c) => currentTime >= c.start && currentTime <= c.end);
  }, [captions, currentTime]);

  const activeCaption = activeIndex >= 0 ? captions[activeIndex] : null;

  // ------------------- HANDLERS -------------------
  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTextChange = (idx, text) => {
    const updated = [...captions];
    updated[idx] = { ...updated[idx], text };
    setCaptions(updated);
  };

  const handleTimeChange = (idx, field, value) => {
    const updated = [...captions];
    updated[idx] = { ...updated[idx], [field]: value };
    setCaptions(updated);
  };

  const handleDelete = (idx) => {
    setCaptions(captions.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateCaptions(videoData.videoId, captions);
      setSuccess("Captions saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save captions.");
    } finally {
      setSaving(false);
    }
  };

  const handleContinueToExport = async () => {
    await handleSave();
    navigate("/export");
  };

  if (!videoData) return null;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
      <BackButton onClick={() => navigate("/")} label="Back to Upload" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ------------------- LEFT: Video + Timeline ------------------- */}
        <div className="flex-1 space-y-6">
          <div className="card overflow-hidden">
            <div className="relative bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={videoData.videoUrl}
                controls
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                className="max-h-[500px] w-full"
              />
              <CaptionOverlay caption={activeCaption} style={style} currentTime={currentTime} />
            </div>
          </div>

          <Timeline
            captions={captions}
            duration={videoData.duration}
            currentTime={currentTime}
            activeIndex={activeIndex}
            onSeek={handleSeek}
          />

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-secondary flex items-center gap-2">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <a
              href={getSRTDownloadUrl(videoData.videoId)}
              className="btn-secondary flex items-center gap-2"
              download
            >
              <FileText className="w-4 h-4" /> SRT
            </a>
            <a
              href={getVTTDownloadUrl(videoData.videoId)}
              className="btn-secondary flex items-center gap-2"
              download
            >
              <Download className="w-4 h-4" /> VTT
            </a>
            <button onClick={handleContinueToExport} className="btn-primary flex items-center gap-2 ml-auto">
              Continue to Export <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <CaptionList
            captions={captions}
            activeIndex={activeIndex}
            onTextChange={handleTextChange}
            onTimeChange={handleTimeChange}
            onDelete={handleDelete}
            onSeek={handleSeek}
          />
        </div>

        {/* ------------------- RIGHT: Customization ------------------- */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <CustomizationPanel style={style} onChange={setStyle} />
          </div>
        </div>
      </div>

      <Toast message={error} type="error" onClose={() => setError("")} />
      <Toast message={success} type="success" onClose={() => setSuccess("")} />
    </div>
  );
};

export default Editor;
