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
        # LBPH returns lower value = better match. Typical good range < 60-70.
        # Make threshold configurable via env var LBPH_CONFIDENCE_THRESHOLD, default 65.
        try:
            self.lbph_threshold = float(os.environ.get('LBPH_CONFIDENCE_THRESHOLD', '65'))
        except Exception:
            self.lbph_threshold = 65.0
        
        # Create directories if they don't exist
        os.makedirs(self.dataset_path, exist_ok=True)
        os.makedirs(self.models_path, exist_ok=True)
        os.makedirs(self.temp_path, exist_ok=True)
        
        # Initialize database tables
        self.init_database()

    def _resolve_path(self, p: str) -> str:
        """Resolve potentially relative/Windows path to an absolute existing path.
        Tries a few candidates relative to this module's directory and current CWD.
        """
        try:
            if not p:
                return p
            # Strip whitespace and normalize separators
            p = str(p).strip().replace('\\', os.sep).replace('/', os.sep)
            # If already absolute and exists, return
            if os.path.isabs(p) and os.path.exists(p):
                return p
            # Build candidates
            candidates = []
            # As-is relative to CWD
            candidates.append(os.path.abspath(p))
            # Relative to this file's directory
            base_dir = os.path.dirname(os.path.abspath(__file__))
            candidates.append(os.path.abspath(os.path.join(base_dir, p)))
            # If path includes a folder and filename, also try under models_path
            if not os.path.isabs(p):
                candidates.append(os.path.abspath(os.path.join(base_dir, self.models_path, os.path.basename(p))))
            # Return first existing candidate
            for c in candidates:
                if os.path.exists(c):
                    return c
            # Fallback to original absolute of p (even if missing) for logging
            return candidates[0]
        except Exception:
            return p
        
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

            # Upsert to avoid duplicate key issues on unique employee_id
            query = """
            INSERT INTO face_training (
                employee_id, model_id, training_images_count, model_path, status, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                model_id = VALUES(model_id),
                training_images_count = VALUES(training_images_count),
                model_path = VALUES(model_path),
                status = VALUES(status),
                updated_at = VALUES(updated_at)
            """
            params = (employee_id, model_id, len(faces), model_path, 'active', current_time, current_time)
            print(f"Upserting model for employee {employee_id}")
            
            result = simple_db.execute_query(query, params)
            
            if result:
                print(f"Face model trained successfully for employee {employee_id}")
                
                # Cleanup dataset folder after successful training
                print("🧹 Cleaning up dataset folder...")
                cleanup_success = self.cleanup_dataset_folder(employee_id)
                if cleanup_success:
                    print(f"✅ Training completed with automatic cleanup for {employee_id}")
                else:
                    print(f"⚠️  Training completed but cleanup failed for {employee_id}")
                
                return True
            else:
                print("Failed to save model to database")
                return False
                
        except Exception as e:
            print(f"Error training model: {e}")
            return False
    
    def check_existing_model(self, employee_id):
        """Check if a face model already exists for the employee"""
        try:
            query = "SELECT id, model_path FROM face_training WHERE employee_id = %s"
            result = simple_db.execute_query(query, (employee_id,))
            return result[0] if result else None
        except Exception as e:
            print(f"Error checking existing model: {e}")
            return None
    
    def delete_existing_model_files(self, model_path):
        """Delete existing model files safely"""
        try:
            if os.path.exists(model_path):
                os.remove(model_path)
                print(f"Deleted old model file: {model_path}")
                return True
            return True  # File doesn't exist, consider it successful
        except Exception as e:
            print(f"Warning: Could not delete old model file {model_path}: {e}")
            return False
    
    def cleanup_dataset_folder(self, employee_id):
        """Delete dataset folder for employee after successful model training"""
        try:
            dataset_folder = os.path.join("datasets", f"employee_{employee_id}")
            
            if os.path.exists(dataset_folder):
                import shutil
                # Count files before deletion for logging
                file_count = len([f for f in os.listdir(dataset_folder) 
                                if os.path.isfile(os.path.join(dataset_folder, f))])
                
                # Remove the entire dataset folder
                shutil.rmtree(dataset_folder)
                print(f"✅ Cleaned up dataset folder: {dataset_folder} ({file_count} files deleted)")
                
                # Calculate storage saved (rough estimate: ~50KB per image)
                storage_saved_mb = (file_count * 50) / 1024  # Convert KB to MB
                print(f"💾 Storage saved: ~{storage_saved_mb:.1f} MB")
                
                return True
            else:
                print(f"Dataset folder not found: {dataset_folder}")
                return True  # Consider as success if folder doesn't exist
                
        except Exception as e:
            print(f"⚠️  Warning: Could not cleanup dataset folder for {employee_id}: {e}")
            print("Model training was successful, but manual cleanup may be needed")
            return False
    
    def cleanup_all_dataset_folders(self):
        """Clean up all dataset folders (useful for maintenance)"""
        try:
            datasets_dir = "datasets"
            if not os.path.exists(datasets_dir):
                print("No datasets directory found")
                return True
            
            total_deleted = 0
            total_storage_saved = 0
            
            # Get all employee dataset folders
            for folder_name in os.listdir(datasets_dir):
                folder_path = os.path.join(datasets_dir, folder_name)
                if os.path.isdir(folder_path) and folder_name.startswith("employee_"):
                    try:
                        # Count files before deletion
                        file_count = len([f for f in os.listdir(folder_path) 
                                        if os.path.isfile(os.path.join(folder_path, f))])
                        
                        # Remove folder
                        import shutil
                        shutil.rmtree(folder_path)
                        
                        total_deleted += file_count
                        print(f"Deleted {folder_name}: {file_count} files")
                        
                    except Exception as e:
                        print(f"Failed to delete {folder_name}: {e}")
            
            # Calculate total storage saved
            total_storage_saved_mb = (total_deleted * 50) / 1024
            
            print(f"✅ Cleanup completed!")
            print(f"📁 Total files deleted: {total_deleted}")
            print(f"💾 Total storage saved: ~{total_storage_saved_mb:.1f} MB")
            
            return True
            
        except Exception as e:
            print(f"Error during dataset cleanup: {e}")
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
                loaded = 0
                skipped = 0
                
                for row in results:
                    try:
                        # Load the trained model file
                        # Resolve model path robustly
                        model_path = self._resolve_path(row['model_path'])
                        if not os.path.exists(model_path):
                            # Fallback: construct path from employee_id
                            eid = str(row['employee_id']).strip()
                            candidate = os.path.join(self.models_path, f"employee_{eid}_model.yml")
                            model_path = self._resolve_path(candidate)

                        if os.path.exists(model_path):
                            recognizer = cv2.face.LBPHFaceRecognizer_create()
                            recognizer.read(model_path)
                            self.known_faces[row['employee_id']] = {
                                'name': row['fullname'],
                                'recognizer': recognizer
                            }
                            loaded += 1
                        else:
                            print(f"Model file not found, skipping: {model_path}")
                            skipped += 1
                        
                    except Exception as e:
                        print(f"Error loading model for employee {row['employee_id']}: {e}")
                        skipped += 1
                        continue
                        
                # Fallback scan: load any models present in models directory
                try:
                    import glob
                    pattern = os.path.join(self.models_path, "employee_*_model.yml")
                    for path in glob.glob(pattern):
                        try:
                            filename = os.path.basename(path)
                            # Extract employee_id between employee_ and _model.yml
                            start = len("employee_")
                            end = filename.rfind("_model.yml")
                            if end > start:
                                eid = filename[start:end]
                                if eid not in self.known_faces:
                                    # Lookup fullname from users table
                                    user_rows = simple_db.execute_query(
                                        "SELECT fullname FROM users WHERE user_id = %s",
                                        (eid,)
                                    )
                                    fullname = user_rows[0]['fullname'] if user_rows else eid
                                    recognizer = cv2.face.LBPHFaceRecognizer_create()
                                    recognizer.read(path)
                                    self.known_faces[eid] = {
                                        'name': fullname,
                                        'recognizer': recognizer
                                    }
                                    loaded += 1
                        except Exception as e:
                            print(f"Fallback scan load error for {path}: {e}")
                            continue
                except Exception as e:
                    print(f"Fallback scan error: {e}")

                print(f"Loaded {loaded} face models, skipped {skipped}")
                return loaded > 0
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
            best_raw_confidence = float('inf')  # raw LBPH distance (lower is better)
            
            # Try to recognize with each trained model
            for employee_id, face_data in self.known_faces.items():
                try:
                    recognizer = face_data['recognizer']
                    label, raw_conf = recognizer.predict(face_resized)

                    # Keep the lowest raw distance across models
                    if raw_conf < best_raw_confidence:
                        # Provide a normalized confidence for UI (0..1), higher is better
                        # Using 1 - raw/100 keeps previous UI behavior
                        normalized = max(0.0, min(1.0, 1.0 - (raw_conf / 100.0)))
                        best_raw_confidence = raw_conf
                        best_match = {
                            'employee_id': employee_id,
                            'name': face_data['name'],
                            'confidence': normalized,
                            'raw_confidence': raw_conf,
                            'face_location': (x, y, x+w, y+h)
                        }
                        
                except Exception as e:
                    print(f"Error during recognition: {e}")
                    continue
                    
            # Add recognized employee (or None for unknown faces)
            # Decide known/unknown based on LBPH raw distance threshold
            if best_match and best_raw_confidence <= self.lbph_threshold:
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
