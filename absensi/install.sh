#!/bin/bash

echo "================================================"
echo "Face Recognition Attendance System Installer"
echo "================================================"
echo

echo "Installing Python packages..."
pip install opencv-python==4.8.1.78
pip install numpy==1.24.3
pip install Pillow==10.0.0
pip install mysql-connector-python==8.1.0
pip install customtkinter==5.2.0
pip install python-dotenv==1.0.0
pip install requests==2.31.0

echo
echo "Installing face_recognition (this may take a while)..."
pip install cmake
pip install dlib
pip install face_recognition==1.3.0

echo
echo "Creating directories..."
mkdir -p datasets
mkdir -p models
mkdir -p temp

echo
echo "================================================"
echo "Installation complete!"
echo "================================================"
echo
echo "Next steps:"
echo "1. Configure your database settings in .env file"
echo "2. Import insightflow.sql to your MySQL database"
echo "3. Run: python main.py"
echo
