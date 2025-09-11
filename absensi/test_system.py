import cv2
import os

def test_camera():
    """Test camera functionality"""
    print("Testing camera...")
    
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Cannot access camera")
        return False
        
    print("Camera accessible. Press 'q' to quit, 's' to save test image")
    
    while True:
        ret, frame = cap.read()
        
        if not ret:
            print("Error: Cannot read frame")
            break
            
        cv2.imshow('Camera Test', frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('s'):
            cv2.imwrite('test_camera.jpg', frame)
            print("Test image saved as test_camera.jpg")
            
    cap.release()
    cv2.destroyAllWindows()
    return True

def test_database():
    """Test database connection"""
    print("Testing database connection...")
    
    try:
        from database import db
        
        if db.connect():
            print("✓ Database connection successful")
            
            # Test query
            result = db.execute_query("SELECT COUNT(*) as count FROM users")
            if result:
                print(f"✓ Found {result[0]['count']} users in database")
            
            # Test table creation
            db.create_face_training_table()
            db.create_face_attendance_log_table()
            print("✓ Face recognition tables created/verified")
            
            return True
        else:
            print("✗ Database connection failed")
            return False
            
    except Exception as e:
        print(f"✗ Database test failed: {e}")
        return False

def test_directories():
    """Test directory creation"""
    print("Testing directory structure...")
    
    directories = ["datasets", "models", "temp"]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✓ Created directory: {directory}")
        else:
            print(f"✓ Directory exists: {directory}")
            
    return True

def test_face_recognition():
    """Test face recognition imports"""
    print("Testing face recognition modules...")
    
    try:
        import face_recognition
        import numpy as np
        from PIL import Image
        import pickle
        
        print("✓ Face recognition modules imported successfully")
        return True
        
    except ImportError as e:
        print(f"✗ Face recognition import failed: {e}")
        print("Please install face_recognition: pip install face_recognition")
        return False

def main():
    """Run all tests"""
    print("=== Face Recognition Attendance System Test ===\n")
    
    tests = [
        ("Directory Structure", test_directories),
        ("Database Connection", test_database),
        ("Face Recognition Modules", test_face_recognition),
        ("Camera Access", test_camera)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"✗ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n=== Test Summary ===")
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{test_name}: {status}")
    
    all_passed = all(result for _, result in results)
    
    if all_passed:
        print("\n🎉 All tests passed! System ready to use.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        
    return all_passed

if __name__ == "__main__":
    main()
