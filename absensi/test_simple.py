"""
Test script untuk aplikasi absensi face recognition
Menguji semua komponen tanpa memerlukan face_recognition library
"""

import cv2
import os
import sys

def test_camera():
    """Test camera functionality"""
    print("=== Testing Camera ===")
    try:
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("❌ Camera tidak dapat diakses")
            return False
            
        ret, frame = cap.read()
        if not ret:
            print("❌ Tidak dapat membaca frame dari camera")
            cap.release()
            return False
            
        print("✅ Camera berhasil diakses")
        print(f"✅ Frame size: {frame.shape}")
        cap.release()
        return True
        
    except Exception as e:
        print(f"❌ Error testing camera: {e}")
        return False

def test_face_detection():
    """Test OpenCV face detection"""
    print("\n=== Testing Face Detection ===")
    try:
        # Load cascade classifier
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        if face_cascade.empty():
            print("❌ Tidak dapat load face cascade classifier")
            return False
            
        print("✅ Face cascade classifier berhasil di-load")
        
        # Test LBPH Face Recognizer
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        print("✅ LBPH Face Recognizer berhasil dibuat")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing face detection: {e}")
        return False

def test_database():
    """Test database connection"""
    print("\n=== Testing Database ===")
    try:
        from database import db
        
        if not db.connect():
            print("❌ Tidak dapat terhubung ke database")
            return False
            
        print("✅ Database connection berhasil")
        
        # Test create tables
        result1 = db.create_face_training_table()
        result2 = db.create_face_attendance_log_table()
        
        if result1 and result2:
            print("✅ Face recognition tables berhasil dibuat/verified")
        else:
            print("⚠️  Warning: Ada masalah dengan table creation")
            
        # Test basic query
        result = db.execute_query("SELECT COUNT(*) as count FROM users")
        if result:
            print(f"✅ Database query berhasil - Found {result[0]['count']} users")
        else:
            print("❌ Database query gagal")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Error testing database: {e}")
        return False

def test_gui_imports():
    """Test GUI library imports"""
    print("\n=== Testing GUI Libraries ===")
    try:
        import tkinter as tk
        print("✅ tkinter imported successfully")
        
        import customtkinter as ctk
        print("✅ customtkinter imported successfully")
        
        from PIL import Image, ImageTk
        print("✅ PIL/Pillow imported successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Error importing GUI libraries: {e}")
        return False

def test_directories():
    """Test required directories"""
    print("\n=== Testing Directories ===")
    
    directories = ["datasets", "models", "temp"]
    all_good = True
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✅ Created directory: {directory}")
        else:
            print(f"✅ Directory exists: {directory}")
            
    return all_good

def test_simple_face_recognition():
    """Test our simple face recognition system"""
    print("\n=== Testing Simple Face Recognition System ===")
    try:
        from simple_face_recognition import SimpleFaceRecognition
        
        face_system = SimpleFaceRecognition()
        print("✅ SimpleFaceRecognition system initialized")
        
        # Test initialization
        face_system.init_database()
        print("✅ Database initialization successful")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing SimpleFaceRecognition: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Face Recognition Attendance System Tests...\n")
    
    tests = [
        ("Directories", test_directories),
        ("GUI Libraries", test_gui_imports),
        ("Database", test_database),
        ("Face Detection", test_face_detection),
        ("Simple Face Recognition", test_simple_face_recognition),
        ("Camera", test_camera)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "="*50)
    print("📊 TEST SUMMARY")
    print("="*50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<25}: {status}")
        if result:
            passed += 1
    
    print("="*50)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! System is ready to use.")
        print("\nTo run the application:")
        print("  python main.py")
    else:
        print(f"\n⚠️  {total-passed} test(s) failed. Please check the errors above.")
        
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
