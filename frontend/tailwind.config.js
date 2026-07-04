/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Vaani brand palette v2 - vibrant violet + lime accent (glassmorphic, 3D feel)
        primary: {
          50: "#f5f3ff",
          100: "#ece7fe",
          200: "#d9d0fd",
          300: "#bcabfb",
          400: "#9b7ff7",
          500: "#7c5cf4",
          600: "#6a3ff0",
          700: "#5a2fd1",
          800: "#4a27a8",
          900: "#3d2287",
        },
        accent: {
          50: "#fbffe6",
          100: "#f4ffc2",
          200: "#e8ff8a",
          300: "#d7fa4d",
          400: "#c5ee2e",
          500: "#a8d51a",
          600: "#87ad14",
          700: "#688415",
          800: "#556717",
          900: "#485718",
        },
        cream: {
          DEFAULT: "#fdfaf3",
          card: "#ffffff",
          border: "#f0e8d8",
        },
        dark: {
          bg: "#0c0a14",
          surface: "#16121f",
          card: "#1c1729",
          border: "#2d2640",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(124, 92, 244, 0.25)",
        "glow-lg": "0 0 60px rgba(124, 92, 244, 0.35)",
        "glow-accent": "0 0 30px rgba(197, 238, 46, 0.3)",
        soft: "0 8px 30px rgba(124, 92, 244, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 1.5s infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(4deg)" },
        },
      },
    },
  },
  plugins: [],
};
