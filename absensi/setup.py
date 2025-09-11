"""
Setup script untuk instalasi dependencies
Jalankan script ini untuk menginstall semua package yang diperlukan
"""

import subprocess
import sys
import os

def install_packages():
    """Install required packages"""
    packages = [
        "opencv-python==4.8.1.78",
        "face-recognition==1.3.0", 
        "numpy==1.24.3",
        "Pillow==10.0.0",
        "mysql-connector-python==8.1.0",
        "customtkinter==5.2.0",
        "python-dotenv==1.0.0",
        "requests==2.31.0"
    ]
    
    print("Installing required packages...")
    
    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✓ {package} installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to install {package}: {e}")
            
    print("\nInstallation complete!")
    print("Note: Untuk face_recognition, Anda mungkin perlu menginstall Visual Studio Build Tools")
    print("atau menggunakan conda: conda install -c conda-forge dlib")

def create_directories():
    """Create required directories"""
    directories = [
        "datasets",
        "models", 
        "temp"
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")

if __name__ == "__main__":
    print("Setting up Face Recognition Attendance System...")
    
    create_directories()
    install_packages()
    
    print("\nSetup complete! You can now run: python main.py")
