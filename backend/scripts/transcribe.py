"""
==============================================
Whisper Transcription Script
Audio file leta hai, transcribe karta hai, aur
word-level timestamps ke saath JSON output deta hai
Usage: python transcribe.py <audio_path> <model_size> <language>
==============================================
"""

import sys
import json

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Audio path not provided"}))
        sys.exit(1)

    audio_path = sys.argv[1]
    model_size = sys.argv[2] if len(sys.argv) > 2 else "small"
    language = sys.argv[3] if len(sys.argv) > 3 else "auto"

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print(json.dumps({
            "error": "faster-whisper not installed. Run: pip install -r scripts/requirements.txt"
        }))
        sys.exit(1)

    try:
        # CPU par chalega (free, no GPU needed). int8 = fast + kam memory
        model = WhisperModel(model_size, device="cpu", compute_type="int8")

        lang_param = None if language == "auto" else language

        segments, info = model.transcribe(
            audio_path,
            language=lang_param,
            word_timestamps=True,   # word-by-word highlighting ke liye zaroori
            vad_filter=True,        # silence hata deta hai
        )

        result_segments = []
        for seg in segments:
            words_list = []
            if seg.words:
                for w in seg.words:
                    words_list.append({
                        "word": w.word.strip(),
                        "start": round(w.start, 2),
                        "end": round(w.end, 2),
                    })

            result_segments.append({
                "start": round(seg.start, 2),
                "end": round(seg.end, 2),
                "text": seg.text.strip(),
                "words": words_list,
            })

        output = {
            "success": True,
            "language": info.language,
            "duration": info.duration,
            "segments": result_segments,
        }

        # Ye print hoga aur Node.js isko capture karega
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
