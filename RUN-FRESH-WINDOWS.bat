@echo off
setlocal
cd /d "%~dp0"
if not exist package.json (
  echo [ERROR] package.json was not found in this folder.
  echo Extract the complete ZIP and run this file inside the extracted project.
  pause
  exit /b 1
)
echo Cleaning old Next.js build cache...
if exist .next rmdir /s /q .next
if not exist node_modules (
  echo Installing packages for first run...
  call npm install || (pause & exit /b 1)
)
echo Starting Fatima Online Quran Academy...
call npm run dev
pause
