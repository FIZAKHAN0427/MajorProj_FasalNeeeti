@echo off
echo Starting FasalNeeti Application (Fixed Version)...
echo.

echo [1/2] Starting backend server on port 5001...
cd backend
start "Backend Server" cmd /k "npm start"
cd ..
echo.

echo [2/2] Starting frontend development server...
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "npm start"
echo.

echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5001
echo.
pause