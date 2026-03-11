@echo off
REM ─────────────────────────────────────────────────────────
REM  Yasar Portfolio — Backend Start Script (Windows)
REM  Uses Waitress (production WSGI — Windows compatible)
REM  Usage: .\start.bat [port]
REM ─────────────────────────────────────────────────────────
setlocal enabledelayedexpansion

SET PORT=%1
IF "%PORT%"=="" SET PORT=5000

SET SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo.
echo   Yasar Portfolio API  (Windows / Waitress)
echo ----------------------------------------

REM ── 1. Check Python ──────────────────────────────────────
where python >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] python not found.
    echo         Install from: https://www.python.org/downloads/
    echo         Check "Add Python to PATH" during install.
    pause
    exit /b 1
)
FOR /F "tokens=*" %%v IN ('python --version 2^>^&1') DO echo [OK] %%v

REM ── 2. Virtual environment ───────────────────────────────
IF NOT EXIST ".venv\" (
    echo [..] Creating virtual environment...
    python -m venv .venv
    IF ERRORLEVEL 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
)
echo [OK] Virtual environment ready

REM ── 3. Activate venv ─────────────────────────────────────
call .venv\Scripts\activate.bat
IF ERRORLEVEL 1 (
    echo [ERROR] Could not activate virtual environment.
    pause
    exit /b 1
)

REM ── 4. Install dependencies ──────────────────────────────
echo [..] Installing dependencies...
python -m pip install -q -r requirements.txt
IF ERRORLEVEL 1 (
    echo [ERROR] pip install failed.
    pause
    exit /b 1
)
echo [OK] Dependencies installed

REM ── 5. Launch via Waitress ───────────────────────────────
echo.
echo [>>] Starting Waitress (production WSGI for Windows)
echo      http://localhost:%PORT%
echo      Press Ctrl+C to stop
echo ----------------------------------------
echo.

python app.py %PORT%
pause
