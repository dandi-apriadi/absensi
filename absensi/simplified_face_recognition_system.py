"""
Simplified Face Recognition System with MySQL and Argon2 Authentication
Compatible with Node.js backend authentication system
"""

import cv2
import numpy as np
import sqlite3
import json
import logging
import hashlib
from datetime import datetime, date
from pathlib import Path
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os

# MySQL and Argon2 imports
import mysql.connector
from mysql.connector import Error
import argon2

# Try to import MTCNN (optional)
try:
    from mtcnn import MTCNN
    MTCNN_AVAILABLE = True
except ImportError:
    MTCNN_AVAILABLE = False
    print("⚠️  MTCNN not available, using OpenCV Haar Cascades")

class SimplifiedFaceRecognitionSystem:
    """Simplified Face Recognition System with MySQL Database Integration"""
    
    def __init__(self, db_path="data/attendance.db"):
        self.db_path = db_path
        self.models_dir = Path("data/models")
        self.datasets_dir = Path("data/datasets")
        self.models_dir.mkdir(parents=True, exist_ok=True)
        self.datasets_dir.mkdir(parents=True, exist_ok=True)
        
        # MySQL Database configuration (same as Node.js backend)
        self.db_config = {
            'host': 'localhost',
            'database': 'insightflow',
            'user': 'root',
            'password': '',
            'port': 3306
        }
        
        # Initialize components
        self.setup_logging()
        self.initialize_face_detector()
        self.setup_database()
        self.init_mysql_connection()
        
        # Classification models
        self.svm_classifier = None
        self.label_encoder = LabelEncoder()
        self.face_embeddings = []
        self.face_labels = []
        
        # Load existing models
        self.load_trained_models()
        
    def setup_logging(self):
        """Setup logging system"""
        log_dir = Path("data/logs")
        log_dir.mkdir(parents=True, exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(f'data/logs/app_{datetime.now().strftime("%Y%m%d")}.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        self.logger.info("Simplified Face Recognition System initialized")
        
    def init_mysql_connection(self):
        """Initialize MySQL connection"""
        try:
            self.mysql_conn = mysql.connector.connect(**self.db_config)
            if self.mysql_conn.is_connected():
                self.logger.info("MySQL database connection established")
            else:
                self.logger.error("Failed to connect to MySQL database")
                self.mysql_conn = None
        except Error as e:
            self.logger.error(f"MySQL connection error: {e}")
            self.mysql_conn = None
            
    def get_mysql_connection(self):
        """Get active MySQL connection or create new one"""
        try:
            if not hasattr(self, 'mysql_conn') or self.mysql_conn is None or not self.mysql_conn.is_connected():
                self.init_mysql_connection()
            return self.mysql_conn
        except Error as e:
            self.logger.error(f"Failed to get MySQL connection: {e}")
            return None
            
    def authenticate_employee(self, email, password):
        """Authenticate employee against Node.js backend database using Argon2"""
        conn = self.get_mysql_connection()
        if not conn:
            self.logger.warning("No MySQL connection available")
            return None
            
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Query users table (same structure as Node.js backend)
            query = """
                SELECT user_id, fullname, email, password, role, department, 
                       position, status, verified 
                FROM users 
                WHERE email = %s AND status = 'active'
            """
            cursor.execute(query, (email,))
            user = cursor.fetchone()
            
            if user:
                # Verify password using argon2 (same as Node.js backend)
                try:
                    ph = argon2.PasswordHasher()
                    ph.verify(user['password'], password)
                    
                    # Password verified successfully
                    self.logger.info(f"User authenticated: {email}")
                    return {
                        'id': user['user_id'],
                        'employee_id': user['user_id'],
                        'nama': user['fullname'],
                        'name': user['fullname'],
                        'email': user['email'],
                        'role': user['role'],
                        'department': user['department'] or 'N/A',
                        'position': user['position'] or 'N/A',
                        'verified': user['verified']
                    }
                except argon2.exceptions.VerifyMismatchError:
                    self.logger.warning(f"Invalid password for user: {email}")
                    return None
                except argon2.exceptions.InvalidHash:
                    self.logger.error(f"Invalid password hash format for user: {email}")
                    return None
                except Exception as e:
                    self.logger.error(f"Password verification error: {e}")
                    return None
            else:
                self.logger.warning(f"User not found or inactive: {email}")
                return None
                
        except Error as e:
            self.logger.error(f"Database authentication error: {e}")
            return None
        finally:
            if 'cursor' in locals():
                cursor.close()
        
    def initialize_face_detector(self):
        """Initialize face detector (MTCNN or OpenCV)"""
        try:
            if MTCNN_AVAILABLE:
                self.face_detector = MTCNN()
                self.detection_method = "mtcnn"
                self.logger.info("Using MTCNN for face detection")
            else:
                # Fallback to OpenCV Haar Cascade
                cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
                self.face_detector = cv2.CascadeClassifier(cascade_path)
                self.detection_method = "opencv"
                self.logger.info("Using OpenCV Haar Cascades for face detection")
                
        except Exception as e:
            self.logger.error(f"Error initializing face detector: {e}")
            
    def setup_database(self):
        """Setup SQLite database for face data storage"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create employees table for face data
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS employees (
                    employee_id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    face_encoding BLOB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create attendance table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS attendance (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    employee_id INTEGER,
                    attendance_date DATE,
                    check_in_time TIMESTAMP,
                    check_out_time TIMESTAMP,
                    status TEXT DEFAULT 'present',
                    confidence_score REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
                )
            ''')
            
            conn.commit()
            conn.close()
            self.logger.info("Database initialized successfully")
            
        except Exception as e:
            self.logger.error(f"Database setup error: {e}")
            
    def detect_faces(self, image):
        """Detect faces in image using configured detector"""
        if self.detection_method == "mtcnn":
            return self.detect_faces_mtcnn(image)
        else:
            return self.detect_faces_opencv(image)
            
    def detect_faces_mtcnn(self, image):
        """Detect faces using MTCNN"""
        try:
            # Convert BGR to RGB for MTCNN
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Detect faces
            results = self.face_detector.detect_faces(rgb_image)
            
            faces = []
            for result in results:
                if result['confidence'] > 0.9:  # High confidence threshold
                    box = result['box']
                    x, y, w, h = box
                    # Ensure coordinates are within image bounds
                    x = max(0, x)
                    y = max(0, y)
                    w = min(w, image.shape[1] - x)
                    h = min(h, image.shape[0] - y)
                    
                    face = image[y:y+h, x:x+w]
                    if face.size > 0:
                        faces.append(face)
                        
            return faces
            
        except Exception as e:
            self.logger.error(f"MTCNN face detection error: {e}")
            return []
            
    def detect_faces_opencv(self, image):
        """Detect faces using OpenCV Haar Cascade"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            face_coords = self.face_detector.detectMultiScale(
                gray, 
                scaleFactor=1.1, 
                minNeighbors=5, 
                minSize=(30, 30)
            )
            
            faces = []
            for (x, y, w, h) in face_coords:
                face = image[y:y+h, x:x+w]
                faces.append(face)
                
            return faces
            
        except Exception as e:
            self.logger.error(f"OpenCV face detection error: {e}")
            return []
            
    def extract_face_features(self, face):
        """Extract features from face using simple histogram method"""
        try:
            # Resize face to standard size
            face_resized = cv2.resize(face, (64, 64))
            
            # Convert to grayscale
            gray_face = cv2.cvtColor(face_resized, cv2.COLOR_BGR2GRAY)
            
            # Extract histogram features
            hist = cv2.calcHist([gray_face], [0], None, [256], [0, 256])
            
            # Normalize histogram
            hist = hist.flatten()
            hist = hist / (hist.sum() + 1e-7)  # Add small epsilon to avoid division by zero
            
            # Add additional texture features (LBP-like)
            texture_features = self.extract_texture_features(gray_face)
            
            # Combine histogram and texture features
            features = np.concatenate([hist, texture_features])
            
            return features
            
        except Exception as e:
            self.logger.error(f"Feature extraction error: {e}")
            return None
            
    def extract_texture_features(self, gray_image):
        """Extract simple texture features"""
        try:
            # Calculate gradients
            grad_x = cv2.Sobel(gray_image, cv2.CV_64F, 1, 0, ksize=3)
            grad_y = cv2.Sobel(gray_image, cv2.CV_64F, 0, 1, ksize=3)
            
            # Calculate gradient magnitude
            magnitude = np.sqrt(grad_x**2 + grad_y**2)
            
            # Extract statistical features
            features = [
                np.mean(magnitude),
                np.std(magnitude),
                np.percentile(magnitude, 25),
                np.percentile(magnitude, 75)
            ]
            
            return np.array(features)
            
        except Exception as e:
            self.logger.error(f"Texture feature extraction error: {e}")
            return np.zeros(4)
            
    def register_employee_face(self, employee_id, name, image):
        """Register employee face"""
        try:
            # Detect faces in image
            faces = self.detect_faces(image)
            
            if not faces:
                self.logger.warning(f"No face detected for employee {name}")
                return False
                
            if len(faces) > 1:
                self.logger.warning(f"Multiple faces detected for employee {name}, using the first one")
                
            # Use the first detected face
            face = faces[0]
            
            # Extract features
            features = self.extract_face_features(face)
            if features is None:
                self.logger.error(f"Failed to extract features for employee {name}")
                return False
                
            # Save to database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Convert features to blob
            features_blob = pickle.dumps(features)
            
            # Insert or update employee face data
            cursor.execute('''
                INSERT OR REPLACE INTO employees 
                (employee_id, name, face_encoding, updated_at)
                VALUES (?, ?, ?, ?)
            ''', (employee_id, name, features_blob, datetime.now()))
            
            conn.commit()
            conn.close()
            
            # Add to current session
            self.face_embeddings.append(features)
            self.face_labels.append(str(employee_id))
            
            # Retrain model
            self.train_classifier()
            
            self.logger.info(f"Face registered successfully for employee {name} (ID: {employee_id})")
            return True
            
        except Exception as e:
            self.logger.error(f"Face registration error: {e}")
            return False
            
    def train_classifier(self):
        """Train SVM classifier with current face data"""
        try:
            if len(self.face_embeddings) < 2:
                self.logger.warning("Not enough face data to train classifier")
                return False
                
            # Prepare data
            X = np.array(self.face_embeddings)
            y = np.array(self.face_labels)
            
            # Encode labels
            y_encoded = self.label_encoder.fit_transform(y)
            
            # Train SVM classifier
            self.svm_classifier = SVC(
                kernel='rbf',
                probability=True,
                gamma='scale',
                C=1.0
            )
            
            self.svm_classifier.fit(X, y_encoded)
            
            # Calculate accuracy if we have enough data
            if len(X) > 4:
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y_encoded, test_size=0.2, random_state=42
                )
                y_pred = self.svm_classifier.predict(X_test)
                accuracy = accuracy_score(y_test, y_pred)
                self.logger.info(f"Model trained with accuracy: {accuracy:.2%}")
            else:
                self.logger.info("Model trained successfully")
                
            # Save model
            self.save_trained_models()
            
            return True
            
        except Exception as e:
            self.logger.error(f"Model training error: {e}")
            return False
            
    def verify_and_record_attendance(self, employee_id, image, attendance_type='check_in'):
        """Verify face and record attendance"""
        try:
            # First verify that this employee has registered face
            if not self.is_employee_registered(employee_id):
                self.logger.warning(f"Employee {employee_id} has no registered face")
                return False
                
            # Detect faces in image
            faces = self.detect_faces(image)
            
            if not faces:
                self.logger.warning("No face detected in attendance image")
                return False
                
            # Use the first detected face
            face = faces[0]
            
            # Extract features
            features = self.extract_face_features(face)
            if features is None:
                self.logger.error("Failed to extract features from attendance image")
                return False
                
            # Verify face
            if self.svm_classifier is None:
                self.logger.error("No trained classifier available")
                return False
                
            # Predict
            features_reshaped = features.reshape(1, -1)
            prediction = self.svm_classifier.predict(features_reshaped)
            probabilities = self.svm_classifier.predict_proba(features_reshaped)
            
            # Get predicted employee ID
            predicted_employee_id = self.label_encoder.inverse_transform(prediction)[0]
            confidence = np.max(probabilities)
            
            # Check if prediction matches expected employee and confidence is high enough
            if predicted_employee_id == str(employee_id) and confidence > 0.7:
                # Record attendance
                success = self.record_attendance(employee_id, attendance_type, confidence)
                if success:
                    self.logger.info(f"Attendance recorded for employee {employee_id}, confidence: {confidence:.2%}")
                    return True
                else:
                    self.logger.error(f"Failed to record attendance for employee {employee_id}")
                    return False
            else:
                self.logger.warning(f"Face verification failed. Expected: {employee_id}, Got: {predicted_employee_id}, Confidence: {confidence:.2%}")
                return False
                
        except Exception as e:
            self.logger.error(f"Attendance verification error: {e}")
            return False
            
    def is_employee_registered(self, employee_id):
        """Check if employee has registered face"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                'SELECT COUNT(*) FROM employees WHERE employee_id = ?', 
                (employee_id,)
            )
            count = cursor.fetchone()[0]
            conn.close()
            
            return count > 0
            
        except Exception as e:
            self.logger.error(f"Error checking employee registration: {e}")
            return False
            
    def record_attendance(self, employee_id, attendance_type, confidence):
        """Record attendance in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            today = date.today()
            now = datetime.now()
            
            # Check if attendance record exists for today
            cursor.execute('''
                SELECT id, check_in_time, check_out_time 
                FROM attendance 
                WHERE employee_id = ? AND attendance_date = ?
            ''', (employee_id, today))
            
            existing_record = cursor.fetchone()
            
            if attendance_type == 'check_in':
                if existing_record and existing_record[1]:  # Already checked in
                    self.logger.warning(f"Employee {employee_id} already checked in today")
                    conn.close()
                    return False
                    
                if existing_record:
                    # Update existing record
                    cursor.execute('''
                        UPDATE attendance 
                        SET check_in_time = ?, confidence_score = ?
                        WHERE id = ?
                    ''', (now, confidence, existing_record[0]))
                else:
                    # Create new record
                    cursor.execute('''
                        INSERT INTO attendance 
                        (employee_id, attendance_date, check_in_time, confidence_score)
                        VALUES (?, ?, ?, ?)
                    ''', (employee_id, today, now, confidence))
                    
            else:  # check_out
                if not existing_record or not existing_record[1]:  # No check-in record
                    self.logger.warning(f"Employee {employee_id} has not checked in today")
                    conn.close()
                    return False
                    
                if existing_record[2]:  # Already checked out
                    self.logger.warning(f"Employee {employee_id} already checked out today")
                    conn.close()
                    return False
                    
                # Update check-out time
                cursor.execute('''
                    UPDATE attendance 
                    SET check_out_time = ?, confidence_score = ?
                    WHERE id = ?
                ''', (now, confidence, existing_record[0]))
                
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error recording attendance: {e}")
            return False
            
    def load_trained_models(self):
        """Load existing trained models"""
        try:
            # Load face data from database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT employee_id, face_encoding FROM employees WHERE face_encoding IS NOT NULL')
            records = cursor.fetchall()
            conn.close()
            
            if records:
                self.face_embeddings = []
                self.face_labels = []
                
                for employee_id, face_encoding_blob in records:
                    features = pickle.loads(face_encoding_blob)
                    self.face_embeddings.append(features)
                    self.face_labels.append(str(employee_id))
                    
                # Train classifier with loaded data
                if len(self.face_embeddings) >= 2:
                    self.train_classifier()
                    self.logger.info(f"Loaded {len(self.face_embeddings)} face encodings from database")
                else:
                    self.logger.info("Not enough face data to train classifier")
            else:
                self.logger.info("No existing face data found in database")
                
        except Exception as e:
            self.logger.error(f"Error loading trained models: {e}")
            
    def save_trained_models(self):
        """Save trained models to file"""
        try:
            if self.svm_classifier is not None:
                model_data = {
                    'svm_classifier': self.svm_classifier,
                    'label_encoder': self.label_encoder,
                    'face_embeddings': self.face_embeddings,
                    'face_labels': self.face_labels
                }
                
                model_path = self.models_dir / 'face_recognition_model.pkl'
                with open(model_path, 'wb') as f:
                    pickle.dump(model_data, f)
                    
                self.logger.info(f"Models saved to {model_path}")
                
        except Exception as e:
            self.logger.error(f"Error saving models: {e}")
            
    def get_attendance_records(self, employee_id=None, start_date=None, end_date=None):
        """Get attendance records"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            query = '''
                SELECT a.*, e.name 
                FROM attendance a
                LEFT JOIN employees e ON a.employee_id = e.employee_id
                WHERE 1=1
            '''
            params = []
            
            if employee_id:
                query += ' AND a.employee_id = ?'
                params.append(employee_id)
                
            if start_date:
                query += ' AND a.attendance_date >= ?'
                params.append(start_date)
                
            if end_date:
                query += ' AND a.attendance_date <= ?'
                params.append(end_date)
                
            query += ' ORDER BY a.attendance_date DESC, a.check_in_time DESC'
            
            cursor.execute(query, params)
            records = cursor.fetchall()
            conn.close()
            
            return records
            
        except Exception as e:
            self.logger.error(f"Error getting attendance records: {e}")
            return []

def main():
    """Test the system"""
    print("🧪 Testing Simplified Face Recognition System with MySQL + Argon2...")
    
    try:
        # Initialize system
        system = SimplifiedFaceRecognitionSystem()
        
        # Test MySQL authentication
        print("\n🔐 Testing MySQL Authentication with Argon2...")
        test_email = input("Enter email to test: ").strip()
        test_password = input("Enter password: ").strip()
        
        if test_email and test_password:
            user = system.authenticate_employee(test_email, test_password)
            if user:
                print(f"✅ Authentication successful!")
                print(f"   User: {user['nama']}")
                print(f"   Role: {user['role']}")
                print(f"   ID: {user['id']}")
            else:
                print("❌ Authentication failed")
        
        print("\n✅ System test completed!")
        
    except Exception as e:
        print(f"❌ System test failed: {e}")

if __name__ == "__main__":
    main()
