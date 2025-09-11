@echo off
title System Test - Face Recognition Attendance
echo ==========================================
echo   System Test - Face Recognition
echo ==========================================
echo.

cd /d "%~dp0"
python test_simple.py

echo.
pause
