@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js / npm was not found.
  echo Install the current LTS version from https://nodejs.org, then run this file again.
  echo.
  pause
  exit /b 1
)

echo Installing Fantasy Football Text Manager dependencies...
npm install
if errorlevel 1 (
  echo.
  echo Install failed. Check the message above and try again.
  pause
  exit /b 1
)

echo.
echo Install complete.
echo Run run-windows.bat to start the review app.
pause
