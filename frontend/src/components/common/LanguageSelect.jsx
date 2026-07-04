// ==============================================
// Language Select Component
// Video ki language choose karne ke liye dropdown
// (Whisper isse better accuracy ke saath transcribe karta hai)
// ==============================================

import React, { useState, useRef, useEffect } from "react";
import { Globe2, ChevronDown, Check } from "lucide-react";

// Whisper ke saath achi tarah supported common languages
export const LANGUAGES = [
  { code: "auto", label: "Auto Detect" },
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ar", label: "Arabic" },
  { code: "ru", label: "Russian" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" },
  { code: "tr", label: "Turkish" },
  { code: "ur", label: "Urdu" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "mr", label: "Marathi" },
  { code: "gu", label: "Gujarati" },
];

const LanguageSelect = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = LANGUAGES.find((l) => l.code === value) || LANGUAGES[0];

  // Bahar click karne par dropdown close ho jaye
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
        Video Language
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-cream-border
        dark:border-dark-border bg-white dark:bg-dark-surface hover:border-primary-400 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Globe2 className="w-4 h-4 text-primary-500" />
          {selected.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto card p-1.5 shadow-glow animate-fade-in">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onChange(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                lang.code === value
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-300 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-dark-card"
              }`}
            >
              {lang.label}
              {lang.code === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;
