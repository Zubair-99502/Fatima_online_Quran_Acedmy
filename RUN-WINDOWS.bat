@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Install Node.js 22 from https://nodejs.org/
  pause
  exit /b 1
)
if not exist ".env.local" (
  copy ".env.example" ".env.local" >nul
  echo IMPORTANT: Open .env.local and set MONGODB_URI, AUTH_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD.
  notepad ".env.local"
)
if not exist "node_modules" (
  echo Installing dependencies. Internet is required for the first run.
  call npm install
  if errorlevel 1 (echo Installation failed. Check your connection.& pause & exit /b 1)
)
echo Starting Fatima Online Quran Academy at http://localhost:3000
call npm run dev
pause
