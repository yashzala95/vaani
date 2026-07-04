// ==============================================
// SRT Generator
// Captions array ko .srt subtitle format me convert karta hai
// ==============================================

/**
 * Seconds ko SRT time format me convert karo: 00:00:01,500
 */
const formatSRTTime = (seconds) => {
  const date = new Date(0);
  date.setMilliseconds(seconds * 1000);

  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  const ms = String(date.getUTCMilliseconds()).padStart(3, "0");

  return `${hh}:${mm}:${ss},${ms}`;
};

/**
 * Captions array leke poora SRT file content string banata hai
 * @param {Array} captions - [{ start, end, text }]
 * @returns {string}
 */
const generateSRT = (captions) => {
  return captions
    .map((caption, index) => {
      const start = formatSRTTime(caption.start);
      const end = formatSRTTime(caption.end);
      return `${index + 1}\n${start} --> ${end}\n${caption.text}\n`;
    })
    .join("\n");
};

module.exports = { generateSRT, formatSRTTime };
