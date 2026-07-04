// ==============================================
// Caption List Component
// Har caption ka text aur timing manually edit karne
// ke liye editable list
// ==============================================

import React from "react";
import { Trash2 } from "lucide-react";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  return `${m}:${s.padStart(4, "0")}`;
};

const CaptionList = ({ captions, activeIndex, onTextChange, onTimeChange, onDelete, onSeek }) => {
  return (
    <div className="card p-4">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
        Captions ({captions.length})
      </h3>
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {captions.map((caption, idx) => (
          <div
            key={idx}
            onClick={() => onSeek(caption.start)}
            className={`p-3 rounded-xl border cursor-pointer transition-colors ${
              activeIndex === idx
                ? "border-primary-500 bg-primary-500/5"
                : "border-gray-200 dark:border-dark-border hover:border-primary-400/50"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <input
                  type="number"
                  step="0.1"
                  value={caption.start}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onTimeChange(idx, "start", parseFloat(e.target.value) || 0)}
                  className="w-16 bg-transparent border-b border-dashed border-gray-300 dark:border-dark-border focus:outline-none focus:border-primary-500"
                />
                <span>→</span>
                <input
                  type="number"
                  step="0.1"
                  value={caption.end}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onTimeChange(idx, "end", parseFloat(e.target.value) || 0)}
                  className="w-16 bg-transparent border-b border-dashed border-gray-300 dark:border-dark-border focus:outline-none focus:border-primary-500"
                />
                <span className="text-gray-400">({formatTime(caption.start)})</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(idx);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={caption.text}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onTextChange(idx, e.target.value)}
              rows={1}
              className="w-full bg-transparent text-sm resize-none focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaptionList;
