// ==============================================
// Progress Bar Component
// Upload/processing progress dikhane ke liye
// ==============================================

import React from "react";

const ProgressBar = ({ percent = 0, label }) => {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-300">{label}</span>
          <span className="text-primary-500 font-medium">{clamped}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-200 dark:bg-dark-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
