import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import glob
import customtkinter as ctk
from PIL import Image, ImageTk
import cv2
import threading
import time
import os
from datetime import datetime
from typing import Optional
from simple_database import simple_db
from simple_face_recognition import SimpleFaceRecognition
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from backend_api import backend_api
from relay_control import activate_door, success_beep, denied_beep, cleanup_gpio

# Ensure CustomTkinter appearance is set before any windows are created
try:
    ctk.set_appearance_mode("light")
    ctk.set_default_color_theme("blue")
except Exception:
    pass

class LoginWindow:
    def __init__(self, root, on_success_callback):
        """
        Login window presented as a Toplevel, mounted on a shared CTk root.
        Avoids creating multiple Tk roots which can cause 'invalid command name' errors
        from pending after-callbacks when a root is destroyed.
        """
        self.root = root
        self.on_success = on_success_callback

        # Create a Toplevel for login so we can keep a single root alive
        self.window = ctk.CTkToplevel(self.root)
        self.window.title("Sistem Absensi Face Recognition - Login")
        self.window.geometry("400x500")
        self.window.resizable(False, False)

        # Appearance already set globally; keep idempotent calls safe
        try:
            ctk.set_appearance_mode("light")
            ctk.set_default_color_theme("blue")
        except Exception:
            pass

        # Ensure the login window is modal-ish
        try:
            self.window.transient(self.root)
            self.window.grab_set()
            # Ensure window is visible and focused on top
            self.window.deiconify()
            self.window.lift()
            self.window.focus_force()
            # Make topmost briefly to bring to front, then drop
            self.window.attributes('-topmost', True)
            self.window.after(200, lambda: self.window.attributes('-topmost', False))
        except Exception:
            pass

        self.setup_ui()
        
    def setup_ui(self):
        # Main frame
        main_frame = ctk.CTkFrame(self.window)
        main_frame.pack(expand=True, fill="both", padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            main_frame, 
            text="SISTEM ABSENSI", 
            font=ctk.CTkFont(size=24, weight="bold")
        )
        title_label.pack(pady=(30, 10))
        
        subtitle_label = ctk.CTkLabel(
            main_frame, 
            text="Face Recognition System", 
            font=ctk.CTkFont(size=16)
        )
        subtitle_label.pack(pady=(0, 30))
        
        # Login form
        form_frame = ctk.CTkFrame(main_frame)
        form_frame.pack(fill="x", padx=20, pady=20)
        
        # Email
        email_label = ctk.CTkLabel(form_frame, text="Email:")
        email_label.pack(anchor="w", padx=20, pady=(20, 5))
        
        self.email_entry = ctk.CTkEntry(
            form_frame, 
            placeholder_text="Masukkan email",
            width=300
        )
        self.email_entry.pack(padx=20, pady=(0, 10))
        
        # Password
        password_label = ctk.CTkLabel(form_frame, text="Password:")
        password_label.pack(anchor="w", padx=20, pady=(10, 5))
        
        self.password_entry = ctk.CTkEntry(
            form_frame, 
            placeholder_text="Masukkan password",
            show="*",
            width=300
        )
        self.password_entry.pack(padx=20, pady=(0, 20))
        
        # Login button
        login_button = ctk.CTkButton(
            form_frame,
            text="LOGIN",
            command=self.login,
            width=300,
            height=40,
            font=ctk.CTkFont(size=14, weight="bold")
        )
        login_button.pack(padx=20, pady=(10, 30))
        
        # Bind Enter key
        self.window.bind('<Return>', lambda event: self.login())
        
    def login(self):
        email = self.email_entry.get().strip()
        password = self.password_entry.get().strip()
        
        print(f"[LOGIN DEBUG] Attempting login with email: '{email}'")
        print(f"[LOGIN DEBUG] Password length: {len(password)} characters")
        
        if not email or not password:
            print("[LOGIN DEBUG] Empty email or password")
            messagebox.showerror("Error", "Mohon isi email dan password")
            return
            
        print("[LOGIN DEBUG] Calling backend login...")
        # Prefer backend HTTP login; optional DB fallback controlled by env (default true)
        backend_only_auth = os.getenv('BACKEND_ONLY_AUTH', 'true').lower() in ('1','true','yes')
        logged_in = False
        user_payload = None
        try:
            user_payload = backend_api.login(email, password)
            if user_payload:
                # Normalize to current_user shape
                self.current_user = {
                    'user_id': user_payload.get('user_id'),
                    'fullname': user_payload.get('fullname') or user_payload.get('full_name'),
                    'role': user_payload.get('role'),
                    'status': 'active'
                }
                logged_in = True
        except Exception as e:
            print(f"[LOGIN DEBUG] Backend login error: {e}")

        if not logged_in and not backend_only_auth:
            print("[LOGIN DEBUG] Falling back to local DB login verification (BACKEND_ONLY_AUTH is false)...")
            logged_in = self.verify_login(email, password)
        elif not logged_in and backend_only_auth:
            print("[LOGIN DEBUG] Skipping DB fallback (BACKEND_ONLY_AUTH is true)")

        # Open main app on success
        if logged_in:
            print("[LOGIN DEBUG] Login successful, opening main app...")
            try:
                # Invoke callback to mount the main app on the existing root
                if callable(self.on_success):
                    self.on_success(self.current_user)
            finally:
                # Destroy only the Toplevel, keep the root alive
                try:
                    self.window.grab_release()
                except Exception:
                    pass
                self.window.destroy()
        else:
            print("[LOGIN DEBUG] Login failed")
            messagebox.showerror("Error", "Email atau password salah")
            
    def verify_login(self, email, password):
        print(f"[LOGIN DEBUG] Starting verify_login for email: {email}")
        
        # Initialize password hasher
        ph = PasswordHasher()
        
        try:
            print("[LOGIN DEBUG] Executing login query...")
            
            # Query to verify user credentials - allow students to login as well
            # so they can capture and train their own face datasets.
            # Note: We keep status filter to ensure only active users can log in.
            query = """
            SELECT user_id, fullname, role, password, status 
            FROM users 
            WHERE email = %s AND status = 'active' AND role IN ('super-admin', 'lecturer', 'student')
            """
            
            print(f"[LOGIN DEBUG] Executing query with email: {email}")
            result = simple_db.execute_query(query, (email,))
            print(f"[LOGIN DEBUG] Query result: {result}")
            
            if result and len(result) > 0:
                user = result[0]
                print(f"[LOGIN DEBUG] User found: {user['fullname']} (ID: {user['user_id']}, Role: {user['role']})")
                print(f"[LOGIN DEBUG] Stored password hash: {user['password'][:50]}...")
                print(f"[LOGIN DEBUG] Input password: '{password}'")
                
                # Allow super-admin, lecturer, and student to log in.
                # Admin/Lecturer will see the admin dataset UI; students get the self-service UI.
                if user['role'] not in ['super-admin', 'lecturer', 'student']:
                    print("[LOGIN DEBUG] ❌ Access denied - User role not permitted to use this app")
                    return False
                
                try:
                    # Verify password using Argon2
                    ph.verify(user['password'], password)
                    print("[LOGIN DEBUG] ✅ Password verification successful!")
                    
                    # Store user session
                    self.current_user = {
                        'user_id': user['user_id'],
                        'fullname': user['fullname'],  # Note: using 'fullname' from backend model
                        'role': user['role'],
                        'status': user['status']
                    }
                    return True
                    
                except VerifyMismatchError:
                    print("[LOGIN DEBUG] ❌ Password verification failed - mismatch")
                    return False
                except Exception as verify_error:
                    print(f"[LOGIN DEBUG] ❌ Password verification error: {verify_error}")
                    return False
            else:
                print("[LOGIN DEBUG] ❌ No authorized user found with that email or user is not active/admin")
                    
            return False
            
        except Exception as e:
            print(f"[LOGIN DEBUG] ❌ Exception occurred: {type(e).__name__}: {e}")
            print(f"[LOGIN DEBUG] Full error details: {str(e)}")
            return False
            
    def run(self):
        self.window.mainloop()

