#!/usr/bin/env python3
"""
Test script to verify duplicate entry fix in face recognition system
"""

from simple_face_recognition import SimpleFaceRecognition
import cv2
import os
import numpy as np

def test_duplicate_handling():
    """Test the duplicate entry handling fix"""
    
    print("="*50)
    print("Testing Duplicate Entry Fix")
    print("="*50)
    
    # Initialize face recognition system
    sfr = SimpleFaceRecognition()
    
    # Test with existing employee student001
    employee_id = 'student001'
    
    print(f"Testing duplicate entry handling for employee: {employee_id}")
    
    # Check if model already exists
    existing_model = sfr.check_existing_model(employee_id)
    if existing_model:
        print(f"Found existing model: {existing_model}")
    else:
        print("No existing model found")
    
    # Create some dummy test images (normally this would come from camera capture)
    print("Creating test face images...")
    test_images = []
    
    import tempfile
    import os
    
    # Create temporary image files for testing
    temp_dir = tempfile.mkdtemp()
    
    for i in range(5):  # Just 5 samples for quick test
        # Create a random 50x50 grayscale image
        dummy_face = np.random.randint(0, 255, (50, 50), dtype=np.uint8)
        
        # Save as temporary image file
        temp_image_path = os.path.join(temp_dir, f"test_face_{i}.jpg")
        cv2.imwrite(temp_image_path, dummy_face)
        test_images.append(temp_image_path)
    
    print(f"Created {len(test_images)} test face image files")
    
    # Try to train the model (this should handle duplicates gracefully)
    print(f"Training model for {employee_id}...")
    
    try:
        result = sfr.train_face_model(employee_id, test_images)
        
        if result:
            print("✅ SUCCESS: Model training completed without duplicate entry error!")
            print("The duplicate handling fix is working correctly.")
        else:
            print("❌ FAILED: Model training failed for unknown reason")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        if "Duplicate entry" in str(e):
            print("The duplicate entry error still exists - fix needs more work")
        else:
            print("Different error occurred")
    
    # Clean up temporary files
    try:
        import shutil
        shutil.rmtree(temp_dir)
        print("Cleaned up temporary test files")
    except:
        pass
    
    print("="*50)
    print("Test completed")
    print("="*50)

if __name__ == "__main__":
    test_duplicate_handling()