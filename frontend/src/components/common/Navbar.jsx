// ==============================================
// Navbar Component
// App's top navigation - Vaani logo + dark mode toggle
// ==============================================

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useApp } from "../../context/AppContext";

const Navbar = () => {
  const { darkMode, setDarkMode } = useApp();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-cream/70 dark:bg-dark-bg/70 border-b border-cream-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={() => navigate("/")} className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Vaani"
              className="h-9 w-9 object-contain rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-display italic tracking-wide">vaani</span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-primary-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
