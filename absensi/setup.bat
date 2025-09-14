@echo off
echo ========================================
echo   Face Recognition System - Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.8+ first.
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python found
python --version

REM Check if pip is available
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip not found! Please reinstall Python with pip.
    pause
    exit /b 1
)

echo ✅ pip found

REM Create virtual environment (optional)
echo.
echo 📦 Setting up virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ⚠️  Failed to create virtual environment, continuing without it...
) else (
    echo ✅ Virtual environment created
    echo 🔄 Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Install requirements
echo.
echo 📥 Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install some dependencies
    echo Please check the error messages above
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Check if .env exists
if not exist ".env" (
    echo.
    echo 📝 Creating .env file...
    echo ⚠️  Creating basic .env file...
    echo # Database Configuration > .env
    echo DB_HOST=localhost >> .env
    echo DB_USER=root >> .env
    echo DB_PASSWORD= >> .env
    echo DB_NAME=elearning >> .env
    echo. >> .env
    echo # Backend API Configuration >> .env
    echo BACKEND_API_URL=http://localhost:5000 >> .env
    echo. >> .env
    echo # App Configuration >> .env
    echo DATASET_PATH=./datasets >> .env
    echo TEMP_PATH=./temp >> .env
    echo CAMERA_INDEX=0 >> .env
    echo RECOGNITION_THRESHOLD=0.6 >> .env
    echo ✅ Basic .env file created
) else (
    echo ✅ .env file already exists
)

echo.
echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your database configuration
echo 2. Start the application: python main.py
echo.
echo Default admin credentials:
echo Email: admin@system.local
echo Password: admin123
echo.
echo ⚠️  Remember to change admin password after first login!
echo.
pause