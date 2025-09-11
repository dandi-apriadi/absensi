import cv2
import face_recognition
import numpy as np
import os
import pickle
from PIL import Image, ImageTk
import json
from datetime import datetime
from database import db

class FaceRecognitionSystem:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        self.known_employee_ids = []
        self.dataset_path = "datasets"
        self.models_path = "models"
        self.temp_path = "temp"
        
        # Create directories if they don't exist
        os.makedirs(self.dataset_path, exist_ok=True)
        os.makedirs(self.models_path, exist_ok=True)
        os.makedirs(self.temp_path, exist_ok=True)
        
        # Initialize database tables
        self.init_database()
        
    def init_database(self):
        """Initialize required database tables"""
        db.connect()
        db.create_face_training_table()
        db.create_face_attendance_log_table()
        
    def capture_face_dataset(self, employee_id, employee_name, num_samples=30):
        """Capture multiple face images for training dataset"""
        cap = cv2.VideoCapture(0)
        count = 0
        captured_images = []
        
        # Create employee dataset directory
        employee_dir = os.path.join(self.dataset_path, f"employee_{employee_id}")
        os.makedirs(employee_dir, exist_ok=True)
        
        print(f"Capturing dataset for {employee_name} (ID: {employee_id})")
        print(f"Press SPACE to capture image ({num_samples} needed)")
        print("Press ESC to quit")
        
        while count < num_samples:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Display frame
            cv2.putText(frame, f"Captured: {count}/{num_samples}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, "Press SPACE to capture", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            cv2.putText(frame, "Press ESC to quit", (10, 80), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            # Draw rectangle for face area
            height, width = frame.shape[:2]
            cv2.rectangle(frame, (width//4, height//4), (3*width//4, 3*height//4), (255, 0, 0), 2)
            
            cv2.imshow('Face Dataset Capture', frame)
            
            key = cv2.waitKey(1) & 0xFF
            if key == ord(' '):  # Space bar to capture
                # Detect face in current frame
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                face_locations = face_recognition.face_locations(rgb_frame)
                
                if len(face_locations) == 1:  # Only capture if exactly one face detected
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                    filename = f"face_{count:03d}_{timestamp}.jpg"
                    filepath = os.path.join(employee_dir, filename)
                    
                    cv2.imwrite(filepath, frame)
                    captured_images.append(filepath)
                    count += 1
                    print(f"Captured image {count}/{num_samples}")
                else:
                    print("Please ensure exactly one face is visible in the frame")
                    
            elif key == 27:  # ESC to quit
                break
                
        cap.release()
        cv2.destroyAllWindows()
        
        return captured_images if count > 0 else None
        
    def train_face_model(self, employee_id, captured_images):
        """Train face recognition model for an employee"""
        if not captured_images:
            return False
            
        print(f"Training face model for employee {employee_id}...")
        face_encodings = []
        successful_images = []
        
        for image_path in captured_images:
            try:
                # Load and process image
                image = face_recognition.load_image_file(image_path)
                
                # Get face encodings
                encodings = face_recognition.face_encodings(image)
                
                if len(encodings) > 0:
                    face_encodings.append(encodings[0])
                    successful_images.append(image_path)
                    
            except Exception as e:
                print(f"Error processing {image_path}: {e}")
                continue
                
        if len(face_encodings) == 0:
            print("No valid face encodings found!")
            return False
            
        # Calculate average encoding for better accuracy
        average_encoding = np.mean(face_encodings, axis=0)
        
        # Save encoding to database
        try:
            # Convert encoding to binary for database storage
            encoding_binary = pickle.dumps(average_encoding)
            
            # Save to database
            query = """
            INSERT INTO face_training (employee_id, face_encoding, image_path, training_date)
            VALUES (%s, %s, %s, %s)
            """
            params = (employee_id, encoding_binary, successful_images[0], datetime.now())
            
            result = db.execute_query(query, params)
            
            if result:
                # Save model file as backup
                model_data = {
                    'employee_id': employee_id,
                    'face_encoding': average_encoding.tolist(),
                    'trained_images': successful_images,
                    'training_date': datetime.now().isoformat()
                }
                
                model_filename = f"employee_{employee_id}_model.pkl"
                model_path = os.path.join(self.models_path, model_filename)
                
                with open(model_path, 'wb') as f:
                    pickle.dump(model_data, f)
                    
                print(f"Face model trained successfully for employee {employee_id}")
                return True
            else:
                print("Failed to save model to database")
                return False
                
        except Exception as e:
            print(f"Error training model: {e}")
            return False
            
    def load_all_face_models(self):
        """Load all face models from database"""
        try:
            query = """
            SELECT ft.employee_id, ft.face_encoding, u.fullname 
            FROM face_training ft
            JOIN employees e ON ft.employee_id = e.employee_id
            JOIN users u ON e.user_id = u.user_id
            WHERE ft.is_active = TRUE
            """
            
            results = db.execute_query(query)
            
            if results:
                self.known_face_encodings = []
                self.known_face_names = []
                self.known_employee_ids = []
                
                for row in results:
                    # Load face encoding from binary data
                    face_encoding = pickle.loads(row['face_encoding'])
                    
                    self.known_face_encodings.append(face_encoding)
                    self.known_face_names.append(row['fullname'])
                    self.known_employee_ids.append(row['employee_id'])
                    
                print(f"Loaded {len(self.known_face_encodings)} face models")
                return True
            else:
                print("No face models found in database")
                return False
                
        except Exception as e:
            print(f"Error loading face models: {e}")
            return False
            
    def recognize_face(self, frame):
        """Recognize face in given frame"""
        if len(self.known_face_encodings) == 0:
            self.load_all_face_models()
            
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Find all face locations and encodings in the frame
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        recognized_employees = []
        
        for face_encoding in face_encodings:
            # Compare with known faces
            matches = face_recognition.compare_faces(
                self.known_face_encodings, face_encoding, tolerance=0.6
            )
            
            # Calculate face distances
            face_distances = face_recognition.face_distance(
                self.known_face_encodings, face_encoding
            )
            
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                
                if matches[best_match_index]:
                    confidence = 1 - face_distances[best_match_index]
                    
                    if confidence > 0.4:  # Minimum confidence threshold
                        employee_id = self.known_employee_ids[best_match_index]
                        employee_name = self.known_face_names[best_match_index]
                        
                        recognized_employees.append({
                            'employee_id': employee_id,
                            'name': employee_name,
                            'confidence': confidence
                        })
                        
        return recognized_employees, face_locations
        
    def mark_attendance(self, employee_id, confidence_score):
        """Mark attendance for recognized employee"""
        try:
            # Check if already marked today
            today = datetime.now().date()
            check_query = """
            SELECT attendance_id FROM attendance 
            WHERE employee_id = %s AND DATE(date) = %s
            """
            
            existing = db.execute_query(check_query, (employee_id, today))
            
            if existing:
                return False, "Attendance already marked for today"
                
            # Mark new attendance
            current_time = datetime.now()
            
            insert_query = """
            INSERT INTO attendance (
                employee_id, date, clock_in, status, 
                verification_method, verification_data, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            verification_data = json.dumps({
                'confidence_score': float(confidence_score),
                'recognition_time': current_time.isoformat(),
                'method': 'face_recognition'
            })
            
            params = (
                employee_id, current_time, current_time, 'present',
                'face', verification_data, current_time, current_time
            )
            
            result = db.execute_query(insert_query, params)
            
            if result:
                # Log the attendance attempt
                self.log_attendance_attempt(employee_id, confidence_score, 'success')
                return True, "Attendance marked successfully"
            else:
                return False, "Failed to mark attendance"
                
        except Exception as e:
            print(f"Error marking attendance: {e}")
            return False, f"Error: {str(e)}"
            
    def log_attendance_attempt(self, employee_id, confidence_score, status):
        """Log face recognition attempt"""
        try:
            query = """
            INSERT INTO face_attendance_log (
                employee_id, recognition_confidence, recognition_status, attempt_time
            ) VALUES (%s, %s, %s, %s)
            """
            
            params = (employee_id, confidence_score, status, datetime.now())
            db.execute_query(query, params)
            
        except Exception as e:
            print(f"Error logging attendance attempt: {e}")
            
    def delete_employee_model(self, employee_id):
        """Delete face model for an employee"""
        try:
            # Deactivate in database
            query = "UPDATE face_training SET is_active = FALSE WHERE employee_id = %s"
            result = db.execute_query(query, (employee_id,))
            
            if result:
                # Remove from loaded models
                if employee_id in self.known_employee_ids:
                    index = self.known_employee_ids.index(employee_id)
                    del self.known_face_encodings[index]
                    del self.known_face_names[index]
                    del self.known_employee_ids[index]
                    
                print(f"Face model deleted for employee {employee_id}")
                return True
            else:
                return False
                
        except Exception as e:
            print(f"Error deleting face model: {e}")
            return False
