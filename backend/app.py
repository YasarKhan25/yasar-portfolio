"""
Yasar Portfolio – Flask REST API
=================================
Windows : .\\start.bat          (uses Waitress)
Mac/Linux: ./start.sh          (uses Gunicorn)
"""
import os, sys, platform
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:4173",
    "https://yasarkhan25.netlify.app",
    "https://*.netlify.app",
])

# ─── PORTFOLIO DATA ───────────────────────────────────
PORTFOLIO = {
    "name": "Mohammed Shaheer Yasar Khan",
    "alias": "Yasar Khan",
    "title": "Unity Game Developer & Gameplay Systems Builder",
    "location": "Chennai, Tamil Nadu, India",
    "email": "msym5556@gmail.com",
    "github": "https://github.com/YasarKhan25",
    "linkedin": "https://www.linkedin.com/in/yasarkhan42/",
    "available": True,
    "summary": "Unity Game Developer with hands-on experience building gameplay systems, enemy AI, and QA pipelines.",
    "stats": [
        {"value": "6+",  "label": "Games Built"},
        {"value": "30%", "label": "Performance Boost"},
        {"value": "50+", "label": "Bugs Resolved"},
        {"value": "2+",  "label": "Years Experience"},
    ],
    "skills": [
        {"name": "Unity Engine",         "level": 95, "category": "Game Dev"},
        {"name": "C#",                   "level": 90, "category": "Language"},
        {"name": "Gameplay Programming", "level": 88, "category": "Game Dev"},
        {"name": "Enemy AI Systems",     "level": 88, "category": "Game Dev"},
        {"name": "QA / Bug Tracking",    "level": 92, "category": "QA"},
        {"name": "Git & GitHub",         "level": 87, "category": "Tools"},
        {"name": "C++",                  "level": 72, "category": "Language"},
        {"name": "Python",               "level": 68, "category": "Language"},
        {"name": "Blender",              "level": 55, "category": "Tools"},
    ],
    "projects": [
        {"id": "tank",   "title": "Pixel Blasters",  "genre": "Action · Tank Battle",   "engine": "Unity 2022.3"},
        {"id": "fps",    "title": "NightFire Arena", "genre": "Action · Arena Shooter", "engine": "Unity 2022.3"},
        {"id": "ski",    "title": "Downhill Rush",   "genre": "Arcade · Sports",         "engine": "Unity 2022.3"},
        {"id": "runner", "title": "NeonDash 3D",     "genre": "Endless Runner",          "engine": "Unity 2022.3"},
        {"id": "puzzle", "title": "Cube Shift",      "genre": "Puzzle · Sokoban",        "engine": "Unity 2022.3"},
        {"id": "racing", "title": "Neon Velocity",   "genre": "Racing · Arcade",         "engine": "Unity 2022.3"},
    ],
    "experience": [
        {"role": "Game Developer",      "company": "Huntdown Gaming Solutions", "period": "June 2024 – Dec 2024", "type": "work"},
        {"role": "Freelance Developer", "company": "Self-Employed",             "period": "2022 – Present",       "type": "work"},
        {"role": "BE Computer Science", "company": "SA Engineering College",    "period": "2021 – 2024",          "type": "edu"},
        {"role": "Diploma CS",          "company": "Panimalar Polytechnic",     "period": "2018 – 2021",          "type": "edu"},
    ],
}

# ─── ROUTES ──────────────────────────────────────────
@app.route('/api/health')
def health():
    return jsonify({"status": "online", "version": "1.0.0",
                    "server": "waitress" if platform.system() == "Windows" else "gunicorn"})

@app.route('/api/portfolio')
def portfolio():
    return jsonify(PORTFOLIO)

@app.route('/api/stats')
def stats():
    return jsonify(PORTFOLIO["stats"])

@app.route('/api/projects')
def projects():
    return jsonify(PORTFOLIO["projects"])

@app.route('/api/skills')
def skills():
    return jsonify(PORTFOLIO["skills"])

@app.route('/api/experience')
def experience():
    return jsonify(PORTFOLIO["experience"])

@app.route('/api/contact', methods=['POST'])
def contact():
    data    = request.get_json(silent=True) or {}
    name    = data.get('name', 'Unknown')
    email   = data.get('email', '')
    company = data.get('company', '')
    opp     = data.get('type', '')
    message = data.get('message', '')
    print(f"\n📨 New Contact\n  From: {name} <{email}>\n  Company: {company}\n  Opportunity: {opp}\n  Message: {message}\n")
    return jsonify({"success": True, "message": "Message received!"})

@app.route('/api/resume')
def resume():
    path = os.path.join(os.path.dirname(__file__), 'GD_RESUME.pdf')
    if os.path.exists(path):
        return send_file(path, as_attachment=True,
                         download_name='Yasar_Khan_GameDev_Resume.pdf',
                         mimetype='application/pdf')
    return jsonify({"error": "Resume not found"}), 404

# ─── ENTRY POINT ─────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    threads = int(os.environ.get('THREADS', 4))

    if platform.system() == 'Windows':
        # Waitress — production WSGI server for Windows
        from waitress import serve
        print(f"\n🎮  Yasar Portfolio API  →  http://localhost:{port}")
        print(f"    server=waitress  threads={threads}  |  Ctrl+C to stop\n")
        serve(app, host='0.0.0.0', port=port, threads=threads)
    else:
        # Gunicorn — production WSGI server for Mac/Linux
        import subprocess
        workers = int(os.environ.get('WEB_CONCURRENCY', 2))
        print(f"\n🎮  Yasar Portfolio API  →  http://localhost:{port}")
        print(f"    server=gunicorn  workers={workers}  |  Ctrl+C to stop\n")
        subprocess.run([
            sys.executable, '-m', 'gunicorn', 'app:app',
            '--bind',    f'0.0.0.0:{port}',
            '--workers', str(workers),
            '--threads', '2',
            '--timeout', '60',
            '--access-logfile', '-',
        ])
