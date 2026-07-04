# 🎬 CaptionAI — AI Video Caption Generator

Full-stack web app jo video upload karke automatically time-synced captions generate karta hai (Whisper AI se), jisko customize karke video me permanently burn kiya ja sakta hai.

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (optional — bina DB ke bhi chalega)
- **Video Processing:** FFmpeg
- **Speech-to-Text:** faster-whisper (Python, 100% free & offline)

---

## 📋 Prerequisites (System-level installs)

1. **Node.js** (v18+) — https://nodejs.org
2. **Python** (3.9–3.12 recommended) — https://python.org
3. **FFmpeg** — https://www.gyan.dev/ffmpeg/builds/ (Windows) ya `brew install ffmpeg` (Mac) / `sudo apt install ffmpeg` (Linux)
4. **MongoDB** (optional) — Local install ya [MongoDB Atlas](https://www.mongodb.com/atlas) free tier

---

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
pip install -r scripts/requirements.txt
```

`.env` file edit karo:
```
MONGO_URI=mongodb://127.0.0.1:27017/ai-caption-generator   # optional
CLIENT_URL=http://localhost:5173
WHISPER_MODEL=small
PYTHON_PATH=python3    # Windows par "python" ho sakta hai

# Agar Windows par FFmpeg PATH issue aaye, "where ffmpeg" / "where ffprobe" se path lo:
FFMPEG_PATH=
FFPROBE_PATH=
```

Server start karo:
```bash
npm run dev
```
✅ Backend chalega: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
✅ Frontend chalega: `http://localhost:5173`

---

## 🎯 How to Use

1. Browser me `http://localhost:5173` kholo
2. Video **drag & drop** ya upload karo
3. **"Generate Captions"** click karo (Whisper AI transcribe karega)
4. Editor me captions **edit** karo (text/timing), **customize** karo (font, color, position, animation, word-highlight)
5. **SRT/VTT** files download kar sakte ho
6. **"Continue to Export"** → **"Export Video"** click karo
7. Final captioned MP4 **download** karo 🎉

---

## 📁 Project Structure

```
ai-caption-generator/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Upload, Caption, Export logic
│   │   ├── routes/          # API routes
│   │   ├── services/        # FFmpeg, Whisper, Caption Burn
│   │   ├── models/          # MongoDB schema
│   │   ├── middleware/      # Upload (multer), error handling
│   │   ├── utils/           # SRT/VTT/ASS generators, caption processor
│   │   └── app.js
│   ├── scripts/
│   │   └── transcribe.py    # Whisper Python script
│   ├── uploads/              # Uploaded videos
│   ├── outputs/               # Audio, subtitles, exported videos
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── UploadBox/
        │   ├── VideoPreview/
        │   ├── CaptionEditor/     # Overlay + List
        │   ├── Timeline/
        │   ├── CustomizationPanel/
        │   └── common/            # Navbar, Loader, ProgressBar, Toast
        ├── pages/                 # Home, Editor, Export
        ├── context/               # Global state
        └── services/api.js        # Backend API calls
```

---

## ✅ Features Implemented

- Drag & drop video upload with progress bar
- Automatic audio extraction (FFmpeg)
- AI speech-to-text with word-level timestamps (Whisper)
- Auto punctuation + auto line-breaking
- Multiple language support (auto-detect)
- Time-synced caption preview on video
- Manual caption editing (text + timing)
- Interactive timeline with seek
- Full customization: font size/color, background, position, outline, shadow
- Subtitle animations: Fade, Pop, Slide
- Word-by-word highlight (karaoke-style)
- SRT & VTT export
- Permanent caption burn-in via FFmpeg + libass
- Dark mode (default) — Black + White + Purple premium theme
- Mobile responsive UI
- Error handling + toast notifications
- Attractive processing/loading screens

---

## 🐛 Troubleshooting

| Issue | Fix |
|---|---|
| `Uploaded file is not a valid video` | FFmpeg install karo, PATH set karo, ya `.env` me `FFMPEG_PATH`/`FFPROBE_PATH` set karo |
| `av` build error (pip install) | `faster-whisper>=1.1.0` use karo (already set in requirements.txt) |
| Mongoose ObjectId cast error | Video model me `_id: String` already fixed hai |
| CORS error | Backend `.env` me `CLIENT_URL=http://localhost:5173` check karo |
