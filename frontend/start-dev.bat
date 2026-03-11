@echo off
REM ─────────────────────────────────────────────────────────
REM  Yasar Portfolio — Frontend Start Script (Windows)
REM  Usage:
REM    start-dev.bat      → dev server with hot reload
REM    start-dev.bat prod → production preview
REM ─────────────────────────────────────────────────────────
setlocal

SET SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo.
echo 🎮  Yasar Portfolio Frontend
echo ────────────────────────────────────

REM ── Check Node ───────────────────────────────────────────
where node >nul 2>&1
IF ERRORLEVEL 1 (
    echo ❌  Node.js not found.
    echo     Install from: https://nodejs.org  (v18+ required)
    pause
    exit /b 1
)
FOR /F "tokens=*" %%v IN ('node --version') DO echo ✅  Node %%v

REM ── Install if needed ────────────────────────────────────
IF NOT EXIST "node_modules\" (
    echo 📦  Installing npm packages...
    npm install
)

REM ── Start ────────────────────────────────────────────────
IF "%1"=="prod" (
    echo 🚀  Building production bundle...
    npm run build
    echo.
    echo 🌐  Serving production build → http://localhost:4173
    echo ────────────────────────────────────
    npm run preview
) ELSE (
    echo 🔥  Dev server with hot reload → http://localhost:5173
    echo ────────────────────────────────────
    npm run dev
)

pause
