#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  Yasar Portfolio — Backend Start Script (Mac / Linux)
#  Usage: ./start.sh [port]
# ─────────────────────────────────────────────────────────
set -e

PORT="${1:-5000}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "🎮  Yasar Portfolio API"
echo "────────────────────────────────────"

# ── 1. Check Python ──────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo "❌  python3 not found."
  echo "    Install from: https://www.python.org/downloads/"
  exit 1
fi
PYTHON=$(command -v python3)
echo "✅  Python: $($PYTHON --version)"

# ── 2. Virtual environment ───────────────────────────────
VENV="$SCRIPT_DIR/.venv"
if [ ! -d "$VENV" ]; then
  echo "🔧  Creating virtual environment..."
  $PYTHON -m venv "$VENV"
fi
source "$VENV/bin/activate"

# ── 3. Install / upgrade dependencies ───────────────────
echo "📦  Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# ── 4. Launch via Gunicorn ───────────────────────────────
WORKERS="${WEB_CONCURRENCY:-2}"
echo ""
echo "🚀  Starting Gunicorn (production WSGI)"
echo "    http://localhost:$PORT"
echo "    Workers: $WORKERS  |  Ctrl+C to stop"
echo "────────────────────────────────────"
echo ""

exec gunicorn app:app \
  --bind "0.0.0.0:$PORT" \
  --workers "$WORKERS" \
  --threads 2 \
  --timeout 60 \
  --access-logfile - \
  --error-logfile -
