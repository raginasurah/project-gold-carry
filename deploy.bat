@echo off
REM AI Finance Manager - Windows Deployment Script

echo 🚀 AI Finance Manager - Deployment Script
echo ==========================================

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    echo [INFO] Please copy env.example to .env and configure your environment variables
    pause
    exit /b 1
)

echo [INFO] Environment variables loaded

REM Check prerequisites
echo [INFO] Checking prerequisites...

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites are installed

REM Backend deployment
echo [INFO] Deploying backend...

cd backend

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt

REM Start backend server
echo [INFO] Starting backend server...
start "Backend Server" python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Check if backend is running
curl -f http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Backend failed to start
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend is running on http://localhost:8000
)

cd ..

REM Frontend deployment
echo [INFO] Deploying frontend...

cd frontend

REM Install Node.js dependencies
echo [INFO] Installing Node.js dependencies...
npm install

REM Build frontend
echo [INFO] Building frontend...
npm run build

REM Start frontend server
echo [INFO] Starting frontend server...
start "Frontend Server" npm start

REM Wait for frontend to start
timeout /t 10 /nobreak >nul

REM Check if frontend is running
curl -f http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Frontend failed to start
    pause
    exit /b 1
) else (
    echo [SUCCESS] Frontend is running on http://localhost:3000
)

cd ..

REM Final status
echo.
echo 🎉 Deployment completed successfully!
echo =====================================
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:3000
echo API Documentation: http://localhost:8000/docs
echo Health Check: http://localhost:8000/health
echo.
echo Press any key to exit...
pause >nul 