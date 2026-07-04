// ==============================================
// ASS (Advanced SubStation Alpha) Subtitle Generator
// Captions ko styled .ass file me convert karta hai jo
// FFmpeg (libass) burn-in ke liye use karta hai.
// Ye format font, color, position, outline, shadow,
// animation aur word-by-word highlighting sab support karta hai.
// ==============================================

/**
 * #RRGGBB hex color ko ASS format (&HAABBGGRR&) me convert karta hai
 * ASS BGR order use karta hai, hex ke ulta
 */
const hexToASSColor = (hex, alpha = "00") => {
  if (!hex) return `&H${alpha}FFFFFF`;
  const clean = hex.replace("#", "");
  const r = clean.substring(0, 2);
  const g = clean.substring(2, 4);
  const b = clean.substring(4, 6);
  return `&H${alpha}${b}${g}${r}`.toUpperCase();
};

/**
 * "rgba(r,g,b,a)" string ko ASS color + alpha me convert karta hai
 */
const rgbaToASSColor = (rgba) => {
  if (!rgba || !rgba.startsWith("rgba")) return { color: "&H00000000", opaque: false };

  const match = rgba.match(/rgba?\(([^)]+)\)/);
  if (!match) return { color: "&H00000000", opaque: false };

  const [r, g, b, a = 1] = match[1].split(",").map((v) => parseFloat(v.trim()));
  // ASS alpha: 00 = fully opaque, FF = fully transparent (ulta hota hai CSS se)
  const alphaHex = Math.round((1 - a) * 255).toString(16).padStart(2, "0").toUpperCase();
  const toHex = (n) => Math.round(n).toString(16).padStart(2, "0").toUpperCase();

  return {
    color: `&H${alphaHex}${toHex(b)}${toHex(g)}${toHex(r)}`,
    opaque: a > 0.05,
  };
};

/**
 * Position string ("top"/"center"/"bottom") ko ASS Alignment number me convert karta hai
 * ASS alignment numpad-style hota hai: 2=bottom-center, 5=mid-center, 8=top-center
 */
const positionToAlignment = (position) => {
  switch (position) {
    case "top":
      return 8;
    case "center":
      return 5;
    case "bottom":
    default:
      return 2;
  }
};

/**
 * Seconds ko ASS time format me convert karta hai: 0:00:01.50
 */
const formatASSTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.round((seconds % 1) * 100); // centiseconds
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
};

/**
 * Animation ke hisaab se ASS override tags banata hai
 * Ye caption text ke shuru me lagte hain: {\fad(...)}Text
 */
const getAnimationTag = (animation) => {
  switch (animation) {
    case "fade":
      return "{\\fad(250,250)}";
    case "pop":
      // Scale up-down pop effect
      return "{\\t(0,150,\\fscx115\\fscy115)\\t(150,300,\\fscx100\\fscy100)}";
    case "slide":
      // Vertical slide-in effect (niche se upar aata hai)
      return "{\\t(0,250,\\frz0)}";
    case "none":
    default:
      return "";
  }
};

/**
 * Word-level karaoke-style highlight tags banata hai (\k tags)
 * Har word apni duration ke hisaab se highlight hota hai
 */
const buildKaraokeText = (caption) => {
  if (!caption.words || caption.words.length === 0) {
    return caption.text;
  }

  let result = "";
  let prevEnd = caption.start;

  caption.words.forEach((word) => {
    // Centiseconds me duration (gap + word dono cover karta hai)
    const durationCs = Math.max(1, Math.round((word.end - prevEnd) * 100));
    result += `{\\k${durationCs}}${word.word} `;
    prevEnd = word.end;
  });

  return result.trim();
};

/**
 * Poora .ass subtitle file content generate karta hai
 * @param {Object} params
 * @param {Array} params.captions - caption objects array
 * @param {Object} params.style - styling options
 * @param {number} params.videoWidth
 * @param {number} params.videoHeight
 */
const generateASS = ({ captions, style, videoWidth = 1280, videoHeight = 720 }) => {
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

  const alignment = positionToAlignment(position);
  const primaryColor = hexToASSColor(fontColor, "00");
  const highlightColor = hexToASSColor("#FFD700", "00"); // gold - highlighted word ka color
  const bg = rgbaToASSColor(backgroundColor);

  const borderStyle = bg.opaque ? 3 : 1; // 3 = opaque box background, 1 = outline only
  const outlineWidth = outline ? 2 : 0;
  const shadowDepth = shadow ? 2 : 0;
  const marginV = position === "center" ? Math.round(videoHeight / 2 - fontSize) : 40;

  // ------------------- HEADER -------------------
  const header = `[Script Info]
Title: AI Generated Captions
ScriptType: v4.00+
PlayResX: ${videoWidth}
PlayResY: ${videoHeight}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,${fontSize},${primaryColor},${highlightColor},&H00000000,${bg.color},0,0,0,0,100,100,0,0,${borderStyle},${outlineWidth},${shadowDepth},${alignment},20,20,${marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  // ------------------- DIALOGUE LINES -------------------
  const animTag = getAnimationTag(animation);

  const lines = captions
    .map((caption) => {
      const start = formatASSTime(caption.start);
      const end = formatASSTime(caption.end);
      const text = wordHighlight ? buildKaraokeText(caption) : caption.text;
      // Newlines ko ASS format me convert karo (\N)
      const safeText = text.replace(/\n/g, "\\N");
      return `Dialogue: 0,${start},${end},Default,,0,0,0,,${animTag}${safeText}`;
    })
    .join("\n");

  return header + lines;
};

module.exports = { generateASS, hexToASSColor, rgbaToASSColor };
