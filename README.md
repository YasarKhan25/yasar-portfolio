# Yasar Khan — Unity Game Developer Portfolio

**React 18 + Vite + Python Flask** · **CodeCraft AI coding agent** (Claude claude-sonnet-4-5)
Mac · Windows · Linux · iOS · Android

---

## 📋 Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or newer | https://nodejs.org |
| **Python** | 3.10 or newer | https://www.python.org/downloads/ |
| **Git** | any | https://git-scm.com |

> **Windows users:** when installing Python, tick **"Add Python to PATH"**.

---

## 📁 Project Structure

```
yasar-portfolio/
├── frontend/                  ← React 18 + Vite
│   ├── src/
│   │   ├── components/        ← All UI components (Navbar, Hero, AICodingAgent …)
│   │   ├── games/             ← 6 playable Canvas game engines
│   │   └── data/              ← Portfolio content
│   ├── .env.example           ← Frontend env vars template
│   ├── start-dev.sh           ← Mac/Linux dev start  (auto-installs npm deps)
│   └── start-dev.bat          ← Windows dev start    (auto-installs npm deps)
└── backend/                   ← Python Flask REST API
    ├── app.py                 ← All API routes + AI agent
    ├── requirements.txt
    ├── .env.example           ← Backend env vars template  ← copy to .env
    ├── GD_RESUME.pdf          ← Resume served via /api/resume
    ├── start.sh               ← Mac/Linux start (Gunicorn, auto-creates venv)
    └── start.bat              ← Windows start   (Waitress, auto-creates venv)
```

---

## ⚡ Quick Start — run the whole project locally

Open **two terminal windows** (or tabs):

### Terminal 1 — Backend API

**Mac / Linux**
```bash
cd backend
chmod +x start.sh
./start.sh
# ✅  API running at http://localhost:5000
```

**Windows**
```bat
cd backend
start.bat
REM ✅  API running at http://localhost:5000
```

The script automatically:
- Checks for Python 3
- Creates a virtual environment (`.venv/`) on first run
- Installs all `requirements.txt` dependencies
- Starts the production WSGI server (Gunicorn on Mac/Linux, Waitress on Windows)

---

### Terminal 2 — Frontend

**Mac / Linux**
```bash
cd frontend
chmod +x start-dev.sh
./start-dev.sh
# ✅  App running at http://localhost:5173  (hot reload)
```

**Windows**
```bat
cd frontend
start-dev.bat
REM ✅  App running at http://localhost:5173  (hot reload)
```

The script automatically:
- Checks for Node.js 18+
- Runs `npm install` on first run
- Starts the Vite dev server with hot reload

**Open http://localhost:5173 in your browser.** 🎮

---

## 🤖 Enable the AI Coding Agent (CodeCraft AI)

The AI agent uses **Claude claude-sonnet-4-5** and requires an Anthropic API key.

1. Get a free key at **https://console.anthropic.com/**
2. Create `backend/.env` (copy from the example):
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Edit `backend/.env` and paste your key:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
4. Restart the backend — the AI chat in the **Agent** section will now work live.

> Without a key the Agent section still works in **demo mode** (shows a sample
> Unity C# code response) so the UI is never broken.

---

## 🌐 API Endpoints

```
GET  /api/health       → Server status
GET  /api/portfolio    → Full portfolio data (JSON)
GET  /api/stats        → Stats array
GET  /api/projects     → Projects list
GET  /api/skills       → Skills with proficiency levels
GET  /api/experience   → Work history + education
GET  /api/resume       → Download PDF resume
POST /api/contact      → Submit contact form
POST /api/agent/chat   → AI coding agent (requires ANTHROPIC_API_KEY)
```

#### `/api/agent/chat` request body
```json
{
  "messages": [
    { "role": "user", "content": "Write a Unity C# player controller" }
  ],
  "stream": false
}
```

---

## 🔧 Environment Variables

### Backend — `backend/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | For AI agent | — | Anthropic key for Claude claude-sonnet-4-5 |
| `PORT` | No | `5000` | Port the API listens on |
| `WEB_CONCURRENCY` | No | `2` | Gunicorn worker count (Mac/Linux) |
| `THREADS` | No | `4` | Waitress thread count (Windows) |

Copy `backend/.env.example` → `backend/.env` and fill in your values.

### Frontend — `frontend/.env` (only needed for production)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:5000` | Backend URL (change for deployment) |

Copy `frontend/.env.example` → `frontend/.env` for production builds.

---

## 🚀 Deploy to the Web (Free)

### Frontend-only (simplest — no backend needed)
> Resume download, games, and the contact form all work without a backend.

1. Build: `cd frontend && npm install && npm run build`
2. Go to **https://netlify.com/drop**
3. Drag the `frontend/dist/` folder onto the page
4. ✅ Live instantly

### Full-stack (AI agent + contact API)

**Frontend → Netlify**
1. Push repo to GitHub
2. Netlify → *New Site → Import from GitHub*
3. Base dir: `frontend` · Build command: `npm run build` · Publish dir: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend.railway.app`

**Backend → Railway** (free tier)
1. [railway.app](https://railway.app) → *New Project → Deploy from GitHub*
2. Set root directory: `backend`
3. Add environment variable: `ANTHROPIC_API_KEY=sk-ant-...`
4. Railway auto-detects `requirements.txt` and starts with `gunicorn app:app`

---

## 🎮 Features

- **CodeCraft AI** — specialized coding agent (Claude claude-sonnet-4-5) with pricing tiers
- 6 Fully Playable Canvas Games (Tank, FPS, Skiing, Runner, Puzzle, Racing)
- Particle network hero with mouse-reactive physics
- Typewriter role cycling
- Animated skill bars (scroll-triggered)
- Devlog engineering breakdowns
- Resume embedded in JS bundle (works offline)
- 100% Mobile Responsive (iOS, Android, all screen sizes)

---

## 🛠 Manual commands (without the start scripts)

<details>
<summary>Click to expand</summary>

**Frontend dev server**
```bash
cd frontend
npm install
npm run dev          # dev  → http://localhost:5173
npm run build        # production build → dist/
npm run preview      # preview build    → http://localhost:4173
```

**Backend (manual venv)**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
gunicorn app:app --bind 0.0.0.0:5000   # Mac/Linux
# or on Windows:
python app.py                          # uses Waitress
```
</details>

---

## 📧 Contact

- Email: msym5556@gmail.com
- LinkedIn: https://linkedin.com/in/yasarkhan42
- GitHub: https://github.com/YasarKhan25
