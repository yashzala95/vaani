// ==============================================
// Loader Component
// Reusable loading spinner - attractive animation ke saath
// ==============================================

import React from "react";

const Loader = ({ size = "md", label }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-[3px]",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-primary-500/20 border-t-primary-500 animate-spin`}
        />
      </div>
      {label && <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{label}</p>}
    </div>
  );
};

export default Loader;
