try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    print("⚠️  Requests library not available. Backend API features will use database fallback only.")

import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class BackendAPI:
    def __init__(self):
        self.base_url = os.getenv('BACKEND_API_URL', 'http://localhost:5000')
        if REQUESTS_AVAILABLE:
            self.session = requests.Session()
        else:
            self.session = None
        
    def check_user_room_access(self, user_id, date=None):
        """
        Check if user is allowed to access room on specific date
        Returns: dict with access info or None if no access
        """
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        # If requests is not available, use fallback immediately
        if not REQUESTS_AVAILABLE or self.session is None:
            print("[BACKEND API] Using database fallback (requests not available)")
            return self._check_access_fallback(user_id, date)
            
        try:
            # Check if user has any classes scheduled for today
            url = f"{self.base_url}/api/attendance/check-access"
            data = {
                'user_id': user_id,
                'date': date
            }
            
            response = self.session.post(url, json=data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                return result.get('data', None)
            else:
                print(f"[BACKEND API] Error checking access: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"[BACKEND API] Request error: {e}")
            # Fallback to database check if backend is unavailable
            return self._check_access_fallback(user_id, date)
    
    def _check_access_fallback(self, user_id, date):
        """
        Fallback method to check access directly from database
        when backend API is unavailable
        """
        try:
            from simple_database import simple_db
            
            # Check if user has any attendance sessions today
            query = """
            SELECT 
                ats.id as session_id,
                ats.session_date,
                ats.start_time,
                ats.end_time,
                ats.topic,
                cc.class_name,
                c.course_name
            FROM attendance_sessions ats
            JOIN course_classes cc ON ats.class_id = cc.id
            JOIN courses c ON cc.course_id = c.id
            JOIN class_students cs ON cc.id = cs.class_id
            WHERE cs.student_id = %s 
            AND ats.session_date = %s
            AND ats.status = 'active'
            ORDER BY ats.start_time
            """
            
            result = simple_db.execute_query(query, (user_id, date))
            
            if result and len(result) > 0:
                return {
                    'allowed': True,
                    'sessions': result,
                    'reason': 'Has scheduled classes today'
                }
            else:
                return {
                    'allowed': False,
                    'sessions': [],
                    'reason': 'No scheduled classes today'
                }
                
        except Exception as e:
            print(f"[BACKEND API] Fallback error: {e}")
            return None
    
    def log_door_access(self, user_id, access_type='face_recognition', 
                       access_status='granted', confidence_score=None, 
                       reason=None, session_id=None):
        """
        Log door access attempt to backend
        """
        # If requests is not available, use fallback immediately
        if not REQUESTS_AVAILABLE or self.session is None:
            return self._log_access_fallback(user_id, access_type, access_status, 
                                           confidence_score, reason, session_id)
            
        try:
            url = f"{self.base_url}/api/door-access/log"
            data = {
                'user_id': user_id,
                'access_type': access_type,
                'access_status': access_status,
                'confidence_score': confidence_score,
                'reason': reason,
                'session_id': session_id,
                'accessed_at': datetime.now().isoformat()
            }
            
            response = self.session.post(url, json=data, timeout=5)
            
            if response.status_code == 200:
                print(f"[BACKEND API] Access logged successfully for user {user_id}")
                return True
            else:
                print(f"[BACKEND API] Error logging access: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"[BACKEND API] Request error logging access: {e}")
            # Fallback to database logging
            return self._log_access_fallback(user_id, access_type, access_status, 
                                           confidence_score, reason, session_id)
    
    def _log_access_fallback(self, user_id, access_type, access_status, 
                           confidence_score, reason, session_id):
        """
        Fallback method to log access directly to database
        """
        try:
            from simple_database import simple_db
            
            query = """
            INSERT INTO door_access_logs 
            (user_id, access_type, access_status, confidence_score, reason, session_id, accessed_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            
            values = (
                user_id, access_type, access_status, confidence_score, 
                reason, session_id, datetime.now()
            )
            
            result = simple_db.execute_query(query, values)
            return result is not None
            
        except Exception as e:
            print(f"[BACKEND API] Fallback logging error: {e}")
            return False

# Create global instance
backend_api = BackendAPI()