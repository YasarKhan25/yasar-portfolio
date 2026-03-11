# Yasar Khan — Unity Game Developer Portfolio
**React 18 + Vite + Python Flask + Gunicorn** — Mac · Windows · Linux · iOS · Android

---

## 📁 Project Structure
```
yasar-portfolio/
├── frontend/
│   ├── src/                ← React 18 source
│   │   ├── components/     ← All UI components
│   │   ├── games/          ← 6 playable Canvas game engines
│   │   └── data/           ← Portfolio content
│   ├── dist/               ← Production build (ready to deploy)
│   ├── start-dev.sh        ← Mac/Linux dev start
│   └── start-dev.bat       ← Windows dev start
└── backend/
    ├── app.py              ← Flask API
    ├── requirements.txt
    ├── GD_RESUME.pdf       ← Resume served via /api/resume
    ├── start.sh            ← Mac/Linux production start (Gunicorn)
    └── start.bat           ← Windows production start (Gunicorn)
```

---

## 🚀 DEPLOY IN 2 MINUTES (Free)

### Option A — Frontend Only (Simplest, Recommended)
1. Go to **https://netlify.com/drop**
2. Drag the `frontend/dist/` folder onto the page
3. ✅ Live instantly — resume, games, contact form all work

### Option B — Full Stack
**Frontend → Netlify**
1. Push repo to GitHub
2. Netlify → New Site → Import from GitHub
3. Build: `npm run build` | Publish: `dist`
4. Env var: `VITE_API_URL=https://your-backend.railway.app`

**Backend → Railway** (free tier)
1. railway.app → New Project → Deploy from GitHub
2. Root: `backend/` | Start: `gunicorn app:app`

---

## 💻 LOCAL DEVELOPMENT

### Frontend (Mac/Linux)
```bash
cd frontend
chmod +x start-dev.sh
./start-dev.sh
# → http://localhost:5173  (hot reload)
```

### Frontend (Windows)
```bat
cd frontend
start-dev.bat
:: → http://localhost:5173  (hot reload)
```

### Backend (Mac/Linux)
```bash
cd backend
chmod +x start.sh
./start.sh
# → http://localhost:5000  (Gunicorn, production-grade)
```

### Backend (Windows)
```bat
cd backend
start.bat
:: → http://localhost:5000  (Gunicorn, production-grade)
```

> **No `python app.py`** — the start scripts always use Gunicorn, the
> production WSGI server. No "development server" warnings.

---

## 🌐 API Endpoints
```
GET  /api/health     → Server status
GET  /api/portfolio  → Full portfolio data
GET  /api/stats      → Stats array
GET  /api/projects   → Projects list
GET  /api/skills     → Skills with levels
GET  /api/experience → Work + education
GET  /api/resume     → Download PDF
POST /api/contact    → Submit contact form
```

---

## 🎮 Features
- 6 Fully Playable Canvas Games (Tank, FPS, Skiing, Runner, Puzzle, Racing)
- Particle network hero with mouse-reactive physics
- Typewriter role cycling
- Animated skill bars (scroll-triggered)
- Devlog engineering breakdowns
- Resume embedded in JS bundle (works offline)
- 100% Mobile Responsive (iOS, Android, all screen sizes)

---

## 📧 Contact
- Email: msym5556@gmail.com  
- LinkedIn: linkedin.com/in/yasarkhan42  
- GitHub: github.com/YasarKhan25
