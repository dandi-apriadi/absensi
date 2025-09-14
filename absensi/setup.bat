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
    echo 📝 Creating .env file from template...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ✅ .env file created
        echo ⚠️  Please edit .env file with your database configuration
    ) else (
        echo ⚠️  .env.example not found, creating basic .env file...
        echo # Database Configuration > .env
        echo DB_HOST=localhost >> .env
        echo DB_USER=root >> .env
        echo DB_PASSWORD= >> .env
        echo DB_NAME=elearning >> .env
        echo. >> .env
        echo # Backend API Configuration >> .env
        echo BACKEND_API_URL=http://localhost:5000 >> .env
        echo ✅ Basic .env file created
    )
) else (
    echo ✅ .env file already exists
)

REM Ask if user wants to setup database
echo.
echo 🗄️  Do you want to setup the database now? (y/n)
set /p setup_db=
if /i "%setup_db%"=="y" (
    echo.
    echo 🔧 Setting up database...
    python setup_database.py
    if errorlevel 1 (
        echo ❌ Database setup failed
        echo Please check your database configuration in .env file
    ) else (
        echo ✅ Database setup completed
    )
) else (
    echo ⚠️  Database setup skipped
    echo You can run it later with: python setup_database.py
)

echo.
echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your database configuration
echo 2. Run database setup: python setup_database.py
echo 3. Start the application: python main.py
echo.
echo Default admin credentials:
echo Email: admin@system.local
echo Password: admin123
echo.
echo ⚠️  Remember to change admin password after first login!
echo.
pause