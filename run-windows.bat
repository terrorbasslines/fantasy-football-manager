@echo off
setlocal
cd /d "%~dp0"

if not exist node_modules (
  echo Dependencies are not installed yet.
  echo Running install-windows.bat first...
  call "%~dp0install-windows.bat"
)

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js / npm was not found.
  echo Install the current LTS version from https://nodejs.org, then run this file again.
  echo.
  pause
  exit /b 1
)

echo Starting Fantasy Football Text Manager...
echo When Vite prints a local URL, open it in your browser.
npm run dev
