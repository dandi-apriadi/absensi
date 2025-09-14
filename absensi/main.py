import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import customtkinter as ctk
from PIL import Image, ImageTk
import cv2
import threading
import time
import os
from datetime import datetime
from simple_database import simple_db
from simple_face_recognition import SimpleFaceRecognition
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from backend_api import backend_api

class LoginWindow:
    def __init__(self):
        self.window = ctk.CTk()
        self.window.title("Sistem Absensi Face Recognition - Login")
        self.window.geometry("400x500")
        self.window.resizable(False, False)
        
        # Set appearance mode and color theme
        ctk.set_appearance_mode("light")
        ctk.set_default_color_theme("blue")
        
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
            
        print("[LOGIN DEBUG] Calling verify_login...")
        # Verify credentials
        if self.verify_login(email, password):
            print("[LOGIN DEBUG] Login successful, opening main app...")
            self.window.destroy()
            # Open main application
            app = FaceAttendanceApp(self.current_user)
            app.run()
        else:
            print("[LOGIN DEBUG] Login failed")
            messagebox.showerror("Error", "Email atau password salah")
            
    def verify_login(self, email, password):
        print(f"[LOGIN DEBUG] Starting verify_login for email: {email}")
        
        # Initialize password hasher
        ph = PasswordHasher()
        
        try:
            print("[LOGIN DEBUG] Executing login query...")
            
            # Query to verify user credentials - check the correct table based on backend models
            query = """
            SELECT user_id, fullname, role, password, status 
            FROM users 
            WHERE email = %s AND status = 'active' AND role IN ('super-admin', 'lecturer')
            """
            
            print(f"[LOGIN DEBUG] Executing query with email: {email}")
            result = simple_db.execute_query(query, (email,))
            print(f"[LOGIN DEBUG] Query result: {result}")
            
            if result and len(result) > 0:
                user = result[0]
                print(f"[LOGIN DEBUG] User found: {user['fullname']} (ID: {user['user_id']}, Role: {user['role']})")
                print(f"[LOGIN DEBUG] Stored password hash: {user['password'][:50]}...")
                print(f"[LOGIN DEBUG] Input password: '{password}'")
                
                # Check if user is admin or lecturer (allowed roles)
                if user['role'] not in ['super-admin', 'lecturer']:
                    print("[LOGIN DEBUG] ❌ Access denied - User does not have admin privileges")
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
    def __init__(self, current_user):
        self.window = ctk.CTk()
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
        
        self.setup_ui()
        
    def get_current_employee_info(self):
        """Get employee info for the currently logged in user"""
        try:
            query = """
            SELECT e.employee_id, u.fullname
            FROM employees e
            JOIN users u ON e.user_id = u.user_id
            WHERE u.user_id = %s AND u.status = 'active'
            """
            
            results = simple_db.execute_query(query, (self.current_user['user_id'],))
            
            if results:
                self.current_employee_id = results[0]['employee_id']
                self.current_employee_name = results[0]['fullname']
                print(f"[EMPLOYEE INFO] Employee ID: {self.current_employee_id}, Name: {self.current_employee_name}")
            else:
                print(f"[EMPLOYEE INFO] No employee record found for user: {self.current_user['fullname']}")
                self.current_employee_id = None
                self.current_employee_name = self.current_user['fullname']
                
        except Exception as e:
            print(f"[EMPLOYEE INFO] Error getting employee info: {e}")
            self.current_employee_id = None
            self.current_employee_name = self.current_user['fullname']
        
    def setup_ui(self):
        # Create main notebook for tabs
        self.notebook = ttk.Notebook(self.window)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Create tabs
        self.create_attendance_tab()
        self.create_dataset_tab()
        self.create_management_tab()
        self.create_reports_tab()
        
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
    
    def load_users_list(self):
        """Load list of users for admin interface"""
        try:
            query = """
            SELECT user_id, fullname, role, email, status
            FROM users 
            WHERE status = 'active'
            ORDER BY fullname
            """
            
            results = simple_db.execute_query(query)
            
            if results:
                user_options = []
                self.users_data = {}
                
                for user in results:
                    display_name = f"{user['fullname']} ({user['role']}) - {user['email']}"
                    user_options.append(display_name)
                    self.users_data[display_name] = user
                
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
            info_text = f"👤 {user['fullname']} (ID: {user['user_id']}) - {user['role']}"
            self.selected_user_info.configure(text=info_text)
            
            # Enable buttons
            self.admin_capture_btn.configure(state="normal")
            self.admin_train_btn.configure(state="normal")
            self.admin_delete_btn.configure(state="normal")
            self.check_access_btn.configure(state="normal")
            
            self.log_message(f"Selected user: {user['fullname']}")
        else:
            # Disable buttons
            self.admin_capture_btn.configure(state="disabled")
            self.admin_train_btn.configure(state="disabled")
            self.admin_delete_btn.configure(state="disabled")
            self.check_access_btn.configure(state="disabled")
    
    def check_user_room_access(self):
        """Check if selected user has room access today"""
        if not hasattr(self, 'selected_user_data'):
            self.log_message("No user selected")
            return
        
        user = self.selected_user_data
        user_id = user['user_id']
        
        self.log_message(f"Checking room access for {user['fullname']}...")
        
        try:
            # Check access via backend API
            access_info = backend_api.check_user_room_access(user_id)
            
            if access_info:
                if access_info.get('allowed', False):
                    self.log_message(f"✅ {user['fullname']} DIIZINKAN masuk ruangan")
                    self.log_message(f"Alasan: {access_info.get('reason', 'N/A')}")
                    
                    sessions = access_info.get('sessions', [])
                    if sessions:
                        self.log_message(f"Jadwal hari ini:")
                        for session in sessions:
                            self.log_message(f"  - {session.get('course_name', 'N/A')} "
                                           f"({session.get('start_time', 'N/A')}-{session.get('end_time', 'N/A')})")
                else:
                    self.log_message(f"❌ {user['fullname']} TIDAK DIIZINKAN masuk ruangan")
                    self.log_message(f"Alasan: {access_info.get('reason', 'N/A')}")
            else:
                self.log_message(f"⚠️ Tidak dapat memverifikasi akses untuk {user['fullname']}")
                
        except Exception as e:
            self.log_message(f"Error checking room access: {e}")
    
    def admin_capture_dataset(self):
        """Admin capture dataset for selected user"""
        if not hasattr(self, 'selected_user_data'):
            self.log_message("No user selected")
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
        
        user = self.selected_user_data
        
        # Confirm deletion
        result = messagebox.askyesno(
            "Konfirmasi Hapus",
            f"Apakah Anda yakin ingin menghapus model wajah untuk {user['fullname']}?"
        )
        
        if result:
            self.log_message(f"Deleting model for {user['fullname']}...")
            # Implementation for deleting model
            # TODO: Add delete model functionality
    
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
                    self.log_message("Model berhasil dilatih!")
                    self.window.after(0, lambda: messagebox.showinfo("Sukses", f"Dataset untuk {user_name} berhasil dicapture dan model dilatih!"))
                else:
                    self.log_message("Gagal melatih model")
                    self.window.after(0, lambda: messagebox.showerror("Error", "Gagal melatih model"))
            else:
                self.log_message("Gagal capture dataset")
                self.window.after(0, lambda: messagebox.showerror("Error", "Gagal capture dataset"))
                
        except Exception as e:
            self.log_message(f"Error in capture dataset: {e}")
    
    def _train_model_thread(self, user_id, user_name):
        """Thread method for training model"""
        try:
            # Check if dataset exists
            dataset_dir = f"datasets/employee_{user_id}"
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
                self.log_message("Model berhasil dilatih!")
                self.window.after(0, lambda: messagebox.showinfo("Sukses", f"Model untuk {user_name} berhasil dilatih!"))
            else:
                self.log_message("Gagal melatih model")
                self.window.after(0, lambda: messagebox.showerror("Error", "Gagal melatih model"))
                
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
        
    def create_reports_tab(self):
        # Reports tab
        reports_frame = ctk.CTkFrame(self.notebook)
        self.notebook.add(reports_frame, text="Laporan")
        
        # Date selection
        date_frame = ctk.CTkFrame(reports_frame)
        date_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(date_frame, text="Pilih Tanggal:", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w", padx=10, pady=(10, 5))
        
        self.date_var = tk.StringVar(value=datetime.now().strftime("%Y-%m-%d"))
        date_entry = ctk.CTkEntry(date_frame, textvariable=self.date_var, width=200)
        date_entry.pack(anchor="w", padx=10, pady=(0, 10))
        
        generate_btn = ctk.CTkButton(
            date_frame,
            text="Generate Report",
            command=self.generate_report,
            width=150
        )
        generate_btn.pack(anchor="w", padx=10, pady=10)
        
        # Report display
        report_frame = ctk.CTkFrame(reports_frame)
        report_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.report_tree = ttk.Treeview(report_frame, columns=("Name", "ClockIn", "ClockOut", "Status", "Method"), show="headings")
        self.report_tree.heading("Name", text="Nama")
        self.report_tree.heading("ClockIn", text="Masuk")
        self.report_tree.heading("ClockOut", text="Keluar")
        self.report_tree.heading("Status", text="Status")
        self.report_tree.heading("Method", text="Metode")
        
        self.report_tree.pack(fill="both", expand=True, padx=10, pady=10)
        
    def get_employee_list(self):
        """Get list of employees for dropdown"""
        try:
            query = """
            SELECT e.employee_id, u.fullname 
            FROM employees e
            JOIN users u ON e.user_id = u.user_id
            WHERE u.status = 'active'
            ORDER BY u.fullname
            """
            
            results = simple_db.execute_query(query)
            
            if results:
                return [f"{row['employee_id']} - {row['fullname']}" for row in results]
            else:
                return []
                
        except Exception as e:
            print(f"Error getting employee list: {e}")
            return []
            
    def start_camera(self):
        """Start camera for face recognition"""
        try:
            self.camera = cv2.VideoCapture(0)
            if not self.camera.isOpened():
                messagebox.showerror("Error", "Tidak dapat mengakses kamera")
                return
                
            self.camera_running = True
            self.start_camera_btn.configure(state="disabled")
            self.stop_camera_btn.configure(state="normal")
            
            # Load face models
            self.face_system.load_all_face_models()
            
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
                self.camera_frame.configure(image="", text="Kamera tidak aktif")
            
            if hasattr(self, 'log_recognition'):
                self.log_recognition("Kamera dihentikan")
        except Exception as e:
            print(f"Error in stop_camera: {e}")
            # Widget might have been destroyed, just continue
        
    def camera_loop(self):
        """Main camera loop for face recognition"""
        while self.camera_running:
            try:
                ret, frame = self.camera.read()
                if not ret:
                    break
                    
                # Resize frame for better performance
                frame = cv2.resize(frame, (640, 480))
                
                # Face recognition
                recognized_employees, face_locations = self.face_system.recognize_face(frame)
                
                # Draw rectangles and labels
                for (top, right, bottom, left) in face_locations:
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                    
                # Process recognized faces
                for employee in recognized_employees:
                    cv2.putText(frame, 
                              f"{employee['name']} ({employee['confidence']:.2f})", 
                              (left, top - 10), 
                              cv2.FONT_HERSHEY_SIMPLEX, 
                              0.7, (0, 255, 0), 2)
                    
                    # Auto-mark attendance if confidence is high
                    if employee['confidence'] > 0.6:
                        # Check room access before marking attendance
                        access_result = self.verify_room_access_and_attendance(
                            employee['employee_id'], 
                            employee['name'],
                            employee['confidence']
                        )
                        
                        if access_result['success']:
                            self.log_recognition(f"✅ Akses diberikan: {employee['name']}")
                            # Refresh attendance display
                            self.window.after(0, self.refresh_attendance_data)
                        else:
                            self.log_recognition(f"❌ Akses ditolak: {employee['name']} - {access_result['reason']}")
                        
                # Convert frame for tkinter display
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                img = Image.fromarray(frame_rgb)
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
    
    def verify_room_access_and_attendance(self, employee_id, employee_name, confidence):
        """
        Verify if employee has room access and mark attendance accordingly
        Returns: dict with success status and reason
        """
        try:
            # First check if user has room access today
            access_info = backend_api.check_user_room_access(employee_id)
            
            if not access_info:
                # Log denied access attempt
                backend_api.log_door_access(
                    employee_id, 
                    access_type='face_recognition',
                    access_status='denied',
                    confidence_score=confidence,
                    reason='Cannot verify room access - backend unavailable'
                )
                return {
                    'success': False,
                    'reason': 'Tidak dapat memverifikasi akses ruangan'
                }
            
            if not access_info.get('allowed', False):
                # Log denied access attempt
                backend_api.log_door_access(
                    employee_id, 
                    access_type='face_recognition',
                    access_status='denied',
                    confidence_score=confidence,
                    reason=access_info.get('reason', 'No scheduled classes today')
                )
                return {
                    'success': False,
                    'reason': access_info.get('reason', 'Tidak ada jadwal kelas hari ini')
                }
            
            # User has access, now try to mark attendance
            success, message = self.face_system.mark_attendance(employee_id, confidence)
            
            if success:
                # Log successful access
                sessions = access_info.get('sessions', [])
                session_id = sessions[0].get('session_id') if sessions else None
                
                backend_api.log_door_access(
                    employee_id, 
                    access_type='face_recognition',
                    access_status='granted',
                    confidence_score=confidence,
                    reason='Valid attendance marked',
                    session_id=session_id
                )
                
                return {
                    'success': True,
                    'reason': 'Absensi berhasil dicatat'
                }
            else:
                # Attendance failed (probably already marked)
                backend_api.log_door_access(
                    employee_id, 
                    access_type='face_recognition',
                    access_status='denied',
                    confidence_score=confidence,
                    reason=f'Attendance marking failed: {message}'
                )
                
                return {
                    'success': False,
                    'reason': message
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
        
    def capture_dataset(self):
        """Capture face dataset for current logged in user"""
        if not self.current_employee_id:
            messagebox.showerror("Error", "Akun Anda belum terdaftar sebagai karyawan. Hubungi administrator.")
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
                    self.log_process("Model berhasil dilatih!")
                    messagebox.showinfo("Sukses", "Dataset berhasil dicapture dan model dilatih!")
                    # Refresh models list
                    self.refresh_models_list()
                else:
                    self.log_process("Gagal melatih model")
                    messagebox.showerror("Error", "Gagal melatih model")
            else:
                self.log_process("Gagal capture dataset")
                messagebox.showerror("Error", "Gagal capture dataset")
                
        # Run in separate thread
        thread = threading.Thread(target=capture_thread)
        thread.daemon = True
        thread.start()
        
    def train_model(self):
        """Train model for current logged in user"""
        if not self.current_employee_id:
            messagebox.showerror("Error", "Akun Anda belum terdaftar sebagai karyawan. Hubungi administrator.")
            return
        
        # Check if dataset exists
        dataset_dir = f"datasets/employee_{self.current_employee_id}"
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
                    self.log_process("Model berhasil dilatih!")
                    messagebox.showinfo("Sukses", "Model berhasil dilatih!")
                    # Refresh models list
                    self.refresh_models_list()
                else:
                    self.log_process("Gagal melatih model")
                    messagebox.showerror("Error", "Gagal melatih model")
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
        
        if messagebox.askyesno("Konfirmasi", f"Hapus model untuk {self.current_employee_name}?"):
            success = self.face_system.delete_employee_model(self.current_employee_id)
            
            if success:
                self.log_process(f"Model {self.current_employee_name} berhasil dihapus")
                messagebox.showinfo("Sukses", "Model berhasil dihapus")
                # Refresh models list
                self.refresh_models_list()
            else:
                messagebox.showerror("Error", "Gagal menghapus model")
                
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
                
            # Get today's attendance
            today = datetime.now().date()
            query = """
            SELECT u.fullname, a.clock_in, a.status
            FROM attendance a
            JOIN employees e ON a.employee_id = e.employee_id
            JOIN users u ON e.user_id = u.user_id
            WHERE DATE(a.date) = %s
            ORDER BY a.clock_in DESC
            """
            
            results = simple_db.execute_query(query, (today,))
            
            if results:
                for row in results:
                    clock_in = row['clock_in'].strftime("%H:%M") if row['clock_in'] else "-"
                    self.attendance_tree.insert("", "end", values=(
                        row['fullname'],
                        clock_in,
                        row['status']
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
                
            query = """
            SELECT ft.employee_id, u.fullname, ft.created_at, ft.status
            FROM face_training ft
            JOIN users u ON ft.employee_id = u.user_id
            WHERE ft.status = 'active'
            ORDER BY ft.created_at DESC
            """
            
            results = simple_db.execute_query(query)
            
            if results:
                for row in results:
                    status = "Aktif" if row['status'] == 'active' else "Tidak Aktif"
                    created_date = row['created_at'].strftime('%Y-%m-%d %H:%M') if row['created_at'] else 'N/A'
                    
                    self.models_tree.insert("", "end", values=(
                        row['employee_id'],
                        row['fullname'],
                        created_date,
                        status
                    ))
                    
        except Exception as e:
            print(f"Error refreshing models list: {e}")
            # Don't show error dialog, just log it
            
    def generate_report(self):
        """Generate attendance report for selected date"""
        try:
            selected_date = self.date_var.get()
            
            # Clear existing items
            for item in self.report_tree.get_children():
                self.report_tree.delete(item)
                
            query = """
            SELECT u.fullname, a.clock_in, a.clock_out, a.status, a.verification_method
            FROM attendance a
            JOIN employees e ON a.employee_id = e.employee_id
            JOIN users u ON e.user_id = u.user_id
            WHERE DATE(a.date) = %s
            ORDER BY a.clock_in
            """
            
            results = simple_db.execute_query(query, (selected_date,))
            
            if results:
                for row in results:
                    clock_in = row['clock_in'].strftime("%H:%M") if row['clock_in'] else "-"
                    clock_out = row['clock_out'].strftime("%H:%M") if row['clock_out'] else "-"
                    method = row['verification_method'] or "manual"
                    
                    self.report_tree.insert("", "end", values=(
                        row['fullname'],
                        clock_in,
                        clock_out,
                        row['status'],
                        method
                    ))
            else:
                messagebox.showinfo("Info", "Tidak ada data untuk tanggal tersebut")
                
        except Exception as e:
            print(f"Error generating report: {e}")
            messagebox.showerror("Error", f"Error generating report: {e}")
            
    def run(self):
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
            except Exception as e:
                print(f"Error during cleanup: {e}")
            finally:
                try:
                    self.window.destroy()
                except:
                    pass
        
        self.window.protocol("WM_DELETE_WINDOW", on_closing)
        
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
            except Exception as e:
                print(f"Error in final cleanup: {e}")

def main():
    # First show login window
    login = LoginWindow()
    login.run()

if __name__ == "__main__":
    main()
