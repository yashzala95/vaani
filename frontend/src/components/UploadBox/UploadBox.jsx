// ==============================================
// Upload Box Component
// Drag & drop ya click se video upload karta hai
// Progress bar aur validation ke saath
// ==============================================

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Film } from "lucide-react";
import ProgressBar from "../common/ProgressBar";

const MAX_SIZE_MB = 500;
const ACCEPTED_TYPES = {
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/x-matroska": [".mkv"],
  "video/webm": [".webm"],
  "video/x-msvideo": [".avi"],
};

const UploadBox = ({ onFileSelected, uploading, uploadProgress }) => {
  const [rejectionError, setRejectionError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setRejectionError("");

      if (rejectedFiles?.length > 0) {
        const reason = rejectedFiles[0].errors?.[0]?.message || "Invalid file";
        setRejectionError(reason.includes("size") ? `File too large. Max ${MAX_SIZE_MB}MB allowed.` : reason);
        return;
      }

      if (acceptedFiles?.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`card relative overflow-hidden p-10 sm:p-14 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? "border-primary-500 shadow-glow scale-[1.01]" : "border-dashed border-2 hover:border-primary-400"}
          ${uploading ? "cursor-not-allowed opacity-80" : ""}
        `}
      >
        <input {...getInputProps()} />

        {/* Ambient glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center transition-transform ${
              isDragActive ? "scale-110" : ""
            }`}
          >
            {uploading ? (
              <Film className="w-8 h-8 text-primary-500 animate-pulse" />
            ) : (
              <UploadCloud className="w-8 h-8 text-primary-500" />
            )}
          </div>

          {uploading ? (
            <div className="w-full max-w-xs space-y-2">
              <p className="font-medium">Uploading video...</p>
              <ProgressBar percent={uploadProgress} />
            </div>
          ) : (
            <>
              <div>
                <p className="text-lg font-semibold mb-1">
                  {isDragActive ? "Drop your video here" : "Drag & drop your video"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or <span className="text-primary-500 font-medium">browse</span> to select a file
                </p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                MP4, MOV, MKV, WEBM, AVI • Max {MAX_SIZE_MB}MB
              </p>
            </>
          )}
        </div>
      </div>

      {rejectionError && (
        <p className="text-sm text-red-500 mt-3 text-center">{rejectionError}</p>
      )}
    </div>
  );
};

export default UploadBox;
