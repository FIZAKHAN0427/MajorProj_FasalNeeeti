@echo off
echo Starting FasalNeeti Full Application...
echo.

echo [1/3] Installing backend dependencies...
cd backend
call npm install
echo.

echo [2/3] Starting backend server...
start "Backend Server" cmd /k "npm start"
cd ..
echo.

echo [3/3] Starting frontend development server...
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "npm start"
echo.

echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
pause