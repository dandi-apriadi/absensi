try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    print("⚠️  Requests library not available. Backend API features will use database fallback only.")

import os
from datetime import datetime
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

class BackendAPI:
    def __init__(self):
        # Expected to be the server origin, e.g. https://yourdomain.com (WITHOUT trailing /api)
        raw_base = os.getenv('BACKEND_API_URL', 'http://localhost:5000')
        # Normalize: strip trailing slashes and a trailing '/api' if provided by mistake
        base = (raw_base or '').strip()
        # Remove trailing slash
        while base.endswith('/') and base != 'http://localhost' and base != 'https://localhost':
            base = base[:-1]
        # Remove exactly one trailing '/api' (and optional trailing slash again)
        if base.lower().endswith('/api'):
            base = base[:-4]
            if base.endswith('/'):
                base = base[:-1]
        self.base_url = base
        # Global switch to disable all DB fallbacks and require backend API only (default true)
        self.backend_only = os.getenv('BACKEND_ONLY_API', 'true').lower() in ('1', 'true', 'yes')
        if REQUESTS_AVAILABLE:
            self.session = requests.Session()
        else:
            self.session = None
        # SSL verification (set to 'false' to allow self-signed certs during staging)
        verify_env = os.getenv('BACKEND_API_VERIFY_SSL', 'true').lower()
        self.verify_ssl = verify_env in ('1', 'true', 'yes', 'on')
        if self.session is not None:
            try:
                # requests supports setting default verification on the session
                self.session.verify = self.verify_ssl
            except Exception:
                pass
        # Store logged-in user data after successful login
        self.current_user = None

        # Basic startup diagnostic
        try:
            print(f"[BACKEND API] Base URL: {self.base_url} | verify_ssl={self.verify_ssl} | backend_only={self.backend_only}")
        except Exception:
            pass

    # =========================
    # AUTH & USERS
    # =========================
    def login(self, email: str, password: str):
        """Login to backend and persist session cookies for subsequent calls.
        Returns dict with user data on success or None on failure.
        """
        if not REQUESTS_AVAILABLE or self.session is None:
            print("[BACKEND API] Requests not available; cannot perform HTTP login")
            return None
        try:
            url = f"{self.base_url}/api/auth/login"
            payload = { 'email': email, 'password': password }
            resp = self.session.post(url, json=payload, timeout=10)
            if resp.status_code == 200:
                data = resp.json() or {}
                if data.get('success') and data.get('data') and data['data'].get('user'):
                    self.current_user = data['data']['user']
                    print(f"[BACKEND API] Login success. Role: {self.current_user.get('role')}")
                    return self.current_user
                else:
                    print(f"[BACKEND API] Login unexpected response: {data}")
            else:
                print(f"[BACKEND API] Login failed: {resp.status_code} {resp.text}")
        except Exception as e:
            print(f"[BACKEND API] Login error: {e}")
        return None

    def ping(self, timeout: int = 3):
        """Lightweight connectivity check that does not require authentication.
        Returns a dict: { ok: bool, status: int|None, url: str|None, error: str|None }
        Criteria: any HTTP response with status < 500 counts as reachable.
        """
        if not REQUESTS_AVAILABLE or self.session is None:
            return { 'ok': False, 'status': None, 'url': None, 'error': 'requests_unavailable' }
        # Candidate probes (prefer not to require auth)
        probes = [
            { 'method': 'HEAD', 'url': self.base_url + '/', 'kwargs': { 'allow_redirects': True } },
            { 'method': 'GET',  'url': self.base_url + '/api/health', 'kwargs': {} },
            { 'method': 'GET',  'url': self.base_url + '/api/ping', 'kwargs': {} },
        ]
        # First pass: honor current SSL verification setting
        for p in probes:
            try:
                method = p['method']
                url = p['url']
                kwargs = dict(p.get('kwargs', {}))
                kwargs['timeout'] = timeout
                # Use the configured session so SSL verification preference applies
                resp = self.session.request(method, url, **kwargs)
                status = getattr(resp, 'status_code', 0)
                if status and status < 500:
                    try:
                        print(f"[BACKEND API] ping OK: {status} {url}")
                    except Exception:
                        pass
                    return { 'ok': True, 'status': status, 'url': url, 'error': None }
                else:
                    try:
                        print(f"[BACKEND API] ping HTTP error: {status} {url}")
                    except Exception:
                        pass
            except Exception as e:
                try:
                    print(f"[BACKEND API] ping request error for {p['url']}: {e}")
                except Exception:
                    pass
        # Second pass: if verification might be the issue, retry with verify=False as a diagnostic only
        try_insecure = True
        if try_insecure:
            for p in probes:
                try:
                    method = p['method']
                    url = p['url']
                    kwargs = dict(p.get('kwargs', {}))
                    kwargs['timeout'] = timeout
                    kwargs['verify'] = False
                    resp = self.session.request(method, url, **kwargs)
                    status = getattr(resp, 'status_code', 0)
                    if status and status < 500:
                        try:
                            print(f"[BACKEND API] ping OK with verify=False: {status} {url}")
                            print("[BACKEND API] Hint: SSL verification appears to fail. Consider setting BACKEND_API_VERIFY_SSL=false if using self-signed certs.")
                        except Exception:
                            pass
                        return { 'ok': True, 'status': status, 'url': url, 'error': 'verify_false_needed' }
                except Exception as e:
                    try:
                        print(f"[BACKEND API] insecure ping error for {p['url']}: {e}")
                    except Exception:
                        pass
        return { 'ok': False, 'status': None, 'url': None, 'error': 'all_probes_failed' }

    def get_users(self, status: Optional[str] = None, limit: int = 1000, page: int = 1):
        """Fetch users list from backend admin endpoint.
        Returns list of dicts with keys: user_id, fullname, role, email, status (if available)
        """
        if not REQUESTS_AVAILABLE or self.session is None:
            print("[BACKEND API] Requests not available; cannot fetch users via HTTP")
            return None
        try:
            # Use administrator API which supports pagination and filters
            params = { 'limit': limit, 'page': page }
            # NOTE: Current backend does not have a 'status' column in Users model.
            # Avoid sending this filter unless backend adds support.
            if status:
                params['status'] = status
            url = f"{self.base_url}/api/admin/users"
            resp = self.session.get(url, params=params, timeout=10)
            if resp.status_code == 200:
                body = resp.json() or {}
                data = body.get('data') or {}
                users = data.get('users') or data.get('rows') or body.get('users') or []
                # Normalize fields to expected names
                normalized = []
                for u in users:
                    normalized.append({
                        'user_id': u.get('user_id') or u.get('id'),
                        'fullname': u.get('full_name') or u.get('fullname') or u.get('name'),
                        'role': u.get('role'),
                        'email': u.get('email'),
                        'status': u.get('status')
                    })
                print(f"[BACKEND API] Loaded {len(normalized)} users from backend")
                return normalized
            else:
                print(f"[BACKEND API] Get users failed: {resp.status_code} {resp.text}")
        except Exception as e:
            print(f"[BACKEND API] Get users error: {e}")
        return None
        
    def check_user_room_access(self, user_id, date=None):
        """
        Check if user is allowed to access room on specific date
        Returns: dict with access info or None if no access
        """
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        print(f"[BACKEND API] check_user_room_access called for user_id={user_id}, date={date}")
        
        # Prefer backend endpoint when available
        if REQUESTS_AVAILABLE and self.session is not None:
            try:
                url = f"{self.base_url}/api/attendance/check-access"
                payload = { 'user_id': user_id, 'date': date }
                print(f"[BACKEND API] Calling {url} with payload: {payload}")
                
                resp = self.session.post(url, json=payload, timeout=10)
                print(f"[BACKEND API] Response status: {resp.status_code}")
                
                if resp.status_code == 200:
                    body = resp.json() or {}
                    print(f"[BACKEND API] Response body: {body}")
                    
                    data = body.get('data') or {}
                    # Ensure shape similar to fallback for callers
                    allowed = bool((data or {}).get('allowed'))
                    classes = (data or {}).get('classes') or []
                    sessions = [{
                        'session_id': None,
                        'class_id': c.get('class_id'),
                        'start_time': c.get('start_time'),
                        'end_time': c.get('end_time')
                    } for c in classes]
                    
                    result = {
                        'allowed': allowed,
                        'classes': classes,
                        'sessions': sessions,
                        'reason': (data or {}).get('reason')
                    }
                    print(f"[BACKEND API] Returning: {result}")
                    return result
                else:
                    print(f"[BACKEND API] check-access HTTP error: {resp.status_code} {resp.text}")
            except Exception as e:
                print(f"[BACKEND API] check-access request error: {e}")
                import traceback
                traceback.print_exc()

        # Fallback to direct DB if backend unavailable
        if self.backend_only:
            print(f"[BACKEND API] Backend-only mode active; skipping DB fallback for check access of user {user_id}")
            print(f"[BACKEND API] HINT: Check if backend server is running and endpoint /api/attendance/check-access is working")
            return None
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
            # Using schema: student_enrollments.class_id
            query1 = """
            SELECT 
                cc.id as class_id,
                cc.class_name,
                cc.schedule,
                c.course_name,
                c.course_code,
                se.status as enrollment_status
            FROM course_classes cc
            JOIN courses c ON cc.course_id = c.id
            JOIN student_enrollments se ON cc.id = se.class_id
            WHERE se.student_id = %s 
              AND cc.status IN ('active','ongoing')
              AND se.status IN ('enrolled','active')
            """

            result = simple_db.execute_query(query1, (user_id,))
            
            if not result:
                print(f"[BACKEND API] No enrolled/active classes found for user {user_id}")
                # Optional: allow lecturers if they have a scheduled class now
                try:
                    lecturer_query = """
                    SELECT 
                        cc.id as class_id,
                        cc.class_name,
                        cc.schedule,
                        c.course_name,
                        c.course_code
                    FROM course_classes cc
                    JOIN courses c ON cc.course_id = c.id
                    WHERE cc.lecturer_id = %s AND cc.status IN ('active','ongoing')
                    """
                    lec = simple_db.execute_query(lecturer_query, (user_id,))
                    if not lec:
                        return {
                            'allowed': False,
                            'classes': [],
                            'reason': 'No enrolled classes found'
                        }
                    else:
                        result = lec
                        print(f"[BACKEND API] Lecturer mode: found {len(result)} classes for lecturer {user_id}")
                except Exception as e:
                    return {
                        'allowed': False,
                        'classes': [],
                        'reason': 'No enrolled classes found'
                    }
            
            print(f"[BACKEND API] Found {len(result)} enrolled/active classes")
            
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
                    # Normalize possible keys and cases: 'day', 'day_of_week', localized strings
                    slot_day = slot.get('day') or slot.get('day_of_week') or ''
                    slot_day_norm = str(slot_day).strip().lower()
                    # Accept English or Indonesian names (lowercased)
                    day_variants = {
                        'monday': ['monday', 'senin'],
                        'tuesday': ['tuesday', 'selasa'],
                        'wednesday': ['wednesday', 'rabu'],
                        'thursday': ['thursday', 'kamis'],
                        'friday': ['friday', 'jumat', 'jum\u2019at', "jum'at"],
                        'saturday': ['saturday', 'sabtu'],
                        'sunday': ['sunday', 'minggu']
                    }
                    # Build today's acceptable tokens
                    today_tokens = []
                    en_token = current_day_en.lower()
                    id_token = current_day_id.lower()
                    today_tokens.extend(day_variants.get(en_token, [en_token]))
                    if id_token not in today_tokens:
                        today_tokens.append(id_token)
                    day_match = slot_day_norm in today_tokens
                    
                    if day_match:
                        start_time = str(slot.get('start_time', '')).strip()
                        end_time = str(slot.get('end_time', '')).strip()
                        
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
                # Provide sessions array for compatibility with callers expecting it
                sessions = [{
                    'session_id': None,
                    'class_id': item['class_id'],
                    'start_time': item['start_time'],
                    'end_time': item['end_time']
                } for item in access_info]
                return {
                    'allowed': True,
                    'classes': access_info,
                    'sessions': sessions,
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
        # Prefer backend endpoint first
        if REQUESTS_AVAILABLE and self.session is not None:
            try:
                url = f"{self.base_url}/api/attendance/record/smart"
                payload = {
                    'user_id': user_id,
                    'class_id': class_id,
                    'confidence_score': confidence_score
                }
                resp = self.session.post(url, json=payload, timeout=10)
                if resp.status_code == 200 or resp.status_code == 201:
                    body = resp.json() or {}
                    success = bool(body.get('success'))
                    data = body.get('data') or {}
                    msg = body.get('message') or (data.get('message') if isinstance(data, dict) else None)
                    return {
                        'success': success,
                        'message': msg or ('Absensi berhasil dicatat' if success else 'Gagal mencatat absensi'),
                        'session_id': data.get('session_id') if isinstance(data, dict) else None,
                        'check_in_time': data.get('check_in_time') if isinstance(data, dict) else None,
                        'confidence_score': confidence_score
                    }
                else:
                    print(f"[BACKEND API] record/smart HTTP error: {resp.status_code} {resp.text}")
            except Exception as e:
                print(f"[BACKEND API] record/smart request error: {e}")

        # Fallback to direct DB flow
        if self.backend_only:
            print("[BACKEND API] Backend-only mode active; skipping DB fallback for record_attendance")
            return {
                'success': False,
                'message': 'Tidak dapat mencatat absensi (mode backend-only, backend tidak tersedia).',
                'reason': 'backend_only_no_fallback'
            }
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
        # If requests is not available, use fallback or skip if backend-only
        if not REQUESTS_AVAILABLE or self.session is None:
            if self.backend_only:
                print("[BACKEND API] Backend-only mode active; skipping DB fallback for door access log")
                return False
            return self._log_access_fallback(user_id, access_type, access_status, 
                                           confidence_score, reason, session_id)
            
        try:
            # Use system route to log door access on backend
            url = f"{self.base_url}/api/system/door-access/log"
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
                # If backend returns non-200 (e.g., 404), fall back to DB logging unless backend-only
                print(f"[BACKEND API] Error logging access: {response.status_code}")
                if self.backend_only:
                    print("[BACKEND API] Backend-only mode active; skipping DB fallback for door access log")
                    return False
                print("[BACKEND API] Falling back to DB log")
                return self._log_access_fallback(user_id, access_type, access_status, 
                                               confidence_score, reason, session_id)
                
        except Exception as e:
            print(f"[BACKEND API] Request error logging access: {e}")
            # Fallback to database logging unless backend-only
            if self.backend_only:
                print("[BACKEND API] Backend-only mode active; skipping DB fallback for door access log")
                return False
            return self._log_access_fallback(user_id, access_type, access_status, 
                                           confidence_score, reason, session_id)

    def get_today_attendances(self, date_str: Optional[str] = None):
        """Fetch today's attendance records via backend for display in UI."""
        if not REQUESTS_AVAILABLE or self.session is None:
            print("[BACKEND API] Requests not available; cannot fetch attendances via HTTP")
            return None
        try:
            if not date_str:
                date_str = datetime.now().strftime('%Y-%m-%d')
            url = f"{self.base_url}/api/attendance/today"
            resp = self.session.get(url, params={'date': date_str}, timeout=10)
            if resp.status_code == 200:
                body = resp.json() or {}
                return body.get('data') or []
            else:
                print(f"[BACKEND API] get today attendances error: {resp.status_code} {resp.text}")
        except Exception as e:
            print(f"[BACKEND API] get today attendances exception: {e}")
        return None
    
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