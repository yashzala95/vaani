// ==============================================
// Processing Screen Component
// Jab Whisper audio transcribe kar raha ho, tab ye
// attractive full-section loading screen dikhta hai
// ==============================================

import React, { useEffect, useState } from "react";
import { AudioLines, Sparkles, CheckCircle2 } from "lucide-react";

const STEPS = [
  { label: "Extracting audio", icon: AudioLines },
  { label: "Transcribing speech with AI", icon: Sparkles },
  { label: "Syncing captions to timeline", icon: CheckCircle2 },
];

const ProcessingScreen = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Steps ko automatically cycle karo (visual feedback ke liye,
  // actual processing backend me chal rahi hai)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in text-center py-10">
      {/* Animated glowing orb */}
      <div className="relative w-28 h-28 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-primary-500/30 animate-pulse-slow" />
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">Generating AI Captions</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        This may take a moment depending on your video's length
      </p>

      {/* Steps */}
      <div className="space-y-3 text-left">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                isActive
                  ? "border-primary-500/50 bg-primary-500/5"
                  : isDone
                  ? "border-transparent opacity-60"
                  : "border-transparent opacity-40"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-dark-surface text-gray-400"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
                )}
              </div>
              <span className="text-sm font-medium">{step.label}</span>
              {isActive && (
                <span className="ml-auto flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingScreen;