class FaceAttendanceApp:
    def __init__(self, current_user, root: Optional[ctk.CTk] = None):
        # Use provided root if available to keep a single Tk root
        self.window = root if root is not None else ctk.CTk()
        self.window.title("Sistem Absensi Face Recognition")
        self.window.geometry("1200x800")
        
        # Store current user info
        self.current_user = current_user
        self.current_employee_id = None
        self.current_employee_name = None
        
        # Initialize face recognition system
        self.face_system = SimpleFaceRecognition()
        
        # Camera variables
        self.camera = None
        self.camera_running = False
        self.current_frame = None
        
        # Get employee info for current user
        self.get_current_employee_info()
        # Track last recognition trigger time per user to avoid spamming
        self._last_recognition_trigger = {}
        self._recognition_cooldown_sec = 3.0
        # Periodic backend health check when camera is running
        self._next_backend_ping_at = 0.0
        
        # SECURITY: Log that door is locked at startup
        from relay_control import get_door_status
        door_status = get_door_status()
        print(f"[SECURITY] Door status at startup: {door_status}")
        
        # Build UI after initializing state
        self.setup_ui()
        
        # Setup cleanup on window close to ensure door is locked
        self.window.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def on_closing(self):
        """Handle window close event - ENSURE DOOR IS LOCKED"""
        print("[SECURITY] Application closing - ensuring door is locked")
        try:
            if hasattr(self, 'camera_running') and self.camera_running:
                self.stop_camera()
            # CRITICAL: Cleanup GPIO and ensure door is locked
            from relay_control import ensure_door_locked
            ensure_door_locked()
            cleanup_gpio()
            print("[SECURITY] Door locked, GPIO cleaned up")
        except Exception as e:
            print(f"Error during cleanup: {e}")
        finally:
            try:
                self.window.destroy()
            except Exception:
                pass

    def _get_dataset_info(self, user_id, include_model: bool = True):
        """Return tuple (exists: bool, count: int) reflecting dataset readiness.
        - When include_model=True: exists is True if images exist OR a trained model file exists.
        - When include_model=False: exists reflects only the presence of dataset images.
        count is the number of local dataset images found (jpg/jpeg/png).
        """
        try:
            ds_base = getattr(self.face_system, 'dataset_path', 'datasets')
            models_base = getattr(self.face_system, 'models_path', 'models')
            dataset_dir = os.path.join(ds_base, f"employee_{user_id}")

            # Try to resolve dataset dir via face_system helper to avoid CWD issues
            resolved_dataset_dir = dataset_dir
            try:
                if hasattr(self.face_system, '_resolve_path'):
                    resolved_dataset_dir = self.face_system._resolve_path(dataset_dir)
            except Exception:
                pass

            # Count image files (jpg/jpeg/png) in dataset folder recursively (case-insensitive)
            count = 0
            if os.path.exists(resolved_dataset_dir):
                try:
                    for root, dirs, files in os.walk(resolved_dataset_dir):
                        for f in files:
                            ext = os.path.splitext(f)[1].lower()
                            if ext in (".jpg", ".jpeg", ".png"):
                                count += 1
                except Exception:
                    # Fallback to non-recursive glob if os.walk fails
                    for ext in ("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG"):
                        count += len(glob.glob(os.path.join(resolved_dataset_dir, ext)))

            # Consider trained model existence as readiness, even if dataset images were cleaned up
            model_rel = os.path.join(models_base, f"employee_{user_id}_model.yml")
            model_file = model_rel
            try:
                if hasattr(self.face_system, '_resolve_path'):
                    model_file = self.face_system._resolve_path(model_rel)
            except Exception:
                pass
            has_model = os.path.exists(model_file)

            # Exist only by images if include_model is False; otherwise include model presence
            exists = (count > 0) or (include_model and has_model)
            return exists, count
        except Exception:
            return False, 0

    def _has_model_file(self, user_id) -> bool:
        """Check if a trained model file exists locally for the user."""
        try:
            models_base = getattr(self.face_system, 'models_path', 'models')
            model_rel = os.path.join(models_base, f"employee_{user_id}_model.yml")
            model_file = model_rel
            try:
                if hasattr(self.face_system, '_resolve_path'):
                    model_file = self.face_system._resolve_path(model_rel)
            except Exception:
                pass
            return os.path.exists(model_file)
        except Exception:
            return False

    def _format_dataset_indicator(self, exists, count):
        """Create a clear indicator string and color: 'Ada dataset' or 'Tidak ada dataset'.
        A dataset is considered present if images exist or a trained model exists.
        """
        if exists:
            return "Ada dataset", "#2e7d32"  # green
        return "Tidak ada dataset", "#d9534f"  # red
    
    def is_backend_available(self, timeout: int = 3) -> bool:
        """Lightweight check to ensure backend API is reachable.
        In backend-only mode, camera/attendance must not run when backend is down.
        """
        try:
            # Require a configured backend client
            if not getattr(backend_api, 'session', None) or not getattr(backend_api, 'base_url', None):
                print("[APP] Backend client/session not initialized")
                return False
            # Use backend_api.ping for robust detection (accepts 2xx/3xx/4xx)
            ping = None
            try:
                ping = backend_api.ping(timeout=timeout)
            except Exception as e:
                print(f"[APP] backend_api.ping error: {e}")
            if ping and ping.get('ok'):
                return True
            # Last resort: try a simple GET to / (accepting 4xx too)
            try:
                resp = backend_api.session.get(backend_api.base_url + '/', timeout=timeout, allow_redirects=True)
                if resp is not None and getattr(resp, 'status_code', 503) < 500:
                    return True
            except Exception as e:
                print(f"[APP] Backend root GET failed: {e}")
            print("[APP] Backend not reachable")
            return False
        except Exception as e:
            print(f"[APP] is_backend_available unexpected error: {e}")
            return False
        
    def get_current_employee_info(self):
        """Get employee info for the currently logged in user"""
        try:
            # Since we don't have employees table, use user_id directly as employee_id
            self.current_employee_id = self.current_user['user_id']
            self.current_employee_name = self.current_user['fullname']
            print(f"[USER INFO] User ID: {self.current_employee_id}, Name: {self.current_employee_name}")
                
        except Exception as e:
            print(f"[USER INFO] Error getting user info: {e}")
            self.current_employee_id = None
            self.current_employee_name = self.current_user['fullname'] if self.current_user else "Unknown"
        
    def setup_ui(self):
        # Create main notebook for tabs
        self.notebook = ttk.Notebook(self.window)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Create tabs
        self.create_attendance_tab()
        self.create_dataset_tab()
        # Management tab removed per request
        # User list tab (admins/lecturers)
        try:
            if self.current_user.get('role') in ['super-admin', 'lecturer']:
                self.create_users_list_tab()
        except Exception:
            pass
        
    def create_attendance_tab(self):
        # Attendance tab
        attendance_frame = ctk.CTkFrame(self.notebook)
        self.notebook.add(attendance_frame, text="Absensi")
        
        # Left panel for camera
        left_panel = ctk.CTkFrame(attendance_frame)
        left_panel.pack(side="left", fill="both", expand=True, padx=(10, 5), pady=10)
        
        # Camera frame
        camera_label = ctk.CTkLabel(left_panel, text="Kamera Face Recognition", font=ctk.CTkFont(size=16, weight="bold"))
        camera_label.pack(pady=(10, 5))
        
        self.camera_frame = ctk.CTkLabel(left_panel, text="Kamera tidak aktif")
        self.camera_frame.pack(padx=10, pady=10, expand=True, fill="both")
        
        # Camera controls
        controls_frame = ctk.CTkFrame(left_panel)
        controls_frame.pack(fill="x", padx=10, pady=(0, 10))
        
        self.start_camera_btn = ctk.CTkButton(
            controls_frame,
            text="Mulai Kamera",
            command=self.start_camera,
            width=150
        )
        self.start_camera_btn.pack(side="left", padx=5, pady=10)
        
        self.stop_camera_btn = ctk.CTkButton(
            controls_frame,
            text="Stop Kamera",
            command=self.stop_camera,
            width=150,
            state="disabled"
        )
        self.stop_camera_btn.pack(side="left", padx=5, pady=10)
        
        # Right panel for information
        right_panel = ctk.CTkFrame(attendance_frame)
        right_panel.pack(side="right", fill="y", padx=(5, 10), pady=10)
        
        # Recognition info
        info_label = ctk.CTkLabel(right_panel, text="Informasi Recognition", font=ctk.CTkFont(size=16, weight="bold"))
        info_label.pack(pady=(10, 5))
        
        self.recognition_info = ctk.CTkTextbox(right_panel, width=300, height=200)
        self.recognition_info.pack(padx=10, pady=10)
        
        # Today's attendance
        attendance_label = ctk.CTkLabel(right_panel, text="Absensi Hari Ini", font=ctk.CTkFont(size=16, weight="bold"))
        attendance_label.pack(pady=(20, 5))
        
        # Attendance list frame
        list_frame = ctk.CTkFrame(right_panel)
        list_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Attendance treeview
        self.attendance_tree = ttk.Treeview(list_frame, columns=("Name", "Time", "Status"), show="headings", height=15)
        self.attendance_tree.heading("Name", text="Nama")
        self.attendance_tree.heading("Time", text="Waktu")
        self.attendance_tree.heading("Status", text="Status")
        
        self.attendance_tree.column("Name", width=150)
        self.attendance_tree.column("Time", width=100)
        self.attendance_tree.column("Status", width=80)
        
        # Scrollbar for treeview
        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.attendance_tree.yview)
        self.attendance_tree.configure(yscroll=scrollbar.set)
        
        self.attendance_tree.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Refresh button
        refresh_btn = ctk.CTkButton(
            right_panel,
            text="Refresh Data",
            command=self.refresh_attendance_data,
            width=200
        )
        refresh_btn.pack(pady=10)
        
        # Door status indicator (SECURITY FEATURE)
        door_status_frame = ctk.CTkFrame(right_panel)
        door_status_frame.pack(fill="x", padx=10, pady=(10, 5))
        
        door_label = ctk.CTkLabel(
            door_status_frame, 
            text="Status Pintu:", 
            font=ctk.CTkFont(size=14, weight="bold")
        )
        door_label.pack(side="left", padx=10, pady=5)
        
        self.door_status_label = ctk.CTkLabel(
            door_status_frame,
            text="🔒 TERKUNCI",
            font=ctk.CTkFont(size=14, weight="bold"),
            text_color="#2e7d32"  # Green color
        )
        self.door_status_label.pack(side="left", padx=5, pady=5)
        
        # Update door status periodically
        self.update_door_status()
        
    def create_dataset_tab(self):
        # Dataset management tab
        dataset_frame = ctk.CTkFrame(self.notebook)
        self.notebook.add(dataset_frame, text="Kelola Dataset")
        
        # Check if user is admin
        is_admin = self.current_user.get('role') in ['super-admin', 'lecturer']
        
        if is_admin:
            # Admin interface - can manage datasets for all users
            self.create_admin_dataset_interface(dataset_frame)
        else:
            # Regular user interface - can only manage own dataset
            self.create_user_dataset_interface(dataset_frame)
    
    def create_admin_dataset_interface(self, parent_frame):
        """Admin interface for managing face datasets of all users"""
        # User selection section
        user_select_frame = ctk.CTkFrame(parent_frame)
        user_select_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(user_select_frame, text="Pilih User untuk Kelola Dataset:", 
                    font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w", padx=10, pady=(10, 5))
        
        # User selection
        user_frame = ctk.CTkFrame(user_select_frame)
        user_frame.pack(fill="x", padx=10, pady=10)
        
        # Dropdown for users
        self.selected_user_var = tk.StringVar()
        self.user_dropdown = ctk.CTkComboBox(
            user_frame,
            values=["Select User..."],
            variable=self.selected_user_var,
            command=self.on_user_selected,
            width=300
        )
        self.user_dropdown.pack(side="left", padx=10, pady=10)
        
        # Refresh users button
        refresh_users_btn = ctk.CTkButton(
            user_frame,
            text="Refresh Users",
            command=self.load_users_list,
            width=150
        )
        refresh_users_btn.pack(side="left", padx=10, pady=10)
        
        # Selected user info
        self.selected_user_info = ctk.CTkLabel(
            user_select_frame,
            text="Pilih user dari dropdown di atas",
            font=ctk.CTkFont(size=12)
        )
        self.selected_user_info.pack(anchor="w", padx=10, pady=(0, 10))
        
        # Dataset management buttons
        buttons_frame = ctk.CTkFrame(parent_frame)
        buttons_frame.pack(fill="x", padx=10, pady=10)
        
        self.admin_capture_btn = ctk.CTkButton(
            buttons_frame,
            text="Ambil Dataset Wajah",
            command=self.admin_capture_dataset,
            width=200,
            height=40,
            state="disabled"
        )
        self.admin_capture_btn.pack(side="left", padx=10, pady=10)
        
        self.admin_train_btn = ctk.CTkButton(
            buttons_frame,
            text="Train Model",
            command=self.admin_train_model,
            width=150,
            height=40,
            state="disabled"
        )
        self.admin_train_btn.pack(side="left", padx=10, pady=10)
        
        self.admin_delete_btn = ctk.CTkButton(
            buttons_frame,
            text="Hapus Model",
            command=self.admin_delete_model,
            width=150,
            height=40,
            fg_color="red",
            state="disabled"
        )
        self.admin_delete_btn.pack(side="left", padx=10, pady=10)
        
        # Cleanup dataset button
        self.admin_cleanup_btn = ctk.CTkButton(
            buttons_frame,
            text="Cleanup Dataset",
            command=self.admin_cleanup_datasets,
            width=150,
            height=40,
            fg_color="orange",
            state="normal"  # Always enabled for maintenance
        )
        self.admin_cleanup_btn.pack(side="left", padx=10, pady=10)
        
        # Check room access button
        self.check_access_btn = ctk.CTkButton(
            buttons_frame,
            text="Cek Akses Ruangan",
            command=self.check_user_room_access,
            width=150,
            height=40,
            fg_color="green",
            state="disabled"
        )
        self.check_access_btn.pack(side="left", padx=10, pady=10)
        
        # Process log
        self.create_process_log_section(parent_frame)
        
        # Load users on initialization
        self.load_users_list()
    
    def create_user_dataset_interface(self, parent_frame):
        """Regular user interface for managing own dataset"""
        # User info section
        user_info_frame = ctk.CTkFrame(parent_frame)
        user_info_frame.pack(fill="x", padx=10, pady=10)
        
        # Current user display
        ctk.CTkLabel(user_info_frame, text="Dataset untuk:", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w", padx=10, pady=(10, 5))
        
        user_info_text = f"👤 {self.current_employee_name}"
        if self.current_employee_id:
            user_info_text += f" (ID: {self.current_employee_id})"
            
        ctk.CTkLabel(
            user_info_frame, 
            text=user_info_text, 
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#1f538d"
        ).pack(anchor="w", padx=10, pady=(0, 10))

        # Dataset status for current user
        self.user_dataset_status_label = ctk.CTkLabel(
            user_info_frame,
            text="",
            font=ctk.CTkFont(size=12)
        )
        self.user_dataset_status_label.pack(anchor="w", padx=10, pady=(0, 10))
        self.update_current_user_dataset_status()
        
        # Instructions
        if not self.current_employee_id:
            warning_label = ctk.CTkLabel(
                user_info_frame,
                text="⚠️ Akun Anda belum terdaftar sebagai karyawan. Hubungi administrator.",
                font=ctk.CTkFont(size=12),
                text_color="#d9534f"
            )
            warning_label.pack(anchor="w", padx=10, pady=(0, 10))
        
        # Buttons frame
        buttons_frame = ctk.CTkFrame(parent_frame)
        buttons_frame.pack(fill="x", padx=10, pady=10)
        
        capture_btn = ctk.CTkButton(
            buttons_frame,
            text="Ambil Dataset Wajah (100 foto)",
            command=self.capture_dataset,
            width=250,
            height=40,
            state="normal" if self.current_employee_id else "disabled"
        )
        capture_btn.pack(side="left", padx=10, pady=10)
        
        train_btn = ctk.CTkButton(
            buttons_frame,
            text="Train Model",
            command=self.train_model,
            width=200,
            height=40,
            state="normal" if self.current_employee_id else "disabled"
        )
        train_btn.pack(side="left", padx=10, pady=10)
        
        delete_btn = ctk.CTkButton(
            buttons_frame,
            text="Hapus Model",
            command=self.delete_model,
            width=200,
            height=40,
            fg_color="red"
        )
        delete_btn.pack(side="left", padx=10, pady=10)
        
        # Process log
        self.create_process_log_section(parent_frame)
    
    def create_process_log_section(self, parent_frame):
        """Create process log section"""
        # Progress and logs
        progress_frame = ctk.CTkFrame(parent_frame)
        progress_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        ctk.CTkLabel(progress_frame, text="Log Proses:", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w", padx=10, pady=(10, 5))
        
        self.process_log = ctk.CTkTextbox(progress_frame, width=800, height=400)
        self.process_log.pack(fill="both", expand=True, padx=10, pady=10)

    def create_users_list_tab(self):
        """Create tab listing users and whether they have a local face dataset."""
        users_frame = ctk.CTkFrame(self.notebook)
        self.notebook.add(users_frame, text="Daftar Pengguna")

        header = ctk.CTkLabel(users_frame, text="Daftar Pengguna & Status Dataset", font=ctk.CTkFont(size=16, weight="bold"))
        header.pack(pady=(10, 5))

        # Summary label
        summary_frame = ctk.CTkFrame(users_frame)
        summary_frame.pack(fill="x", padx=10, pady=(0, 10))
        self.users_summary_label = ctk.CTkLabel(summary_frame, text="", font=ctk.CTkFont(size=12))
        self.users_summary_label.pack(side="left", padx=10, pady=10)

        refresh_btn = ctk.CTkButton(summary_frame, text="Refresh", command=self.refresh_users_dataset_list, width=120)
        refresh_btn.pack(side="right", padx=10, pady=10)

        # Tree list
        table_frame = ctk.CTkFrame(users_frame)
        table_frame.pack(fill="both", expand=True, padx=10, pady=10)

        self.users_tree = ttk.Treeview(table_frame, columns=("ID", "Nama", "Role", "Email", "Dataset"), show="headings", height=18)
        for col, text, width in [
            ("ID", "User ID", 80),
            ("Nama", "Nama", 180),
            ("Role", "Role", 100),
            ("Email", "Email", 220),
            ("Dataset", "Dataset", 140),
        ]:
            self.users_tree.heading(col, text=text)
            self.users_tree.column(col, width=width, anchor='w')

        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=self.users_tree.yview)
        self.users_tree.configure(yscroll=scrollbar.set)
        self.users_tree.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Initial load
        self.refresh_users_dataset_list()

    def refresh_users_dataset_list(self):
        """Populate the users_tree with users and dataset status."""
        try:
            # Clear table
            if hasattr(self, 'users_tree'):
                for item in self.users_tree.get_children():
                    self.users_tree.delete(item)

            if not self.is_backend_available():
                try:
                    messagebox.showerror("Backend Tidak Tersedia", "Server backend tidak aktif. Tidak dapat memuat daftar pengguna.")
                except Exception:
                    pass
                if hasattr(self, 'users_summary_label'):
                    self.users_summary_label.configure(text="Backend tidak tersedia.")
                return

            results = backend_api.get_users()
            if results is None:
                if hasattr(self, 'users_summary_label'):
                    self.users_summary_label.configure(text="Gagal memuat data pengguna dari backend.")
                return

            with_images = 0
            without_images = 0
            total = 0

            for u in results:
                total += 1
                uid = u.get('user_id')
                name = u.get('fullname')
                role = u.get('role')
                email = u.get('email')
                # For users list, dataset = images OR model (but display only yes/no)
                images_exist, count = self._get_dataset_info(uid, include_model=False)
                model_exist = self._has_model_file(uid)
                has_dataset = images_exist or model_exist
                if has_dataset:
                    with_images += 1
                else:
                    without_images += 1
                dataset_text = "Ada dataset" if has_dataset else "Tidak ada dataset"

                if hasattr(self, 'users_tree'):
                    self.users_tree.insert("", "end", values=(uid, name, role, email, dataset_text))

            if hasattr(self, 'users_summary_label'):
                self.users_summary_label.configure(text=f"Total: {total} | Punya dataset: {with_images} | Belum: {without_images}")

        except Exception as e:
            try:
                if hasattr(self, 'users_summary_label'):
                    self.users_summary_label.configure(text=f"Error memuat daftar pengguna: {e}")
            except Exception:
                pass
    
    def load_users_list(self):
        """Load list of users for admin interface"""
        try:
            # Require backend availability and use backend API only
            if not self.is_backend_available():
                self.log_message("⚠️ Backend tidak tersedia. Tidak dapat memuat daftar user.")
                return
            results = backend_api.get_users()
            if results is None:
                self.log_message("⚠️ Gagal memuat daftar user dari backend.")
                return
            
            if results:
                user_options = []
                self.users_data = {}
                
                for user in results:
                    # Compute local dataset indicator (images) and model presence for clarity
                    images_exist, count = self._get_dataset_info(user.get('user_id'), include_model=False)
                    model_exist = self._has_model_file(user.get('user_id'))
                    # Only show check/cross indicator for dataset availability (no image count)
                    # Availability means local images OR trained model exists
                    has_dataset = images_exist or model_exist
                    prefix = "✔" if has_dataset else "✖"
                    display_name = f"{prefix} {user['fullname']} ({user['role']}) - {user['email']}"
                    user_options.append(display_name)
                    user_copy = dict(user)
                    user_copy['_dataset_exists'] = images_exist
                    user_copy['_dataset_count'] = count
                    user_copy['_model_exists'] = model_exist
                    self.users_data[display_name] = user_copy
                
                self.user_dropdown.configure(values=user_options)
                self.log_message(f"Loaded {len(user_options)} users")
            else:
                self.log_message("No users found")
                
        except Exception as e:
            self.log_message(f"Error loading users: {e}")
    
    def on_user_selected(self, selected_display_name):
        """Handle user selection from dropdown"""
        if selected_display_name and selected_display_name in self.users_data:
            user = self.users_data[selected_display_name]
            self.selected_user_data = user
            
            # Update info display
            exists = bool(user.get('_dataset_exists'))  # images presence only
            count = int(user.get('_dataset_count', 0))
            model_exist = bool(user.get('_model_exists', False))
            # Only show check/cross indicator for dataset availability (images OR model)
            status_icon = "✔" if (exists or model_exist) else "✖"
            info_text = (
                f"👤 {user['fullname']} (ID: {user['user_id']}) - {user['role']}\n"
                f"Status dataset: {status_icon}"
            )
            self.selected_user_info.configure(text=info_text)
            
            # Enable buttons
            self.admin_capture_btn.configure(state="normal")
            # Only enable Train if dataset images exist locally
            self.admin_train_btn.configure(state=("normal" if count > 0 else "disabled"))
            self.admin_delete_btn.configure(state="normal")
            self.check_access_btn.configure(state="normal")
            
            self.log_message(f"Selected user: {user['fullname']}")
        else:
            # Disable buttons
            self.admin_capture_btn.configure(state="disabled")
            self.admin_train_btn.configure(state="disabled")
            self.admin_delete_btn.configure(state="disabled")
            self.check_access_btn.configure(state="disabled")

    def update_selected_user_info_label(self):
        """Refresh the selected user info label (dataset status and train button state)."""
        try:
            if not hasattr(self, 'selected_user_data'):
                return
            u = self.selected_user_data
            # Recompute dataset status from disk
            # For selected user info, reflect dataset images status (not model)
            exists, count = self._get_dataset_info(u.get('user_id'), include_model=False)
            model_exist = self._has_model_file(u.get('user_id'))
            u['_dataset_exists'] = exists
            u['_dataset_count'] = count
            u['_model_exists'] = model_exist
            # Only show check/cross indicator for dataset availability (images OR model)
            status_icon = "✔" if (exists or model_exist) else "✖"
            info_text = (
                f"👤 {u['fullname']} (ID: {u['user_id']}) - {u['role']}\n"
                f"Status dataset: {status_icon}"
            )
            self.selected_user_info.configure(text=info_text)
            # Update train button enablement
            self.admin_train_btn.configure(state=("normal" if count > 0 else "disabled"))
        except Exception as e:
            self.log_message(f"Error updating selected user info: {e}")
    
    def check_user_room_access(self):
        """Check if selected user has room access today"""
        if not hasattr(self, 'selected_user_data'):
            self.log_message("No user selected")
            return

        if not self.is_backend_available():
            self.log_message("⚠️ Backend tidak tersedia. Tidak dapat memeriksa akses ruangan.")
            try:
                messagebox.showerror("Backend Tidak Tersedia", "Server backend tidak aktif. Tidak dapat memeriksa akses ruangan.")
            except Exception:
                pass
            return

        # Run in background to keep UI responsive
        user = dict(self.selected_user_data)  # copy to avoid mutation while running

        def _check_access_room_thread(u):
            try:
                uid = u.get('user_id')
                uname = u.get('fullname', f"User {uid}")
                self.log_message(f"Checking room access for {uname}...")

                access_info = backend_api.check_user_room_access(uid)

                if not access_info:
                    self.log_message(f"⚠️ Tidak dapat memverifikasi akses untuk {uname}")
                    self.window.after(0, lambda: messagebox.showwarning("Gagal Memeriksa", f"Tidak dapat memverifikasi akses untuk {uname}."))
                    return

                allowed = bool(access_info.get('allowed', False))
                reason = access_info.get('reason') or 'N/A'

                # Normalize potential response keys: 'classes' or 'sessions'
                sessions = access_info.get('classes') or access_info.get('sessions') or []

                if allowed:
                    self.log_message(f"✅ {uname} DIIZINKAN masuk ruangan")
                    self.log_message(f"Alasan: {reason}")
                    if sessions:
                        self.log_message("Jadwal hari ini:")
                        for s in sessions:
                            course = s.get('course_name') or s.get('name') or s.get('course') or 'N/A'
                            start = s.get('start_time') or s.get('start') or s.get('start_at') or 'N/A'
                            end = s.get('end_time') or s.get('end') or s.get('end_at') or 'N/A'
                            room = s.get('room_name') or s.get('room')
                            extra = f" di {room}" if room else ""
                            self.log_message(f"  - {course} ({start}-{end}){extra}")
                    self.window.after(0, lambda: messagebox.showinfo("Akses Diizinkan", f"{uname} diizinkan masuk.\nAlasan: {reason}"))
                else:
                    self.log_message(f"❌ {uname} TIDAK DIIZINKAN masuk ruangan")
                    self.log_message(f"Alasan: {reason}")
                    self.window.after(0, lambda: messagebox.showerror("Akses Ditolak", f"{uname} tidak diizinkan masuk.\nAlasan: {reason}"))

            except Exception as e:
                self.log_message(f"Error checking room access: {e}")

        threading.Thread(target=_check_access_room_thread, args=(user,), daemon=True).start()
    
    def admin_capture_dataset(self):
        """Admin capture dataset for selected user"""
        if not hasattr(self, 'selected_user_data'):
            self.log_message("No user selected")
            return
        if not self.is_backend_available():
            self.log_message("⚠️ Backend tidak tersedia. Tidak dapat melakukan capture dataset.")
            return
        
        user = self.selected_user_data
        self.log_message(f"Starting dataset capture for {user['fullname']}...")
        
        # Run capture in separate thread
        thread = threading.Thread(
            target=self._capture_dataset_thread,
            args=(user['user_id'], user['fullname']),
            daemon=True
        )
        thread.start()
    
    def admin_train_model(self):
        """Admin train model for selected user"""
        if not hasattr(self, 'selected_user_data'):
            self.log_message("No user selected")
            return
        if not self.is_backend_available():
            self.log_message("⚠️ Backend tidak tersedia. Tidak dapat melakukan training model.")
            return
        
        user = self.selected_user_data
        self.log_message(f"Starting model training for {user['fullname']}...")
        
        # Run training in separate thread
        thread = threading.Thread(
            target=self._train_model_thread,
            args=(user['user_id'], user['fullname']),
            daemon=True
        )
        thread.start()
    
    def admin_delete_model(self):
        """Admin delete model for selected user"""
        if not hasattr(self, 'selected_user_data'):
            self.log_message("No user selected")
            return
        if not self.is_backend_available():
            self.log_message("⚠️ Backend tidak tersedia. Tidak dapat menghapus model.")
            return
        
        user = self.selected_user_data
        
        # Confirm deletion
        result = messagebox.askyesno(
            "Konfirmasi Hapus",
            f"Apakah Anda yakin ingin menghapus model wajah untuk {user['fullname']}?"
        )
        
        if result:
            self.log_message(f"Deleting model for {user['fullname']}...")
            try:
                success = self.face_system.delete_employee_model(user['user_id'])
                if success:
                    self.log_message(f"Model untuk {user['fullname']} berhasil dihapus")
                    self.window.after(0, lambda: messagebox.showinfo("Sukses", f"Model {user['fullname']} berhasil dihapus"))
                    self.window.after(0, self.refresh_models_list)
                    # Refresh all dataset indicators/views
                    self.window.after(0, self.update_selected_user_info_label)
                    self.window.after(0, self.refresh_users_dataset_list)
                    self.window.after(0, self.load_users_list)
                    self.window.after(0, self.update_current_user_dataset_status)
                else:
                    self.log_message("Gagal menghapus model via backend")
                    self.window.after(0, lambda: messagebox.showerror("Error", "Gagal menghapus model"))
            except Exception as e:
                self.log_message(f"Error deleting model: {e}")
                self.window.after(0, lambda: messagebox.showerror("Error", f"Gagal menghapus model: {e}"))
    
    def admin_cleanup_datasets(self):
        """Admin cleanup all dataset folders to free up storage"""
        result = messagebox.askyesno(
            "Konfirmasi Cleanup Dataset",
            "Apakah Anda yakin ingin menghapus SEMUA folder dataset?\n\n"
            "⚠️  PERINGATAN:\n"
            "- Ini akan menghapus semua foto dataset yang tersimpan\n"
            "- Model yang sudah dilatih akan tetap aman\n"
            "- Operasi ini tidak dapat dibatalkan\n\n"
            "Dataset hanya diperlukan saat training ulang. Jika model sudah dilatih, "
            "dataset bisa dihapus untuk menghemat storage."
        )
        
        if result:
            self.log_message("🧹 Memulai cleanup dataset folders...")
            
            # Run cleanup in separate thread to avoid UI freezing
            thread = threading.Thread(
                target=self._cleanup_datasets_thread,
                daemon=True
            )
            thread.start()
    
    def _cleanup_datasets_thread(self):
        """Thread method for cleaning up dataset folders"""
        try:
            success = self.face_system.cleanup_all_dataset_folders()
            
            if success:
                self.log_message("✅ Cleanup dataset berhasil!")
                self.window.after(0, lambda: messagebox.showinfo(
                    "Cleanup Berhasil", 
                    "Semua folder dataset telah berhasil dihapus!\n\n"
                    "Storage telah dibebaskan dan model tetap aman."
                ))
                # Ensure all views reflect that dataset images are gone
                try:
                    self.window.after(0, self.refresh_users_dataset_list)
                    self.window.after(0, self.load_users_list)
                    self.window.after(0, self.update_selected_user_info_label)
                    self.window.after(0, self.update_current_user_dataset_status)
                except Exception:
                    pass
            else:
                self.log_message("⚠️  Cleanup dataset gagal atau sebagian gagal")
                self.window.after(0, lambda: messagebox.showwarning(
                    "Cleanup Sebagian Gagal", 
                    "Beberapa folder dataset mungkin tidak berhasil dihapus.\n"
                    "Cek log untuk detail lebih lanjut."
                ))
                # Still attempt to refresh lists to reflect any partial changes
                try:
                    self.window.after(0, self.refresh_users_dataset_list)
                    self.window.after(0, self.load_users_list)
                    self.window.after(0, self.update_selected_user_info_label)
                    self.window.after(0, self.update_current_user_dataset_status)
                except Exception:
                    pass
                
        except Exception as e:
            self.log_message(f"Error during cleanup: {e}")
            self.window.after(0, lambda: messagebox.showerror(
                "Error Cleanup", 
                f"Terjadi error saat cleanup dataset:\n{e}"
            ))
    
    def _capture_dataset_thread(self, user_id, user_name):
        """Thread method for capturing dataset"""
        try:
            self.log_message(f"Memulai capture dataset untuk {user_name}...")
            
            captured_images = self.face_system.capture_face_dataset(user_id, user_name)
            
            if captured_images:
                self.log_message(f"Dataset berhasil dicapture: {len(captured_images)} gambar")
                # Auto-train after capture
                self.log_message("Memulai training model...")
                success = self.face_system.train_face_model(user_id, captured_images)
                
                if success:
                    self.log_message("✅ Model berhasil dilatih dan siap digunakan!")
                    self.window.after(0, lambda: messagebox.showinfo("Sukses", 
                        f"Dataset untuk {user_name} berhasil dicapture dan model dilatih!\n\n"
                        f"Model siap untuk face recognition."))
                    # Refresh indicators for current/selected user
                    self.window.after(0, self.update_current_user_dataset_status)
                    self.window.after(0, self.update_selected_user_info_label)
                else:
                    self.log_message("⚠️ Training model berhasil tetapi gagal registrasi ke database")
                    self.window.after(0, lambda: messagebox.showwarning("Perhatian", 
                        f"Model untuk {user_name} berhasil dilatih dan akan berfungsi,\n"
                        f"tetapi gagal diregistrasi ke database.\n\n"
                        f"Face recognition akan tetap bekerja normal."))
                    # Refresh indicators even on partial success
                    self.window.after(0, self.update_current_user_dataset_status)
                    self.window.after(0, self.update_selected_user_info_label)
            else:
                self.log_message("Gagal capture dataset")
                self.window.after(0, lambda: messagebox.showerror("Error", "Gagal capture dataset"))
                # Even if failed, dataset may have partial images; refresh status
                self.window.after(0, self.update_current_user_dataset_status)
                self.window.after(0, self.update_selected_user_info_label)
                
        except Exception as e:
            self.log_message(f"Error in capture dataset: {e}")
    
    def _train_model_thread(self, user_id, user_name):
        """Thread method for training model"""
        try:
            # Check if dataset exists (use same base path as face system)
            ds_base = getattr(self.face_system, 'dataset_path', 'datasets')
            dataset_dir = os.path.join(ds_base, f"employee_{user_id}")
            if not os.path.exists(dataset_dir):
                self.log_message(f"Dataset tidak ditemukan untuk {user_name}")
                self.window.after(0, lambda: messagebox.showerror("Error", f"Dataset tidak ditemukan untuk {user_name}. Capture dataset terlebih dahulu."))
                return
            
            # Get images from dataset directory
            import glob
            image_files = glob.glob(os.path.join(dataset_dir, "*.jpg"))
            
            if len(image_files) == 0:
                self.log_message(f"Tidak ada gambar ditemukan di dataset {user_name}")
                self.window.after(0, lambda: messagebox.showerror("Error", "Tidak ada gambar ditemukan di dataset"))
                return
            
            self.log_message(f"Training model untuk {user_name} dengan {len(image_files)} gambar...")
            success = self.face_system.train_face_model(user_id, image_files)
            
            if success:
                self.log_message("✅ Model berhasil dilatih dan siap digunakan!")
                self.window.after(0, lambda: messagebox.showinfo("Sukses", 
                    f"Model untuk {user_name} berhasil dilatih!\n\n"
                    f"Face recognition siap digunakan."))
                # Refresh dataset indicator in case counts changed
                self.window.after(0, self.update_selected_user_info_label)
            else:
                self.log_message("⚠️ Training berhasil tetapi gagal registrasi")
                self.window.after(0, lambda: messagebox.showwarning("Perhatian",
                    f"Model untuk {user_name} berhasil dilatih,\n"
                    f"tetapi gagal diregistrasi ke database.\n\n"
                    f"Face recognition akan tetap bekerja normal."))
                # Refresh indicators even on partial success
                self.window.after(0, self.update_selected_user_info_label)
                
        except Exception as e:
            self.log_message(f"Error in train model: {e}")
    
    def log_message(self, message):
        """Log message to process log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        
        self.process_log.insert("end", log_message)
        self.process_log.see("end")
    
    def log_process(self, message):
        """Alias for log_message for backward compatibility"""
        self.log_message(message)
        
    def create_management_tab(self):
        # Management tab
        management_frame = ctk.CTkFrame(self.notebook)
        self.notebook.add(management_frame, text="Manajemen")
        
        # Trained models list
        models_frame = ctk.CTkFrame(management_frame)
        models_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        ctk.CTkLabel(models_frame, text="Model yang Sudah Dilatih", font=ctk.CTkFont(size=16, weight="bold")).pack(pady=(10, 5))
        
        # Models treeview
        self.models_tree = ttk.Treeview(models_frame, columns=("ID", "Name", "Date", "Status"), show="headings")
        self.models_tree.heading("ID", text="Employee ID")
        self.models_tree.heading("Name", text="Nama")
        self.models_tree.heading("Date", text="Tanggal Training")
        self.models_tree.heading("Status", text="Status")
        
        self.models_tree.column("ID", width=100)
        self.models_tree.column("Name", width=200)
        self.models_tree.column("Date", width=150)
        self.models_tree.column("Status", width=100)
        
        self.models_tree.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Management buttons
        mgmt_buttons_frame = ctk.CTkFrame(management_frame)
        mgmt_buttons_frame.pack(fill="x", padx=10, pady=10)
        
        reload_models_btn = ctk.CTkButton(
            mgmt_buttons_frame,
            text="Reload Models",
            command=self.reload_models,
            width=150
        )
        reload_models_btn.pack(side="left", padx=10, pady=10)
        
        refresh_list_btn = ctk.CTkButton(
            mgmt_buttons_frame,
            text="Refresh List",
            command=self.refresh_models_list,
            width=150
        )
        refresh_list_btn.pack(side="left", padx=10, pady=10)
        
        
    def get_employee_list(self):
        """Get list of employees for dropdown"""
        try:
            # Require backend availability; backend API only
            if not self.is_backend_available():
                return []
            results = backend_api.get_users()
            if results is None:
                return []
            
            if results:
                allowed_roles = {'student','lecturer'}
                filtered = [u for u in results if (u.get('role') in allowed_roles)]
                return [f"{u.get('user_id')} - {u.get('fullname')}" for u in filtered]
            return []
                
        except Exception as e:
            print(f"Error getting employee list: {e}")
            return []
            
    def start_camera(self):
        """Start camera for face recognition"""
        try:
            # Strictly require backend to be available to start camera mode
            if not self.is_backend_available():
                messagebox.showerror("Backend Tidak Tersedia", "Server backend tidak aktif. Tidak dapat memulai mode Absensi.")
                return

            # Try to find a working camera index (0..2), including V4L2 backend on Linux/RPi
            selected_idx = None
            for idx in (0, 1, 2):
                cap = cv2.VideoCapture(idx)
                if cap is not None and cap.isOpened():
                    selected_idx = idx
                    cap.release()
                    break
                # Try V4L2 backend as a fallback (common on Raspberry Pi / Linux)
                try:
                    if cap is not None:
                        cap.release()
                except Exception:
                    pass
                try:
                    cap_v4l2 = cv2.VideoCapture(idx, cv2.CAP_V4L2)
                    if cap_v4l2 is not None and cap_v4l2.isOpened():
                        selected_idx = idx
                        cap_v4l2.release()
                        break
                    if cap_v4l2 is not None:
                        cap_v4l2.release()
                except Exception:
                    pass
            if selected_idx is None:
                messagebox.showerror("Error", "Tidak dapat mengakses kamera (tidak ditemukan perangkat kamera)")
                return

            self._camera_device_index = selected_idx
            self.camera = cv2.VideoCapture(selected_idx)
            if not self.camera.isOpened():
                messagebox.showerror("Error", f"Tidak dapat mengakses kamera pada index {selected_idx}")
                return
                
            self.camera_running = True
            self.start_camera_btn.configure(state="disabled")
            self.stop_camera_btn.configure(state="normal")
            
            # Load face models (don't fail camera if models not found; allow video preview)
            models_loaded = self.face_system.load_all_face_models()
            if not models_loaded:
                self.log_recognition("⚠️ Belum ada model wajah yang aktif. Kamera tetap berjalan (preview).")
                # Schedule periodic retry to load models while camera is running
                try:
                    if hasattr(self, '_models_retry_job') and self._models_retry_job:
                        self.window.after_cancel(self._models_retry_job)
                except Exception:
                    pass
                def _retry_load_models():
                    if not self.camera_running:
                        return
                    ok = self.face_system.load_all_face_models()
                    if ok:
                        self.log_recognition("✅ Model wajah berhasil dimuat. Recognition aktif.")
                        self._models_retry_job = None
                    else:
                        self._models_retry_job = self.window.after(10000, _retry_load_models)
                self._models_retry_job = self.window.after(5000, _retry_load_models)
            
            # Start camera thread
            self.camera_thread = threading.Thread(target=self.camera_loop)
            self.camera_thread.daemon = True
            self.camera_thread.start()
            
            self.log_recognition("Kamera dimulai, face recognition aktif")
            
        except Exception as e:
            messagebox.showerror("Error", f"Error starting camera: {e}")
            
    def stop_camera(self):
        """Stop camera"""
        self.camera_running = False
        if self.camera:
            self.camera.release()
            self.camera = None
        
        # Safe widget configuration with existence check
        try:
            if hasattr(self, 'start_camera_btn') and self.start_camera_btn.winfo_exists():
                self.start_camera_btn.configure(state="normal")
            if hasattr(self, 'stop_camera_btn') and self.stop_camera_btn.winfo_exists():
                self.stop_camera_btn.configure(state="disabled")
            
            # Clear camera display
            if hasattr(self, 'camera_frame') and self.camera_frame.winfo_exists():
                # Use None instead of empty string to avoid CTk image warning
                self.camera_frame.configure(image=None, text="Kamera tidak aktif")
            
            if hasattr(self, 'log_recognition'):
                self.log_recognition("Kamera dihentikan")
        except Exception as e:
            print(f"Error in stop_camera: {e}")
            # Widget might have been destroyed, just continue
        
    def camera_loop(self):
        """Main camera loop for face recognition"""
        while self.camera_running:
            try:
                # Periodically ensure backend is available; stop if down
                now = time.time()
                if now >= self._next_backend_ping_at:
                    self._next_backend_ping_at = now + 5.0  # check every 5s
                    if not self.is_backend_available(timeout=2):
                        # Pause recognition but keep preview if possible (don't hard-stop camera)
                        self.window.after(0, lambda: self.log_recognition("⚠️ Backend tidak tersedia. Recognition dijeda, preview tetap berjalan."))
                ret, frame = self.camera.read()
                if not ret:
                    self.window.after(0, lambda: self.log_recognition("⚠️ Tidak dapat membaca frame dari kamera"))
                    break
                    
                # Resize frame for better performance
                frame = cv2.resize(frame, (640, 480))
                
                # Face recognition (only if at least one model is loaded)
                do_recognition = bool(getattr(self.face_system, 'known_faces', {}))
                if do_recognition:
                    recognized_employees, face_locations = self.face_system.recognize_face(frame)
                else:
                    recognized_employees, face_locations = ([], [])
                
                # Draw rectangles and labels for each detected face
                for i, (left, top, right, bottom) in enumerate(face_locations):
                    # Draw rectangle around face
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                    
                    # If this face is recognized, show the name
                    if i < len(recognized_employees) and recognized_employees[i] is not None:
                        employee = recognized_employees[i]
                        # Show only name and normalized confidence (remove raw distance display)
                        cv2.putText(frame,
                                  f"{employee['name']} ({employee['confidence']:.2f})", 
                                  (left, top - 10), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 
                                  0.7, (0, 255, 0), 2)
                        
                        # Auto-mark attendance if raw LBPH distance under threshold
                        threshold = self.face_system.lbph_threshold if hasattr(self.face_system, 'lbph_threshold') else 65
                        raw_conf = employee.get('raw_confidence', 1000)
                        if raw_conf <= threshold:
                            # Debounce per-employee to keep UI smooth
                            eid = employee['employee_id']
                            now_ts = time.time()
                            last_ts = self._last_recognition_trigger.get(eid, 0)
                            if now_ts - last_ts >= self._recognition_cooldown_sec:
                                self._last_recognition_trigger[eid] = now_ts
                                # Dispatch processing to background so drawing stays smooth
                                threading.Thread(
                                    target=self._process_recognition_async,
                                    args=(eid, employee['name'], employee['confidence']),
                                    daemon=True
                                ).start()
                    else:
                        # Unknown face
                        cv2.putText(frame, 
                                  "Unknown", 
                                  (left, top - 10), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 
                                  0.7, (0, 0, 255), 2)
                if not do_recognition:
                    # Show overlay hint that models are not loaded yet
                    cv2.putText(frame, "Model belum dimuat - hanya preview", (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
                        
                # Convert frame for tkinter display
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                img = Image.fromarray(frame_rgb)
                try:
                    from customtkinter import CTkImage
                    img_tk = CTkImage(light_image=img, size=(frame_rgb.shape[1], frame_rgb.shape[0]))
                except Exception:
                    # Fallback if CTkImage not available
                    img_tk = ImageTk.PhotoImage(img)
                
                # Update display
                self.window.after(0, lambda: self.update_camera_display(img_tk))
                
                time.sleep(0.03)  # ~30 FPS
                
            except Exception as e:
                print(f"Camera loop error: {e}")
                break
                
    def update_camera_display(self, img_tk):
        """Update camera display in GUI"""
        self.camera_frame.configure(image=img_tk, text="")
        self.camera_frame.image = img_tk  # Keep a reference

    def _process_recognition_async(self, employee_id, employee_name, confidence):
        """Handle access verification and attendance in background to keep camera smooth."""
        try:
            access_result = self.verify_room_access_and_attendance(employee_id, employee_name, confidence)
            if access_result['success']:
                # Log clearer message and open door
                reason = access_result.get('reason', f"Akses diberikan: {employee_name}")
                self.window.after(0, lambda: self.log_recognition(f"✅ {reason}"))
                self.window.after(0, self.activate_door_relay)
                self.window.after(0, self.refresh_attendance_data)
            else:
                reason = access_result.get('reason', 'Akses ditolak')
                self.window.after(0, lambda: self.log_recognition(f"❌ Akses ditolak: {employee_name} - {reason}"))
                # Avoid repeated negative beeps if backend is down
                if not access_result.get('backend_down', False):
                    denied_beep()
        except Exception as e:
            print(f"Async recognition error: {e}")
    
    def verify_room_access_and_attendance(self, employee_id, employee_name, confidence):
        """
        Dual function: Verify room access + mark attendance if not already marked
        1. Check room access (always allowed if user has scheduled classes)
        2. Mark attendance once per class session (per-class, per-day)
        Returns: dict with success status and reason
        """
        try:
            # DEBUG/TEST MODE: Allow all access (bypass schedule check)
            allow_all = os.getenv('ALLOW_ALL_ACCESS', 'false').lower() in ('true', '1', 'yes')
            if allow_all:
                print(f"[TEST MODE] ALLOW_ALL_ACCESS enabled - bypassing schedule check for {employee_name}")
                # Still try to record attendance if possible
                try:
                    # Try to find any active class for this user to link attendance
                    from simple_database import simple_db
                    query = """
                    SELECT DISTINCT c.class_id 
                    FROM courses c
                    JOIN user_courses uc ON c.course_id = uc.course_id
                    WHERE uc.user_id = %s
                    LIMIT 1
                    """
                    result = simple_db.execute_query(query, (employee_id,))
                    class_id = result[0]['class_id'] if result else None
                    
                    if class_id:
                        record_result = backend_api.record_attendance(employee_id, class_id, confidence_score=confidence)
                        if record_result and record_result.get('success'):
                            return {
                                'success': True,
                                'reason': f'[TEST MODE] {employee_name} - Absensi dicatat + Pintu dibuka',
                                'action': 'attendance_and_door',
                                'attendance_marked': True
                            }
                except Exception as e:
                    print(f"[TEST MODE] Error recording attendance: {e}")
                
                # Even if attendance recording fails, still grant access in test mode
                return {
                    'success': True,
                    'reason': f'[TEST MODE] {employee_name} - Pintu dibuka (bypass mode)',
                    'action': 'door_only',
                    'attendance_marked': False
                }
            
            # NORMAL MODE: Check access via backend
            # First check if user has room access today
            print(f"[ACCESS CHECK] Checking access for employee_id: {employee_id}, name: {employee_name}")
            access_info = backend_api.check_user_room_access(employee_id)
            
            print(f"[ACCESS CHECK] Response: {access_info}")
            
            if not access_info:
                # Backend likely unavailable; stop camera and abort flow
                print(f"[ACCESS CHECK] No access_info returned - backend might be down")
                try:
                    self.window.after(0, lambda: self.log_recognition("⚠️ Backend tidak tersedia. Menghentikan kamera."))
                    self.window.after(0, self.stop_camera)
                except Exception:
                    pass
                return {
                    'success': False,
                    'reason': 'Backend tidak tersedia',
                    'backend_down': True
                }
            
            allowed = access_info.get('allowed', False)
            reason = access_info.get('reason', 'No scheduled classes today')
            classes = access_info.get('classes', [])
            
            print(f"[ACCESS CHECK] allowed={allowed}, reason={reason}, classes_count={len(classes)}")
            
            if not allowed:
                # No room access - deny entry
                print(f"[ACCESS CHECK] Access DENIED for {employee_name}: {reason}")
                backend_api.log_door_access(
                    employee_id, 
                    access_type='face_recognition',
                    access_status='denied',
                    confidence_score=confidence,
                    reason=reason
                )
                return {
                    'success': False,
                    'reason': reason
                }
            
            # User HAS room access - proceed with dual function
            # Determine class_id from access info (pick the first matching class for now)
            classes = access_info.get('classes', [])
            class_id = classes[0].get('class_id') if classes else None

            # Prefer recording attendance via backend_api to ensure per-class linkage
            attendance_success = False
            attendance_message = 'Tidak dapat mencatat absensi'
            session_id = None

            if class_id:
                record_result = backend_api.record_attendance(employee_id, class_id, confidence_score=confidence)
                attendance_success = bool(record_result and record_result.get('success'))
                attendance_message = record_result.get('message') if record_result else attendance_message
                session_id = record_result.get('session_id') if record_result else None
            else:
                # Do not fallback to legacy attendance when backend is the source of truth
                return {
                    'success': False,
                    'reason': 'Jadwal kelas tidak ditemukan untuk hari ini',
                    'backend_down': False
                }

            if attendance_success:
                # First time entry today - attendance marked + door access granted
                backend_api.log_door_access(
                    employee_id, 
                    access_type='face_recognition',
                    access_status='granted',
                    confidence_score=confidence,
                    reason='Attendance marked + door access granted',
                    session_id=session_id
                )
                print(f"[ACCESS FLOW] Attendance success. Will open door for {employee_name} (session_id={session_id})")
                return {
                    'success': True,
                    'reason': f'Selamat datang {employee_name}! Absensi dicatat + Pintu dibuka',
                    'action': 'attendance_and_door',
                    'attendance_marked': True
                }
            else:
                # Already marked attendance - but still grant door access
                backend_api.log_door_access(
                    employee_id, 
                    access_type='face_recognition',
                    access_status='granted',
                    confidence_score=confidence,
                    reason='Door access granted (attendance already marked)',
                    session_id=session_id
                )
                print(f"[ACCESS FLOW] Attendance already marked. Will open door for {employee_name} (session_id={session_id})")
                return {
                    'success': True,
                    'reason': f'Selamat datang kembali {employee_name}! Pintu dibuka',
                    'action': 'door_only',
                    'attendance_marked': False
                }
                
        except Exception as e:
            print(f"Error in verify_room_access_and_attendance: {e}")
            return {
                'success': False,
                'reason': f'Error verifying access: {str(e)}'
            }
        
    def log_recognition(self, message):
        """Log message to recognition info"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        
        self.recognition_info.insert("end", log_message)
        self.recognition_info.see("end")
    
    def activate_door_relay(self):
        """
        Activate door relay for Raspberry Pi
        Uses the relay_control module for GPIO operations
        """
        try:
            # Activate door relay with callback for logging and UI update
            def door_closed_callback():
                self.log_recognition("🔒 Pintu ditutup kembali")
                # Update door status indicator
                self.window.after(0, self.update_door_status)
            
            # Referensi perilaku dari relay.txt (fingerprint): menggunakan PIN 17 dan durasi 5 detik
            # Di relay_control kita sudah buat default bisa di override via env.
            # Di sini kita eksplisit set duration=5 agar konsisten dengan sistem fingerprint.
            print("[ACCESS FLOW] Calling activate_door(duration=5)...")
            success = activate_door(duration=5, callback=door_closed_callback)
            print(f"[ACCESS FLOW] activate_door returned {success}")
            
            if success:
                try:
                    # Fetch relay debug info for visibility
                    from relay_control import get_door_status, get_door_debug
                    dbg = get_door_debug()
                    print(f"[ACCESS FLOW] Relay debug: {dbg}")
                    now_status = get_door_status()
                    print(f"[ACCESS FLOW] Door status after activate: {now_status}")
                except Exception as e:
                    print(f"[ACCESS FLOW] Unable to get relay debug: {e}")
                self.log_recognition("🔓 Pintu dibuka selama 5 detik")
                success_beep()  # Play success sound
                # Update door status indicator
                self.update_door_status()
            else:
                self.log_recognition("⚠️ Error mengaktifkan relay pintu")
                try:
                    from relay_control import get_door_status, get_door_debug
                    dbg = get_door_debug()
                    print(f"[ACCESS FLOW] Relay debug on failure: {dbg}")
                    now_status = get_door_status()
                    print(f"[ACCESS FLOW] Door status after failure: {now_status}")
                except Exception as e:
                    print(f"[ACCESS FLOW] Unable to get relay debug on failure: {e}")
                
        except Exception as e:
            print(f"[RELAY] Error activating door relay: {e}")
            self.log_recognition(f"⚠️ Error mengaktifkan relay: {e}")
    
    def update_door_status(self):
        """Update door status indicator in UI"""
        try:
            from relay_control import get_door_status
            status = get_door_status()
            
            if hasattr(self, 'door_status_label') and self.door_status_label.winfo_exists():
                if status == "LOCKED":
                    self.door_status_label.configure(
                        text="🔒 TERKUNCI",
                        text_color="#2e7d32"  # Green - secure state
                    )
                else:
                    self.door_status_label.configure(
                        text="🔓 TERBUKA",
                        text_color="#d32f2f"  # Red - door open
                    )
            
            # Schedule next update (every 1 second)
            if hasattr(self, 'window') and self.window.winfo_exists():
                self.window.after(1000, self.update_door_status)
                
        except Exception as e:
            print(f"Error updating door status: {e}")
        
    def capture_dataset(self):
        """Capture face dataset for current logged in user"""
        if not self.current_employee_id:
            messagebox.showerror("Error", "Akun Anda belum terdaftar sebagai karyawan. Hubungi administrator.")
            return
        if not self.is_backend_available():
            messagebox.showerror("Backend Tidak Tersedia", "Server backend tidak aktif. Tidak dapat capture dataset.")
            return
            
        def capture_thread():
            self.log_process(f"Memulai capture dataset untuk {self.current_employee_name}...")
            
            captured_images = self.face_system.capture_face_dataset(self.current_employee_id, self.current_employee_name)
            
            if captured_images:
                self.log_process(f"Dataset berhasil dicapture: {len(captured_images)} gambar")
                
                # Auto-train after capture
                self.log_process("Memulai training model...")
                success = self.face_system.train_face_model(self.current_employee_id, captured_images)
                
                if success:
                    self.log_process("✅ Model berhasil dilatih dan siap digunakan!")
                    messagebox.showinfo("Sukses", 
                        "Dataset berhasil dicapture dan model dilatih!\n\n"
                        "Face recognition siap digunakan.")
                    # Refresh models list
                    self.refresh_models_list()
                    # Refresh user dataset status label
                    self.update_current_user_dataset_status()
                else:
                    self.log_process("⚠️ Training berhasil tetapi gagal registrasi")
                    messagebox.showwarning("Perhatian",
                        "Model berhasil dilatih dan akan berfungsi,\n"
                        "tetapi gagal diregistrasi ke database.\n\n"
                        "Face recognition akan tetap bekerja normal.")
                    # Refresh even on partial success
                    self.refresh_models_list()
                    self.update_current_user_dataset_status()
            else:
                self.log_process("Gagal capture dataset")
                messagebox.showerror("Error", "Gagal capture dataset")
            # Refresh dataset status regardless to reflect any new images
            self.update_current_user_dataset_status()
                
        # Run in separate thread
        thread = threading.Thread(target=capture_thread)
        thread.daemon = True
        thread.start()
        
    def train_model(self):
        """Train model for current logged in user"""
        if not self.current_employee_id:
            messagebox.showerror("Error", "Akun Anda belum terdaftar sebagai karyawan. Hubungi administrator.")
            return
        if not self.is_backend_available():
            messagebox.showerror("Backend Tidak Tersedia", "Server backend tidak aktif. Tidak dapat training model.")
            return
        
        # Check if dataset exists (use same base path as face system)
        ds_base = getattr(self.face_system, 'dataset_path', 'datasets')
        dataset_dir = os.path.join(ds_base, f"employee_{self.current_employee_id}")
        if not os.path.exists(dataset_dir):
            messagebox.showerror("Error", "Dataset tidak ditemukan. Capture dataset terlebih dahulu.")
            return
        
        def train_thread():
            self.log_process(f"Memulai training model untuk {self.current_employee_name}...")
            
            # Get existing images
            images = []
            for filename in os.listdir(dataset_dir):
                if filename.endswith(('.jpg', '.jpeg', '.png')):
                    images.append(os.path.join(dataset_dir, filename))
                    
            if images:
                success = self.face_system.train_face_model(self.current_employee_id, images)
                
                if success:
                    self.log_process("✅ Model berhasil dilatih dan siap digunakan!")
                    messagebox.showinfo("Sukses", 
                        "Model berhasil dilatih!\n\n"
                        "Face recognition siap digunakan.")
                    # Refresh models list
                    self.refresh_models_list()
                    self.update_current_user_dataset_status()
                else:
                    self.log_process("⚠️ Training berhasil tetapi gagal registrasi")
                    messagebox.showwarning("Perhatian",
                        "Model berhasil dilatih dan akan berfungsi,\n"
                        "tetapi gagal diregistrasi ke database.\n\n"
                        "Face recognition akan tetap bekerja normal.")
                    # Refresh even on partial success
                    self.refresh_models_list()
                    self.update_current_user_dataset_status()
            else:
                self.log_process("Tidak ada gambar dataset")
                messagebox.showerror("Error", "Tidak ada gambar dataset")
                
        thread = threading.Thread(target=train_thread)
        thread.daemon = True
        thread.start()
        
    def delete_model(self):
        """Delete model for current logged in user"""
        if not self.current_employee_id:
            messagebox.showerror("Error", "Akun Anda belum terdaftar sebagai karyawan. Hubungi administrator.")
            return
        if not self.is_backend_available():
            messagebox.showerror("Backend Tidak Tersedia", "Server backend tidak aktif. Tidak dapat menghapus model.")
            return
        
        if messagebox.askyesno("Konfirmasi", f"Hapus model untuk {self.current_employee_name}?"):
            success = self.face_system.delete_employee_model(self.current_employee_id)
            
            if success:
                self.log_process(f"Model {self.current_employee_name} berhasil dihapus")
                messagebox.showinfo("Sukses", "Model berhasil dihapus")
                # Refresh models list
                self.refresh_models_list()
                # Deleting model doesn't affect dataset files, but keep UI fresh
                self.update_current_user_dataset_status()
            else:
                messagebox.showerror("Error", "Gagal menghapus model")

    def update_current_user_dataset_status(self):
        """Refresh dataset status label for current logged-in user."""
        try:
            if not hasattr(self, 'user_dataset_status_label'):
                return
            if not self.current_employee_id:
                self.user_dataset_status_label.configure(text="Dataset: -", text_color="#6c757d")
                return
            exists, count = self._get_dataset_info(self.current_employee_id)
            text, color = self._format_dataset_indicator(exists, count)
            self.user_dataset_status_label.configure(text=f"Status: {text}", text_color=color)
        except Exception as e:
            try:
                self.user_dataset_status_label.configure(text=f"Dataset: error ({e})", text_color="#d9534f")
            except Exception:
                pass
                
    def log_process(self, message):
        """Log message to process log"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        
        self.process_log.insert("end", log_message)
        self.process_log.see("end")
        
    def refresh_attendance_data(self):
        """Refresh today's attendance data"""
        try:
            # Clear existing items
            for item in self.attendance_tree.get_children():
                self.attendance_tree.delete(item)
                
            # Try backend endpoint first
            today_str = datetime.now().strftime('%Y-%m-%d')
            results = backend_api.get_today_attendances(today_str)
            if results is None:
                if getattr(backend_api, 'backend_only', False):
                    self.log_recognition("⚠️ Backend-only mode: gagal memuat data dari backend. Tidak ada fallback DB.")
                    return
                # Fallback direct DB
                today = datetime.now().date()
                query = """
                SELECT u.fullname, sa.check_in_time, sa.status
                FROM student_attendances sa
                JOIN users u ON sa.student_id = u.user_id
                WHERE DATE(sa.check_in_time) = %s
                ORDER BY sa.check_in_time DESC
                """
                results = simple_db.execute_query(query, (today,))
            
            if results:
                for row in results:
                    # Normalize from backend shape or DB shape
                    name = row.get('fullname') or row.get('full_name') or row.get('student_name')
                    check_in = row.get('check_in_time')
                    status = row.get('status')
                    if hasattr(check_in, 'strftime'):
                        clock_in = check_in.strftime("%H:%M")
                    else:
                        # assume string like ISO
                        try:
                            clock_in = check_in[11:16] if isinstance(check_in, str) else "-"
                        except:
                            clock_in = "-"
                    self.attendance_tree.insert("", "end", values=(
                        name or '-',
                        clock_in,
                        status or '-'
                    ))
                    
        except Exception as e:
            print(f"Error refreshing attendance data: {e}")
            
    def reload_models(self):
        """Reload all face models"""
        success = self.face_system.load_all_face_models()
        if success:
            self.log_recognition("Models berhasil di-reload")
            messagebox.showinfo("Sukses", "Models berhasil di-reload")
        else:
            messagebox.showerror("Error", "Gagal reload models")
            
    def refresh_models_list(self):
        """Refresh models list"""
        try:
            # Check if models_tree widget exists
            if not hasattr(self, 'models_tree'):
                print("Models tree widget not available")
                return
                
            # Clear existing items
            for item in self.models_tree.get_children():
                self.models_tree.delete(item)
                
            # Backend endpoint for models list only
            if not self.is_backend_available():
                self.log_message("⚠️ Backend tidak tersedia. Tidak dapat memuat daftar model.")
                return
            results = None
            try:
                if backend_api and getattr(backend_api, 'session', None):
                    url = f"{backend_api.base_url}/api/face-training?status=active"
                    resp = backend_api.session.get(url, timeout=10)
                    if resp.status_code == 200:
                        body = resp.json() or {}
                        results = body.get('data')
            except Exception as e:
                print(f"Backend models list error: {e}")
            if results is None:
                self.log_message("⚠️ Gagal memuat daftar model dari backend.")
                return
            
            if results:
                for row in results:
                    # Normalize fields across backend or DB results
                    employee_id = row.get('employee_id') or row.get('user_id')
                    fullname = row.get('fullname') or row.get('full_name') or row.get('name')
                    status_raw = row.get('status')
                    created_at = row.get('created_at')
                    status = "Aktif" if status_raw == 'active' else "Tidak Aktif"
                    if hasattr(created_at, 'strftime'):
                        created_date = created_at.strftime('%Y-%m-%d %H:%M')
                    else:
                        created_date = str(created_at)[:16] if created_at else 'N/A'
                    
                    self.models_tree.insert("", "end", values=(
                        employee_id,
                        fullname,
                        created_date,
                        status
                    ))
                    
        except Exception as e:
            print(f"Error refreshing models list: {e}")
            # Don't show error dialog, just log it
            
    def mount(self):
        """Mount the app UI into the existing root and perform initial loads."""
        # Initialize data
        try:
            self.refresh_attendance_data()
            self.refresh_models_list()
        except Exception as e:
            print(f"Error during initialization: {e}")

        # Set up proper cleanup on window close
        def on_closing():
            try:
                if hasattr(self, 'camera_running') and self.camera_running:
                    self.stop_camera()
                # Cleanup GPIO resources
                cleanup_gpio()
            except Exception as e:
                print(f"Error during cleanup: {e}")
            finally:
                try:
                    self.window.destroy()
                except Exception:
                    pass

        try:
            self.window.protocol("WM_DELETE_WINDOW", on_closing)
        except Exception:
            pass

    def run(self):
        """Mount and start the mainloop (for standalone use)."""
        self.mount()
        # Start main loop
        try:
            self.window.mainloop()
        except Exception as e:
            print(f"Error in main loop: {e}")
        finally:
            # Final cleanup
            try:
                if hasattr(self, 'camera_running') and self.camera_running:
                    self.stop_camera()
                # Cleanup GPIO resources
                cleanup_gpio()
            except Exception as e:
                print(f"Error in final cleanup: {e}")

def main():
    """Start the app using a single CTk root with a modal login Toplevel."""
    # Create a single root and keep it hidden until login succeeds
    print("[APP] Starting GUI root...")
    root = ctk.CTk()
    # Hide root to avoid showing an extra blank window behind the login dialog
    try:
        root.withdraw()
    except Exception:
        pass

    app_container = {}

    def on_login_success(user_payload):
        # Show the main window and mount the app into this root
        try:
            root.deiconify()
        except Exception:
            pass
        app = FaceAttendanceApp(user_payload, root=root)
        app.mount()
        app_container['app'] = app

    # Show login as Toplevel
    print("[APP] Showing login window...")
    login = LoginWindow(root, on_success_callback=on_login_success)
    print("[APP] Login window created.")

    # Center the login on screen relative to root
    try:
        root.update_idletasks()
        login.window.update_idletasks()
        w = max(400, login.window.winfo_width() or 400)
        h = max(500, login.window.winfo_height() or 500)
        x = (login.window.winfo_screenwidth() // 2) - (w // 2)
        y = (login.window.winfo_screenheight() // 2) - (h // 2)
        login.window.geometry(f"{w}x{h}+{x}+{y}")
    except Exception as e:
        print(f"[APP] Centering login failed: {e}")

    # If for some reason the login is not visible after a short delay, ensure visibility
    def _ensure_login_visible():
        try:
            if not login.window.winfo_viewable():
                login.window.deiconify()
                login.window.lift()
                login.window.focus_force()
        except Exception:
            pass
    try:
        root.after(500, _ensure_login_visible)
    except Exception:
        pass

    # Run a single mainloop for the entire app lifecycle
    print("[APP] Entering main loop...")
    try:
        root.mainloop()
    except Exception as e:
        print(f"Error in root main loop: {e}")

if __name__ == "__main__":
    main()
