import cv2
import numpy as np
import os
import pickle
import json
from datetime import datetime
from simple_database import simple_db

class SimpleFaceRecognition:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.known_faces = {}
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
        # Tables will be created manually or via migration
        # For now, just ensure they exist by attempting to query them
        try:
            # Test if tables exist
            simple_db.execute_query("SELECT 1 FROM face_training LIMIT 1")
            print("Face recognition tables verified")
        except:
            print("Face recognition tables may need to be created manually")
            # You can uncomment these lines if you want to auto-create tables:
            # self.create_face_training_table()
        
    def capture_face_dataset(self, employee_id, employee_name, num_samples=100):
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
        
        print(f"Starting automatic face capture for employee {employee_id}")
        print(f"Will capture {num_samples} images automatically...")
        print("Please position your face in front of the camera and stay still")
        
        # Wait 3 seconds before starting
        import time
        for i in range(3, 0, -1):
            print(f"Starting in {i}...")
            time.sleep(1)
        
        while count < num_samples:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Convert to grayscale for face detection
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
            
            # Display frame
            cv2.putText(frame, f"Captured: {count}/{num_samples}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, "Auto-capturing... Stay still!", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            cv2.putText(frame, "Press ESC to cancel", (10, 80), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            # Draw rectangles around detected faces
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                cv2.putText(frame, "Face Detected", (x, y-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            
            cv2.imshow('Face Dataset Capture - Automatic', frame)
            
            # Automatic capture if exactly one face detected
            if len(faces) == 1:
                x, y, w, h = faces[0]
                face_roi = gray[y:y+h, x:x+w]
                
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                filename = f"face_{count:03d}_{timestamp}.jpg"
                filepath = os.path.join(employee_dir, filename)
                
                # Resize face to standard size
                face_resized = cv2.resize(face_roi, (200, 200))
                cv2.imwrite(filepath, face_resized)
                captured_images.append(filepath)
                count += 1
                print(f"Auto-captured image {count}/{num_samples}")
                
                # Small delay between captures
                time.sleep(0.15)
            
            # Check for ESC key to quit early
            key = cv2.waitKey(1) & 0xFF
            if key == 27:  # ESC to quit
                print("Capture cancelled by user")
                break
                
        cap.release()
        cv2.destroyAllWindows()
        
        return captured_images if count > 0 else None
        
    def train_face_model(self, employee_id, captured_images):
        """Train face recognition model for an employee"""
        if not captured_images:
            return False
            
        print(f"Training face model for employee {employee_id}...")
        
        faces = []
        labels = []
        
        # Convert employee_id to integer for OpenCV
        try:
            # Extract numeric part from employee_id if it contains letters
            import re
            numeric_id = re.findall(r'\d+', str(employee_id))
            if numeric_id:
                label_id = int(numeric_id[0])
            else:
                # Fallback: use hash of employee_id and take modulo
                label_id = abs(hash(str(employee_id))) % 10000
        except:
            # Ultimate fallback
            label_id = 1
        
        print(f"Using label ID: {label_id} for employee: {employee_id}")
        
        for image_path in captured_images:
            try:
                # Load image as grayscale
                image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
                if image is not None:
                    faces.append(image)
                    labels.append(label_id)  # Use integer label
                    
            except Exception as e:
                print(f"Error processing {image_path}: {e}")
                continue
                
        if len(faces) == 0:
            print("No valid face images found!")
            return False
            
        # Train the recognizer
        try:
            # Convert to numpy array with correct dtype
            labels_array = np.array(labels, dtype=np.int32)
            print(f"Training with {len(faces)} faces and labels dtype: {labels_array.dtype}")
            
            self.recognizer.train(faces, labels_array)
            
            # Save model
            model_filename = f"employee_{employee_id}_model.yml"
            model_path = os.path.join(self.models_path, model_filename)
            self.recognizer.write(model_path)
            
            # Save to database
            model_data = {
                'employee_id': employee_id,
                'model_path': model_path,
                'trained_images': captured_images,
                'training_date': datetime.now().isoformat(),
                'num_samples': len(faces),
                'label_id': label_id  # Store the numeric label used
            }
            
            # Convert model data to binary for database storage
            model_binary = pickle.dumps(model_data)
            
            import uuid
            current_time = datetime.now()
            model_id = str(uuid.uuid4())
            
            query = """
            INSERT INTO face_training (employee_id, model_id, training_images_count, 
                                     model_path, status, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            params = (employee_id, model_id, len(faces), model_path, 'active', current_time, current_time)
            
            result = simple_db.execute_query(query, params)
            
            if result:
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
            SELECT ft.employee_id, ft.model_path, u.fullname 
            FROM face_training ft
            JOIN users u ON ft.employee_id = u.user_id
            WHERE ft.status = 'active'
            """
            
            results = simple_db.execute_query(query)
            
            if results:
                self.known_faces = {}
                
                for row in results:
                    try:
                        # Load the trained model file
                        if os.path.exists(row['model_path']):
                            recognizer = cv2.face.LBPHFaceRecognizer_create()
                            recognizer.read(row['model_path'])
                            
                            self.known_faces[row['employee_id']] = {
                                'name': row['fullname'],
                                'recognizer': recognizer
                            }
                        
                    except Exception as e:
                        print(f"Error loading model for employee {row['employee_id']}: {e}")
                        continue
                        
                print(f"Loaded {len(self.known_faces)} face models")
                return True
            else:
                print("No face models found in database")
                return False
                
        except Exception as e:
            print(f"Error loading face models: {e}")
            return False
            
    def recognize_face(self, frame):
        """Recognize face in given frame"""
        if len(self.known_faces) == 0:
            self.load_all_face_models()
            
        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        recognized_employees = []
        face_locations = []
        
        for (x, y, w, h) in faces:
            # Store face location in (left, top, right, bottom) format
            face_locations.append((x, y, x+w, y+h))
            
            face_roi = gray[y:y+h, x:x+w]
            face_resized = cv2.resize(face_roi, (200, 200))
            
            best_match = None
            best_confidence = float('inf')
            
            # Try to recognize with each trained model
            for employee_id, face_data in self.known_faces.items():
                try:
                    recognizer = face_data['recognizer']
                    label, confidence = recognizer.predict(face_resized)
                    
                    # Lower confidence means better match in OpenCV LBPH
                    if confidence < best_confidence and confidence < 100:  # Threshold
                        best_confidence = confidence
                        best_match = {
                            'employee_id': employee_id,
                            'name': face_data['name'],
                            'confidence': 1 - (confidence / 100),  # Convert to 0-1 scale
                            'face_location': (x, y, x+w, y+h)  # Store face location with recognition
                        }
                        
                except Exception as e:
                    print(f"Error during recognition: {e}")
                    continue
                    
            # Add recognized employee (or None for unknown faces)
            if best_match and best_match['confidence'] > 0.3:  # Minimum confidence
                recognized_employees.append(best_match)
            else:
                recognized_employees.append(None)  # Unknown face
                
        return recognized_employees, face_locations
        
    def mark_attendance(self, employee_id, confidence_score):
        """Mark attendance for recognized employee"""
        try:
            # Check if already marked today
            today = datetime.now().date()
            check_query = """
            SELECT id FROM student_attendances 
            WHERE student_id = %s AND DATE(check_in_time) = %s
            """
            
            existing = simple_db.execute_query(check_query, (employee_id, today))
            
            if existing:
                return False, "Attendance already marked for today"
                
            # Get active session for today (we need session_id for student_attendances)
            session_query = """
            SELECT id as session_id FROM attendance_sessions 
            WHERE DATE(start_time) = %s AND status = 'active'
            ORDER BY start_time DESC
            LIMIT 1
            """
            
            session_result = simple_db.execute_query(session_query, (today,))
            session_id = session_result[0]['session_id'] if session_result else 1  # Default to 1 if no active session
                
            # Mark new attendance
            current_time = datetime.now()
            
            insert_query = """
            INSERT INTO student_attendances (
                session_id, student_id, status, check_in_time, 
                attendance_method, confidence_score, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            params = (
                session_id, employee_id, 'present', current_time,
                'face_recognition', confidence_score, current_time, current_time
            )
            
            result = simple_db.execute_query(insert_query, params)
            
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
            INSERT INTO face_recognition_logs (
                user_id, confidence_score, recognition_status, timestamp, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s)
            """
            
            current_time = datetime.now()
            params = (employee_id, confidence_score, status, current_time, current_time, current_time)
            simple_db.execute_query(query, params)
            
        except Exception as e:
            print(f"Error logging attendance attempt: {e}")
            
    def delete_employee_model(self, employee_id):
        """Delete face model for an employee"""
        try:
            # Deactivate in database
            query = "UPDATE face_training SET status = 'inactive' WHERE employee_id = %s"
            result = simple_db.execute_query(query, (employee_id,))
            
            if result:
                # Remove from loaded models
                if employee_id in self.known_faces:
                    del self.known_faces[employee_id]
                    
                print(f"Face model deleted for employee {employee_id}")
                return True
            else:
                return False
                
        except Exception as e:
            print(f"Error deleting face model: {e}")
            return False
