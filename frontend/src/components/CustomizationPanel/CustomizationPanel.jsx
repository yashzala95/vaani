// ==============================================
// Customization Panel Component
// Font size, color, background, position, outline,
// shadow, animation, word-highlight controls
// ==============================================

import React from "react";
import { AlignStartVertical, AlignCenterVertical, AlignEndVertical } from "lucide-react";

const POSITIONS = [
  { value: "top", label: "Top", icon: AlignStartVertical },
  { value: "center", label: "Center", icon: AlignCenterVertical },
  { value: "bottom", label: "Bottom", icon: AlignEndVertical },
];

const ANIMATIONS = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "pop", label: "Pop" },
  { value: "slide", label: "Slide" },
];

const CustomizationPanel = ({ style, onChange }) => {
  const update = (key, value) => onChange({ ...style, [key]: value });

  // backgroundColor "rgba(0,0,0,0.6)" se sirf opacity nikalne ke liye helper
  const getBgOpacity = () => {
    const match = style.backgroundColor?.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
    return match ? parseFloat(match[1]) : 0.6;
  };

  const updateBgOpacity = (opacity) => {
    update("backgroundColor", `rgba(0,0,0,${opacity})`);
  };

  return (
    <div className="card p-5 space-y-6">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Customize Captions
      </h3>

      {/* Font Size */}
      <div>
        <label className="text-sm font-medium flex justify-between mb-2">
          <span>Font Size</span>
          <span className="text-primary-500">{style.fontSize}px</span>
        </label>
        <input
          type="range"
          min="14"
          max="60"
          value={style.fontSize}
          onChange={(e) => update("fontSize", parseInt(e.target.value, 10))}
          className="w-full accent-primary-500"
        />
      </div>

      {/* Font Color */}
      <div>
        <label className="text-sm font-medium mb-2 block">Font Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={style.fontColor}
            onChange={(e) => update("fontColor", e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-0"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">{style.fontColor}</span>
        </div>
      </div>

      {/* Background Opacity */}
      <div>
        <label className="text-sm font-medium flex justify-between mb-2">
          <span>Background Opacity</span>
          <span className="text-primary-500">{Math.round(getBgOpacity() * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={getBgOpacity()}
          onChange={(e) => updateBgOpacity(parseFloat(e.target.value))}
          className="w-full accent-primary-500"
        />
      </div>

      {/* Position */}
      <div>
        <label className="text-sm font-medium mb-2 block">Position</label>
        <div className="grid grid-cols-3 gap-2">
          {POSITIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => update("position", value)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                style.position === value
                  ? "border-primary-500 bg-primary-500/10 text-primary-500"
                  : "border-gray-200 dark:border-dark-border hover:border-primary-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Animation */}
      <div>
        <label className="text-sm font-medium mb-2 block">Animation</label>
        <div className="grid grid-cols-4 gap-2">
          {ANIMATIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => update("animation", value)}
              className={`py-2 rounded-xl border text-xs font-medium transition-colors ${
                style.animation === value
                  ? "border-primary-500 bg-primary-500/10 text-primary-500"
                  : "border-gray-200 dark:border-dark-border hover:border-primary-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <ToggleRow label="Outline" checked={style.outline} onChange={(v) => update("outline", v)} />
        <ToggleRow label="Shadow" checked={style.shadow} onChange={(v) => update("shadow", v)} />
        <ToggleRow
          label="Word-by-word Highlight"
          checked={style.wordHighlight}
          onChange={(v) => update("wordHighlight", v)}
        />
      </div>
    </div>
  );
};

const ToggleRow = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
        checked ? "bg-primary-500" : "bg-gray-300 dark:bg-dark-surface"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

export default CustomizationPanel;
