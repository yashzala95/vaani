// ==============================================
// Toast Component
// Error/success messages dikhane ke liye chhota notification
// ==============================================

import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 5000); // 5 sec baad auto-close
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === "error";

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-up max-w-sm">
      <div
        className={`card flex items-start gap-3 p-4 shadow-glow border-l-4 ${
          isError ? "border-l-red-500" : "border-l-green-500"
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        )}
        <p className="text-sm text-gray-800 dark:text-gray-200 flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
