// ==============================================
// VTT Generator
// Captions array ko WebVTT format me convert karta hai
// (web video players ke liye standard format)
// ==============================================

/**
 * Seconds ko VTT time format me convert karo: 00:00:01.500
 */
const formatVTTTime = (seconds) => {
  const date = new Date(0);
  date.setMilliseconds(seconds * 1000);

  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  const ms = String(date.getUTCMilliseconds()).padStart(3, "0");

  return `${hh}:${mm}:${ss}.${ms}`;
};

/**
 * Captions array leke poora VTT file content string banata hai
 * @param {Array} captions - [{ start, end, text }]
 * @returns {string}
 */
const generateVTT = (captions) => {
  const header = "WEBVTT\n\n";
  const body = captions
    .map((caption, index) => {
      const start = formatVTTTime(caption.start);
      const end = formatVTTTime(caption.end);
      return `${index + 1}\n${start} --> ${end}\n${caption.text}\n`;
    })
    .join("\n");

  return header + body;
};

module.exports = { generateVTT, formatVTTTime };
