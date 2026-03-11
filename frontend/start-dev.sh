#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  Yasar Portfolio — Frontend Start Script (Mac / Linux)
#  Usage:
#    ./start-dev.sh      → dev server with hot reload
#    ./start-dev.sh prod → production preview
# ─────────────────────────────────────────────────────────
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "🎮  Yasar Portfolio Frontend"
echo "────────────────────────────────────"

# ── Check Node ───────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌  Node.js not found."
  echo "    Install from: https://nodejs.org (v18+ required)"
  exit 1
fi
echo "✅  Node $(node --version)"

# ── Install if needed ────────────────────────────────────
if [ ! -d "node_modules" ]; then
  echo "📦  Installing npm packages..."
  npm install
fi

# ── Start ────────────────────────────────────────────────
if [ "$1" = "prod" ]; then
  echo "🚀  Building production bundle..."
  npm run build
  echo ""
  echo "🌐  Serving production build → http://localhost:4173"
  echo "────────────────────────────────────"
  npm run preview
else
  echo "🔥  Dev server with hot reload → http://localhost:5173"
  echo "────────────────────────────────────"
  npm run dev
fi
