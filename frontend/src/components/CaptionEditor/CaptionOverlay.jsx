// ==============================================
// Caption Overlay Component
// Video ke upar current caption ko styled subtitle
// ki tarah render karta hai (word-highlight support ke saath)
// ==============================================

import React from "react";

const positionClasses = {
  top: "items-start pt-6",
  center: "items-center",
  bottom: "items-end pb-6",
};

const animationClasses = {
  none: "",
  fade: "animate-fade-in",
  pop: "animate-caption-pop",
  slide: "animate-caption-slide",
};

const CaptionOverlay = ({ caption, style, currentTime }) => {
  if (!caption) return null;

  const {
    fontSize = 28,
    fontColor = "#FFFFFF",
    backgroundColor = "rgba(0,0,0,0.6)",
    position = "bottom",
    outline = true,
    shadow = true,
    animation = "fade",
    wordHighlight = false,
  } = style || {};

  const textShadow = [
    outline ? "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" : "",
    shadow ? "2px 2px 6px rgba(0,0,0,0.8)" : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={`absolute inset-0 flex justify-center px-4 pointer-events-none ${positionClasses[position]}`}>
      <div
        key={caption.start} // key change karne se re-animate hota hai har naye caption pe
        className={`max-w-[90%] text-center rounded-lg px-4 py-1.5 ${animationClasses[animation] || ""}`}
        style={{
          fontSize: `${fontSize}px`,
          color: fontColor,
          backgroundColor,
          textShadow,
          lineHeight: 1.3,
          fontWeight: 600,
        }}
      >
        {wordHighlight && caption.words?.length > 0
          ? caption.words.map((word, idx) => {
              const isActive = currentTime >= word.start && currentTime <= word.end;
              return (
                <span
                  key={idx}
                  style={{
                    color: isActive ? "#FFD700" : fontColor,
                    transition: "color 0.1s ease",
                  }}
                >
                  {word.word}{" "}
                </span>
              );
            })
          : caption.text}
      </div>
    </div>
  );
};

export default CaptionOverlay;
