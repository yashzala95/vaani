// ==============================================
// Caption Processor
// Whisper ke raw segments ko clean, readable captions
// me convert karta hai (auto line-breaking rules ke saath)
// ==============================================

const MAX_CHARS_PER_LINE = 42; // Standard subtitle readability limit
const MAX_WORDS_PER_CAPTION = 10;

/**
 * Whisper segments ko caption blocks me convert karta hai.
 * Lambe segments ko chhote, readable pieces me todta hai
 * (auto line breaking) taaki har caption 1-2 lines me fit ho.
 */
const processSegmentsToCaptions = (segments) => {
  const captions = [];

  segments.forEach((segment) => {
    const words = segment.words || [];

    if (words.length === 0) {
      // Agar word-level data nahi hai, segment ko as-is rakho
      captions.push({
        start: segment.start,
        end: segment.end,
        text: segment.text,
        words: [],
      });
      return;
    }

    // Words ko chunks me todo (max words / max chars ke hisaab se)
    let currentChunk = [];
    let currentText = "";

    words.forEach((word, idx) => {
      const testText = currentText ? `${currentText} ${word.word}` : word.word;

      if (
        currentChunk.length > 0 &&
        (testText.length > MAX_CHARS_PER_LINE || currentChunk.length >= MAX_WORDS_PER_CAPTION)
      ) {
        // Current chunk ko finalize karo aur naya chunk shuru karo
        captions.push(buildCaptionFromWords(currentChunk));
        currentChunk = [word];
        currentText = word.word;
      } else {
        currentChunk.push(word);
        currentText = testText;
      }

      // Last word hai to bacha hua chunk bhi push karo
      if (idx === words.length - 1 && currentChunk.length > 0) {
        captions.push(buildCaptionFromWords(currentChunk));
      }
    });
  });

  return captions;
};

/**
 * Words ka array leke ek caption object banata hai
 */
const buildCaptionFromWords = (words) => {
  return {
    start: words[0].start,
    end: words[words.length - 1].end,
    text: capitalizeFirstLetter(words.map((w) => w.word).join(" ")),
    words,
  };
};

/**
 * Pehla letter capitalize karo (basic readability improvement)
 */
const capitalizeFirstLetter = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

module.exports = { processSegmentsToCaptions };
