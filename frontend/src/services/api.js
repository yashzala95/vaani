// ==============================================
// API Service
// Backend ke saare API calls yahan centralized hain
// ==============================================

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10 * 60 * 1000, // 10 minutes - transcription/export lambi videos ke liye time le sakta hai
});

// ------------------- UPLOAD -------------------

/**
 * Video upload karta hai with progress tracking
 */
export const uploadVideo = (file, onProgress) => {
  const formData = new FormData();
  formData.append("video", file);

  return api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
};

// ------------------- CAPTIONS -------------------

/**
 * Whisper se captions generate karta hai
 */
export const generateCaptions = (videoId, language = "auto") => {
  return api.post(`/api/caption/${videoId}/generate`, { language });
};

/**
 * Captions fetch karta hai
 */
export const getCaptions = (videoId) => {
  return api.get(`/api/caption/${videoId}`);
};

/**
 * Captions edit/update karta hai
 */
export const updateCaptions = (videoId, captions) => {
  return api.put(`/api/caption/${videoId}`, { captions });
};

/**
 * SRT/VTT file download URLs
 */
export const getSRTDownloadUrl = (videoId) => `${API_BASE_URL}/api/caption/${videoId}/srt`;
export const getVTTDownloadUrl = (videoId) => `${API_BASE_URL}/api/caption/${videoId}/vtt`;

// ------------------- EXPORT -------------------

/**
 * Video export karta hai (captions burn-in)
 */
export const exportVideo = (videoId, style) => {
  return api.post(`/api/export/${videoId}`, { style });
};

/**
 * Export status check karta hai
 */
export const getExportStatus = (videoId) => {
  return api.get(`/api/export/${videoId}/status`);
};

/**
 * Final video download URL
 */
export const getDownloadUrl = (videoId) => `${API_BASE_URL}/api/export/${videoId}/download`;

/**
 * Final exported video ka INLINE preview URL (static file serve karta hai,
 * download force nahi karta - isse browser me directly play ho sakta hai)
 */
export const getExportedPreviewUrl = (videoId) => `${API_BASE_URL}/outputs/${videoId}-final.mp4`;

/**
 * Video/asset ka full URL banata hai (relative path se)
 */
export const getAssetUrl = (relativePath) => {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  return `${API_BASE_URL}${relativePath}`;
};

export default api;
