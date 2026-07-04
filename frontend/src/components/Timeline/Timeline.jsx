// ==============================================
// Timeline Component
// Video duration ke hisaab se caption blocks dikhata hai
// Click karke seek kar sakte ho
// ==============================================

import React, { useRef } from "react";

const Timeline = ({ captions, duration, currentTime, activeIndex, onSeek }) => {
  const trackRef = useRef(null);

  const handleTrackClick = (e) => {
    if (!trackRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, clickRatio * duration)));
  };

  const playheadPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="card p-4">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>0:00</span>
        <span>{duration ? `${Math.floor(duration / 60)}:${String(Math.round(duration % 60)).padStart(2, "0")}` : "0:00"}</span>
      </div>

      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative h-14 bg-gray-100 dark:bg-dark-surface rounded-lg cursor-pointer overflow-hidden"
      >
        {/* Caption blocks */}
        {captions.map((caption, idx) => {
          const left = duration ? (caption.start / duration) * 100 : 0;
          const width = duration ? ((caption.end - caption.start) / duration) * 100 : 0;
          return (
            <div
              key={idx}
              style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%` }}
              className={`absolute top-2 bottom-2 rounded-md transition-colors ${
                activeIndex === idx ? "bg-primary-500" : "bg-primary-500/40 hover:bg-primary-500/60"
              }`}
              title={caption.text}
            />
          );
        })}

        {/* Playhead */}
        <div
          style={{ left: `${playheadPercent}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-glow pointer-events-none"
        />
      </div>
    </div>
  );
};

export default Timeline;
