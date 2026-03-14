"""
Yasar Portfolio – Flask REST API
=================================
Windows : .\\start.bat          (uses Waitress)
Mac/Linux: ./start.sh          (uses Gunicorn)
"""
import os, sys, platform
from flask import Flask, jsonify, request, send_file, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env from the same directory as this file (if it exists)
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

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

# ─── AI CODING AGENT ─────────────────────────────
AGENT_SYSTEM_PROMPT = """You are CodeCraft AI — a world-class coding assistant specialized in:
• Unity Engine & C# game development (gameplay systems, AI, physics, shaders, optimization)
• Python scripting, Flask APIs, and automation
• JavaScript / React frontend development
• Software architecture, design patterns, and code reviews
• Debugging, profiling, and performance optimization
• Git workflows and collaborative development best practices

You give precise, working code examples with clear explanations. You think step-by-step.
When asked about Unity/C#, provide concrete, copy-paste-ready code snippets.
Keep answers focused and actionable. Format code with proper markdown code fences.
Always suggest best practices and flag potential pitfalls."""

# Maximum number of conversation turns kept per request (prevents oversized payloads)
AGENT_MAX_HISTORY = 20
# Maximum characters allowed per individual message content
AGENT_MAX_CONTENT_CHARS = 8000

@app.route('/api/agent/chat', methods=['POST'])
def agent_chat():
    """AI coding agent powered by Claude claude-sonnet-4-5."""
    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    if not api_key:
        return jsonify({"error": "AI agent not configured. Set ANTHROPIC_API_KEY environment variable."}), 503

    try:
        import anthropic as _anthropic
    except ImportError:
        return jsonify({"error": "anthropic package not installed. Run: pip install anthropic"}), 503

    data     = request.get_json(silent=True) or {}
    messages = data.get('messages', [])
    stream   = data.get('stream', False)

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    # Sanitise: keep only role/content fields, limit history and per-message length
    safe_messages = [
        {"role": m["role"], "content": str(m["content"])[:AGENT_MAX_CONTENT_CHARS]}
        for m in messages[-AGENT_MAX_HISTORY:]
        if m.get("role") in ("user", "assistant") and m.get("content")
    ]
    if not safe_messages:
        return jsonify({"error": "No valid messages"}), 400

    client = _anthropic.Anthropic(api_key=api_key)

    if stream:
        def generate():
            with client.messages.stream(
                model="claude-sonnet-4-5",
                max_tokens=2048,
                system=AGENT_SYSTEM_PROMPT,
                messages=safe_messages,
            ) as s:
                for text in s.text_stream:
                    yield text

        return Response(
            stream_with_context(generate()),
            content_type='text/plain; charset=utf-8',
        )

    # Non-streaming (default)
    resp = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        system=AGENT_SYSTEM_PROMPT,
        messages=safe_messages,
    )
    return jsonify({"reply": resp.content[0].text})

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
