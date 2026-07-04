// ==============================================
// Video Preview Component
// Uploaded video ka preview + Language select +
// Generate Captions button + "Choose Different Video"
// ==============================================

import React from "react";
import { Sparkles, RotateCcw, Clock } from "lucide-react";
import LanguageSelect from "../common/LanguageSelect";

const VideoPreview = ({ videoUrl, videoName, duration, language, onLanguageChange, onGenerate, onReset, generating }) => {
  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-slide-up">
      <div className="card overflow-hidden">
        {/* Video player */}
        <div className="bg-black flex items-center justify-center">
          <video src={videoUrl} controls className="max-h-[420px] w-full" />
        </div>

        {/* Info + actions */}
        <div className="p-5 space-y-4">
          <div>
            <p className="font-medium truncate">{videoName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Language selector - Whisper isse behtar accuracy ke saath transcribe karta hai */}
          <LanguageSelect value={language} onChange={onLanguageChange} disabled={generating} />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onReset}
              disabled={generating}
              className="btn-secondary flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Choose Different Video
            </button>

            <button
              onClick={onGenerate}
              disabled={generating}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Captions
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
