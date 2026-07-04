// ==============================================
// Floating Decor Component
// Background me glowing orbs + floating info badges
// jo Vaani ke AI captioning features ko highlight karte hain
// ==============================================

import React from "react";
import { AudioWaveform, Sparkles, Languages } from "lucide-react";

export const BackgroundOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="orb w-72 h-72 bg-primary-400 top-10 -left-10 animate-float" />
    <div className="orb w-64 h-64 bg-accent-300 top-40 right-0 animate-float-delayed" />
    <div className="orb w-56 h-56 bg-primary-300 bottom-0 left-1/4 animate-float" />
  </div>
);

/**
 * Hero section ke around floating info cards - reference design
 * ("Passionate Problem Solver" style) se inspired, par tool-relevant content
 */
export const FloatingBadges = () => (
  <>
    <div className="hidden lg:flex absolute top-6 -right-6 xl:right-2 items-start gap-3 card px-4 py-3 max-w-[200px] animate-float shadow-glow">
      <div className="w-9 h-9 rounded-xl bg-accent-300/40 flex items-center justify-center flex-shrink-0">
        <AudioWaveform className="w-4.5 h-4.5 text-accent-700" />
      </div>
      <div>
        <p className="text-xs font-semibold leading-tight">Word-level Sync</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Precise timing</p>
      </div>
    </div>

    <div className="hidden lg:flex absolute bottom-10 -left-8 xl:left-2 items-start gap-3 card px-4 py-3 max-w-[210px] animate-float-delayed shadow-glow">
      <div className="w-9 h-9 rounded-xl bg-primary-200/60 dark:bg-primary-500/20 flex items-center justify-center flex-shrink-0">
        <Languages className="w-4.5 h-4.5 text-primary-600 dark:text-primary-300" />
      </div>
      <div>
        <p className="text-xs font-semibold leading-tight">Multi-language</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Auto-detected</p>
      </div>
    </div>

    <div className="hidden xl:flex absolute top-1/2 -right-14 items-start gap-2 card px-3.5 py-2.5 max-w-[170px] animate-float">
      <Sparkles className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
      <p className="text-[11px] font-medium leading-tight">100% Free & Local AI</p>
    </div>
  </>
);
