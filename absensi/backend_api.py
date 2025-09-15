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

    def record_attendance(self, user_id, class_id, confidence_score=None):
        """
        Record attendance for a user in a specific class
        Prevents duplicate attendance for same class on same day
        """
        try:
            from simple_database import simple_db
            from datetime import datetime
            
            current_date = datetime.now().strftime('%Y-%m-%d')
            current_time = datetime.now()
            
            print(f"[BACKEND API] Recording attendance for {user_id} in class {class_id}")
            
            # Check if already attended today for this class
            check_query = """
            SELECT sa.id, sa.check_in_time, cc.class_name, c.course_name
            FROM student_attendances sa
            JOIN attendance_sessions ats ON sa.session_id = ats.id  
            JOIN course_classes cc ON ats.class_id = cc.id
            JOIN courses c ON cc.course_id = c.id
            WHERE sa.student_id = %s 
            AND ats.class_id = %s
            AND DATE(sa.check_in_time) = %s
            """
            
            existing = simple_db.execute_query(check_query, (user_id, class_id, current_date))
            
            if existing and len(existing) > 0:
                existing_record = existing[0]
                print(f"[BACKEND API] ❌ Already attended today! Previous check-in: {existing_record['check_in_time']}")
                return {
                    'success': False,
                    'message': f"Sudah absen hari ini untuk {existing_record['course_name']} - {existing_record['class_name']}",
                    'previous_checkin': existing_record['check_in_time'],
                    'reason': 'duplicate_attendance'
                }
            
            # Get or create attendance session for today
            session_id = self._get_or_create_session(class_id, current_date)
            
            if not session_id:
                print("[BACKEND API] ❌ Failed to get/create attendance session")
                return {
                    'success': False,
                    'message': 'Gagal membuat sesi absensi',
                    'reason': 'session_creation_failed'
                }
            
            # Record attendance
            attendance_query = """
            INSERT INTO student_attendances 
            (session_id, student_id, status, check_in_time, attendance_method, confidence_score, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            attendance_params = (
                session_id,
                user_id,
                'present',
                current_time,
                'face_recognition',
                confidence_score,
                current_time,
                current_time
            )
            
            result = simple_db.execute_query(attendance_query, attendance_params)
            
            if result:
                # Log face recognition
                self._log_face_recognition(session_id, user_id, confidence_score)
                
                print(f"[BACKEND API] ✅ Attendance recorded successfully for {user_id}")
                return {
                    'success': True,
                    'message': 'Absensi berhasil dicatat',
                    'session_id': session_id,
                    'check_in_time': current_time.isoformat(),
                    'confidence_score': confidence_score
                }
            else:
                print("[BACKEND API] ❌ Failed to insert attendance record")
                return {
                    'success': False,
                    'message': 'Gagal mencatat absensi',
                    'reason': 'database_insert_failed'
                }
                
        except Exception as e:
            print(f"[BACKEND API] Record attendance error: {e}")
            import traceback
            traceback.print_exc()
            return {
                'success': False,
                'message': 'Error sistem saat mencatat absensi',
                'reason': 'system_error'
            }

    def _get_or_create_session(self, class_id, session_date):
        """
        Get existing or create new attendance session for class on specific date
        """
        try:
            from simple_database import simple_db
            from datetime import datetime
            
            # Check if session already exists
            check_query = """
            SELECT id FROM attendance_sessions 
            WHERE class_id = %s AND session_date = %s
            ORDER BY created_at DESC
            LIMIT 1
            """
            
            existing = simple_db.execute_query(check_query, (class_id, session_date))
            
            if existing and len(existing) > 0:
                session_id = existing[0]['id']
                print(f"[BACKEND API] Using existing session {session_id}")
                return session_id
            
            # Create new session
            current_time = datetime.now()
            
            # Get class schedule for session times
            class_query = """
            SELECT schedule, class_name FROM course_classes WHERE id = %s
            """
            
            class_info = simple_db.execute_query(class_query, (class_id,))
            
            if not class_info:
                print(f"[BACKEND API] Class {class_id} not found")
                return None
                
            # Parse schedule to get times
            schedule_json = class_info[0].get('schedule', '[]')
            start_time = '08:00:00'
            end_time = '17:00:00'
            
            try:
                import json
                schedule = json.loads(schedule_json) if isinstance(schedule_json, str) else schedule_json
                if isinstance(schedule, str):
                    schedule = json.loads(schedule)
                    
                if schedule and len(schedule) > 0:
                    first_slot = schedule[0]
                    if isinstance(first_slot, dict):
                        start_time = first_slot.get('start_time', '08:00') + ':00'
                        end_time = first_slot.get('end_time', '17:00') + ':00'
            except:
                pass
            
            # Insert new session
            session_query = """
            INSERT INTO attendance_sessions 
            (class_id, session_number, session_date, start_time, end_time, topic, 
             session_type, attendance_method, status, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            # Get next session number
            count_query = """
            SELECT COUNT(*) as count FROM attendance_sessions WHERE class_id = %s
            """
            count_result = simple_db.execute_query(count_query, (class_id,))
            session_number = (count_result[0]['count'] if count_result else 0) + 1
            
            session_params = (
                class_id,
                session_number,
                session_date,
                start_time,
                end_time,
                f"Pertemuan {session_number} - Face Recognition",
                'regular',
                'face_recognition',
                'ongoing',
                current_time,
                current_time
            )
            
            result = simple_db.execute_query(session_query, session_params)
            
            if result:
                # Get the inserted session ID
                get_id_query = """
                SELECT id FROM attendance_sessions 
                WHERE class_id = %s AND session_date = %s 
                ORDER BY created_at DESC LIMIT 1
                """
                
                session_result = simple_db.execute_query(get_id_query, (class_id, session_date))
                
                if session_result:
                    session_id = session_result[0]['id']
                    print(f"[BACKEND API] Created new session {session_id}")
                    return session_id
                    
            print("[BACKEND API] Failed to create session")
            return None
            
        except Exception as e:
            print(f"[BACKEND API] Get/create session error: {e}")
            return None

    def _log_face_recognition(self, session_id, user_id, confidence_score):
        """
        Log face recognition attempt
        """
        try:
            from simple_database import simple_db
            from datetime import datetime
            
            log_query = """
            INSERT INTO face_recognition_logs 
            (session_id, recognized_user_id, confidence_score, recognition_status, 
             processing_time, camera_id, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            
            log_params = (
                session_id,
                user_id,
                confidence_score or 0.95,
                'success',
                100,  # dummy processing time
                'camera_1',
                datetime.now()
            )
            
            simple_db.execute_query(log_query, log_params)
            print(f"[BACKEND API] Face recognition logged for user {user_id}")
            
        except Exception as e:
            print(f"[BACKEND API] Log face recognition error: {e}")
    
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