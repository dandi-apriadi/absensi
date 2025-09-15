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
        
        # Use fallback database check immediately since backend requires auth
        print(f"[BACKEND API] Using database fallback for user {user_id} on {date}")
        return self._check_access_fallback(user_id, date)
    
    def _check_access_fallback(self, user_id, date):
        """
        Fallback method to check access directly from database
        when backend API is unavailable - using class schedules instead of attendance sessions
        """
        try:
            from simple_database import simple_db
            from datetime import datetime
            
            # Get current day and time
            now = datetime.now()
            current_day_en = now.strftime('%A')  # Monday, Tuesday, etc.
            current_time = now.strftime('%H:%M')  # HH:MM format
            
            # Day mapping
            day_mapping = {
                'Monday': 'Senin',
                'Tuesday': 'Selasa', 
                'Wednesday': 'Rabu',
                'Thursday': 'Kamis',
                'Friday': 'Jumat',
                'Saturday': 'Sabtu',
                'Sunday': 'Minggu'
            }
            
            current_day_id = day_mapping.get(current_day_en, current_day_en)
            
            print(f"[BACKEND API] Checking access for {user_id}")
            print(f"[BACKEND API] Current day: {current_day_en} ({current_day_id})")
            print(f"[BACKEND API] Current time: {current_time}")
            
            # Check if user is enrolled in any classes with schedule for today
            query = """
            SELECT 
                cc.id as class_id,
                cc.class_name,
                cc.schedule,
                c.course_name,
                c.course_code
            FROM course_classes cc
            JOIN courses c ON cc.course_id = c.id
            JOIN student_enrollments se ON cc.id = se.class_id
            WHERE se.student_id = %s 
            AND cc.status = 'active'
            AND se.status = 'enrolled'
            """
            
            result = simple_db.execute_query(query, (user_id,))
            
            if not result:
                print(f"[BACKEND API] No enrolled classes found for user {user_id}")
                return {
                    'allowed': False,
                    'classes': [],
                    'reason': 'No enrolled classes found'
                }
            
            print(f"[BACKEND API] Found {len(result)} enrolled classes")
            
            # Check if any class has schedule for current day and time
            has_access = False
            access_info = []
            
            for cls in result:
                schedule_json = cls.get('schedule', '[]')
                try:
                    import json
                    # Handle double-encoded JSON
                    if isinstance(schedule_json, str):
                        # First decode
                        schedule = json.loads(schedule_json)
                        # If result is still a string, decode again
                        if isinstance(schedule, str):
                            schedule = json.loads(schedule)
                    else:
                        schedule = schedule_json or []
                        
                    # Ensure schedule is a list
                    if not isinstance(schedule, list):
                        schedule = []
                        
                except Exception as e:
                    print(f"[BACKEND API] Error parsing schedule for class {cls['class_name']}: {e}")
                    continue
                
                print(f"[BACKEND API] Class {cls['class_name']} schedule: {schedule}")
                
                # Check if current day and time matches any schedule
                for slot in schedule:
                    # Ensure slot is a dictionary
                    if not isinstance(slot, dict):
                        print(f"[BACKEND API] Invalid slot format: {slot}")
                        continue
                    day_match = slot.get('day') == current_day_id or slot.get('day') == current_day_en
                    
                    if day_match:
                        start_time = slot.get('start_time', '')
                        end_time = slot.get('end_time', '')
                        
                        print(f"[BACKEND API] Checking time: {current_time} between {start_time} - {end_time}")
                        
                        # Check if current time is within the schedule
                        if start_time <= current_time <= end_time:
                            print(f"[BACKEND API] ✅ ACCESS GRANTED! Time {current_time} is within {start_time}-{end_time}")
                            has_access = True
                            access_info.append({
                                'class_id': cls['class_id'],
                                'class_name': cls['class_name'],
                                'course_name': cls['course_name'],
                                'course_code': cls['course_code'],
                                'schedule_day': slot['day'],
                                'start_time': start_time,
                                'end_time': end_time
                            })
                        else:
                            print(f"[BACKEND API] ❌ Time {current_time} is NOT within {start_time}-{end_time}")
                    else:
                        print(f"[BACKEND API] ❌ Day doesn't match: {slot.get('day')} !== {current_day_id}")
            
            if has_access:
                print(f"[BACKEND API] ✅ Access granted for user {user_id}")
                return {
                    'allowed': True,
                    'classes': access_info,
                    'reason': 'Has active class schedule now'
                }
            else:
                print(f"[BACKEND API] ❌ Access denied for user {user_id}")
                return {
                    'allowed': False,
                    'classes': [],
                    'reason': 'No active class schedule now' if result else 'No scheduled classes today'
                }
                
        except Exception as e:
            print(f"[BACKEND API] Fallback error: {e}")
            import traceback
            traceback.print_exc()
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