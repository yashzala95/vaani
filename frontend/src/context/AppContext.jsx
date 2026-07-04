// ==============================================
// App Context
// Poore app me video data, captions, style, aur
// dark mode state share karne ke liye
// ==============================================

import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

const DEFAULT_STYLE = {
  fontSize: 28,
  fontColor: "#FFFFFF",
  backgroundColor: "rgba(0,0,0,0.6)",
  position: "bottom",
  outline: true,
  shadow: true,
  animation: "fade",
  wordHighlight: false,
};

export const AppProvider = ({ children }) => {
  // ------------------- DARK MODE -------------------
  const [darkMode, setDarkMode] = useState(() => {
    // Default light/warm mode on (reference design jaisa warm white feel)
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // ------------------- VIDEO STATE -------------------
  const [videoData, setVideoData] = useState(null); // { videoId, videoUrl, duration, ... }
  const [captions, setCaptions] = useState([]);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [processingStatus, setProcessingStatus] = useState("idle"); // idle | uploading | transcribing | ready | exporting | completed | failed
  const [errorMessage, setErrorMessage] = useState("");

  const resetProject = () => {
    setVideoData(null);
    setCaptions([]);
    setStyle(DEFAULT_STYLE);
    setProcessingStatus("idle");
    setErrorMessage("");
  };

  const value = {
    darkMode,
    setDarkMode,
    videoData,
    setVideoData,
    captions,
    setCaptions,
    style,
    setStyle,
    processingStatus,
    setProcessingStatus,
    errorMessage,
    setErrorMessage,
    resetProject,
    DEFAULT_STYLE,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook - components me easily context use karne ke liye
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
