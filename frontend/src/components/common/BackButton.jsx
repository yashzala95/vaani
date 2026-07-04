// ==============================================
// Back Button Component
// Previous page/step par navigate karne ke liye
// Prominent pill-style button (missable text-link nahi)
// ==============================================

import React from "react";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick, label = "Back" }) => (
  <button
    onClick={onClick}
    className="relative z-20 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full
    bg-white/90 dark:bg-dark-surface/90 border border-cream-border dark:border-dark-border
    text-gray-700 dark:text-gray-200 hover:border-primary-400 hover:text-primary-600
    dark:hover:text-primary-300 shadow-sm transition-all duration-200 hover:-translate-x-0.5 mb-5"
  >
    <ArrowLeft className="w-4 h-4" />
    {label}
  </button>
);

export default BackButton;
