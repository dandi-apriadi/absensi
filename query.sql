-- ===============================================
-- INSERT DATA DUMMY UNTUK SISTEM ABSENSI
-- ===============================================

-- 1. INSERT USER SUPER ADMIN
INSERT INTO `users` (
    `user_id`, `email`, `password`, `full_name`, `role`, `status`, 
    `phone`, `address`, `admin_level`, `permissions`, `department_access`,
    `birth_date`, `gender`, `emergency_contact`, `emergency_phone`,
    `created_at`, `updated_at`
) VALUES (
    'ADM001', 
    'dandiapeiadi22@gmail.com', 
    '$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8',
    'Dandi Apeiadi', 
    'super-admin', 
    'active',
    '081234567890',
    'Jl. Admin No. 1, Jakarta',
    'system_admin',
    '["user_management", "system_settings", "reports", "security"]',
    '["Teknik Informatika", "Sistem Informasi", "Teknik Komputer"]',
    '1995-06-22',
    'male',
    'Admin Emergency Contact',
    '081987654321',
    NOW(),
    NOW()
);

-- 2. INSERT USER LECTURER (DOSEN)
INSERT INTO `users` (
    `user_id`, `email`, `password`, `full_name`, `role`, `status`,
    `phone`, `address`, `department`, `position`, `specialization`, 
    `education_level`, `office_room`, `employee_id`,
    `birth_date`, `gender`, `emergency_contact`, `emergency_phone`,
    `created_at`, `updated_at`
) VALUES (
    'NIP123456789',
    'dosen.informatika@university.ac.id',
    '$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8',
    'Dr. Ahmad Lecturer',
    'lecturer',
    'active',
    '081345678901',
    'Jl. Dosen No. 123, Bandung',
    'Teknik Informatika',
    'Dosen',
    'Machine Learning, Artificial Intelligence',
    'S3',
    'R.301',
    'NIP123456789',
    '1980-01-15',
    'male',
    'Emergency Lecturer',
    '081123456789',
    NOW(),
    NOW()
);

-- 3. INSERT USER STUDENT (MAHASISWA)
INSERT INTO `users` (
    `user_id`, `email`, `password`, `full_name`, `role`, `status`,
    `phone`, `address`, `program_study`, `semester`, `academic_year`, 
    `entrance_year`, `gpa`, `guardian_name`, `guardian_phone`,
    `birth_date`, `gender`, `emergency_contact`, `emergency_phone`,
    `created_at`, `updated_at`
) VALUES (
    'NIM20220001',
    'mahasiswa.informatika@student.ac.id',
    '$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8',
    'Budi Student',
    'student',
    'active',
    '081456789012',
    'Jl. Mahasiswa No. 456, Jakarta',
    'Teknik Informatika',
    6,
    '2024/2025',
    2022,
    3.75,
    'Pak Budi Senior',
    '081234567890',
    '2003-03-10',
    'male',
    'Emergency Student',
    '081987654321',
    NOW(),
    NOW()
);

-- 4. INSERT COURSES
INSERT INTO `courses` (
    `course_code`, `course_name`, `credits`, `semester`, `program_study`, 
    `description`, `prerequisites`, `status`, `created_at`
) VALUES 
('IF101', 'Pemrograman Dasar', 3, 1, 'Teknik Informatika', 'Mata kuliah pemrograman dasar menggunakan Python', '[]', 'active', NOW()),
('IF201', 'Struktur Data', 3, 2, 'Teknik Informatika', 'Mata kuliah struktur data dan algoritma', '["IF101"]', 'active', NOW()),
('IF301', 'Machine Learning', 3, 6, 'Teknik Informatika', 'Mata kuliah pembelajaran mesin', '["IF201"]', 'active', NOW());

-- 5. INSERT ROOMS
INSERT INTO `rooms` (
    `room_code`, `room_name`, `building`, `floor`, `capacity`, `room_type`, 
    `facilities`, `has_face_recognition`, `door_access_code`, `status`, `created_at`
) VALUES 
('R101', 'Ruang Kuliah 101', 'Gedung A', 1, 40, 'classroom', '["projector", "ac", "whiteboard"]', 1, 'DOOR001', 'available', NOW()),
('LAB01', 'Lab Komputer 1', 'Gedung B', 2, 30, 'laboratory', '["computers", "projector", "ac"]', 1, 'LAB001', 'available', NOW()),
('AUD01', 'Auditorium Utama', 'Gedung C', 1, 200, 'auditorium', '["sound_system", "projector", "ac", "stage"]', 1, 'AUD001', 'available', NOW());

-- 6. INSERT COURSE CLASSES
INSERT INTO `course_classes` (
    `course_id`, `lecturer_id`, `class_name`, `academic_year`, `semester_period`, 
    `max_students`, `room_id`, `schedule`, `status`, `created_at`
) VALUES 
(1, 2, 'A', '2024/2025', 'genap', 40, 1, '[{"day": "Monday", "start_time": "08:00", "end_time": "10:30", "room_id": 1}]', 'active', NOW()),
(2, 2, 'A', '2024/2025', 'genap', 35, 2, '[{"day": "Wednesday", "start_time": "10:30", "end_time": "13:00", "room_id": 2}]', 'active', NOW()),
(3, 2, 'A', '2024/2025', 'genap', 30, 1, '[{"day": "Friday", "start_time": "13:00", "end_time": "15:30", "room_id": 1}]', 'active', NOW());

-- 7. INSERT STUDENT ENROLLMENTS
INSERT INTO `student_enrollments` (
    `student_id`, `class_id`, `enrollment_date`, `status`, `final_grade`, `final_score`
) VALUES 
(3, 1, '2024-08-15 00:00:00', 'enrolled', NULL, NULL),
(3, 2, '2024-08-15 00:00:00', 'enrolled', NULL, NULL),
(3, 3, '2024-08-15 00:00:00', 'enrolled', NULL, NULL);

-- 8. INSERT ATTENDANCE SESSIONS
INSERT INTO `attendance_sessions` (
    `class_id`, `session_number`, `session_date`, `start_time`, `end_time`, 
    `room_id`, `topic`, `session_type`, `attendance_method`, `qr_code`, 
    `qr_expire_time`, `attendance_open_time`, `attendance_close_time`, 
    `status`, `notes`, `created_by`, `created_at`, `updated_at`
) VALUES 
(1, 1, '2025-06-20', '08:00:00', '10:30:00', 1, 'Pengenalan Python', 'regular', 'face_recognition', 'QR123456', '2025-06-20 10:30:00', '2025-06-20 07:45:00', '2025-06-20 08:15:00', 'completed', 'Sesi pertama berjalan lancar', 2, NOW(), NOW()),
(2, 1, '2025-06-20', '10:30:00', '13:00:00', 2, 'Array dan Linked List', 'regular', 'face_recognition', 'QR789012', '2025-06-20 13:00:00', '2025-06-20 10:15:00', '2025-06-20 10:45:00', 'completed', 'Lab praktikum struktur data', 2, NOW(), NOW()),
(3, 1, '2025-06-20', '13:00:00', '15:30:00', 1, 'Supervised Learning', 'regular', 'face_recognition', 'QR345678', '2025-06-20 15:30:00', '2025-06-20 12:45:00', '2025-06-20 13:15:00', 'ongoing', 'Kelas Machine Learning tingkat lanjut', 2, NOW(), NOW());

-- 9. INSERT STUDENT ATTENDANCES
INSERT INTO `student_attendances` (
    `session_id`, `student_id`, `status`, `check_in_time`, `check_out_time`, 
    `attendance_method`, `confidence_score`, `location_lat`, `location_lng`, 
    `notes`, `verified_by`, `verified_at`, `created_at`, `updated_at`
) VALUES 
(1, 3, 'present', '2025-06-20 08:05:00', '2025-06-20 10:25:00', 'face_recognition', 0.9876, -6.2088, 106.8456, 'Hadir tepat waktu', NULL, NULL, NOW(), NOW()),
(2, 3, 'present', '2025-06-20 10:35:00', '2025-06-20 12:55:00', 'face_recognition', 0.9823, -6.2088, 106.8456, 'Hadir dan aktif di lab', NULL, NULL, NOW(), NOW()),
(3, 3, 'present', '2025-06-20 13:05:00', NULL, 'face_recognition', 0.9901, -6.2088, 106.8456, 'Sedang mengikuti kelas', NULL, NULL, NOW(), NOW());

-- 10. INSERT FACE DATASETS
INSERT INTO `face_datasets` (
    `user_id`, `image_path`, `image_name`, `encoding_data`, `image_quality`, 
    `face_landmarks`, `is_primary`, `verification_status`, `verified_by`, 
    `verified_at`, `upload_method`, `created_at`
) VALUES 
(1, '/uploads/faces/admin_001_1.jpg', 'admin_face_primary.jpg', '[0.123, 0.456, 0.789, 0.234]', 'excellent', '[{"x": 150, "y": 200}, {"x": 180, "y": 195}]', 1, 'approved', 1, NOW(), 'single_upload', NOW()),
(2, '/uploads/faces/lecturer_001_1.jpg', 'lecturer_face_primary.jpg', '[0.234, 0.567, 0.890, 0.345]', 'good', '[{"x": 155, "y": 205}, {"x": 185, "y": 200}]', 1, 'approved', 1, NOW(), 'single_upload', NOW()),
(3, '/uploads/faces/student_001_1.jpg', 'student_face_primary.jpg', '[0.345, 0.678, 0.901, 0.456]', 'excellent', '[{"x": 160, "y": 210}, {"x": 190, "y": 205}]', 1, 'approved', 2, NOW(), 'single_upload', NOW());

-- 11. INSERT FACE RECOGNITION LOGS
INSERT INTO `face_recognition_logs` (
    `session_id`, `recognized_user_id`, `confidence_score`, `captured_image_path`, 
    `recognition_status`, `processing_time`, `camera_id`, `room_id`, `created_at`
) VALUES 
(1, 3, 0.9876, '/logs/recognition/20250620_080500_student.jpg', 'success', 150, 'CAM_R101_01', 1, '2025-06-20 08:05:00'),
(2, 3, 0.9823, '/logs/recognition/20250620_103500_student.jpg', 'success', 145, 'CAM_LAB01_01', 2, '2025-06-20 10:35:00'),
(3, 3, 0.9901, '/logs/recognition/20250620_130500_student.jpg', 'success', 132, 'CAM_R101_01', 1, '2025-06-20 13:05:00');

-- 12. INSERT NOTIFICATIONS
INSERT INTO `notifications` (
    `recipient_id`, `sender_id`, `type`, `title`, `message`, `data`, 
    `priority`, `is_read`, `read_at`, `delivery_method`, `scheduled_at`, 
    `expires_at`, `created_at`
) VALUES 
(3, 2, 'attendance_reminder', 'Reminder: Kelas Machine Learning', 'Jangan lupa hadir di kelas Machine Learning hari ini pukul 13:00', '{"class_id": 3, "session_id": 3}', 'normal', 0, NULL, '["push", "email"]', NULL, '2025-06-21 15:30:00', NOW()),
(1, NULL, 'system_maintenance', 'Maintenance Terjadwal', 'Sistem akan maintenance pada malam hari untuk update', '{"maintenance_window": "23:00-01:00"}', 'high', 1, NOW(), '["email"]', '2025-06-20 22:00:00', '2025-06-21 02:00:00', NOW());

-- 13. INSERT DOOR ACCESS LOGS
INSERT INTO `door_access_logs` (
    `room_id`, `user_id`, `access_type`, `access_status`, `confidence_score`, 
    `reason`, `accessed_at`, `session_id`
) VALUES 
(1, 2, 'face_recognition', 'granted', 0.9856, 'Lecturer access for teaching', '2025-06-20 07:55:00', 1),
(1, 3, 'face_recognition', 'granted', 0.9876, 'Student access for class', '2025-06-20 08:05:00', 1),
(2, 3, 'face_recognition', 'granted', 0.9823, 'Student access for lab', '2025-06-20 10:35:00', 2);

-- 14. INSERT ROOM ACCESS PERMISSIONS
INSERT INTO `room_access_permissions` (
    `user_id`, `room_id`, `permission_type`, `start_date`, `end_date`, 
    `time_restrictions`, `granted_by`, `is_active`, `created_at`
) VALUES 
(2, 1, 'scheduled_access', '2025-06-01', '2025-12-31', '[{"day": "Monday", "start": "07:30", "end": "11:00"}]', 1, 1, NOW()),
(2, 2, 'scheduled_access', '2025-06-01', '2025-12-31', '[{"day": "Wednesday", "start": "10:00", "end": "13:30"}]', 1, 1, NOW()),
(3, 1, 'limited_access', '2025-06-01', '2025-12-31', '[{"day": "Monday", "start": "08:00", "end": "10:30"}]', 1, 1, NOW());

-- 15. INSERT SYSTEM LOGS
INSERT INTO `system_logs` (
    `user_id`, `action`, `table_name`, `record_id`, `old_values`, `new_values`, 
    `ip_address`, `user_agent`, `session_id`, `severity`, `created_at`
) VALUES 
(1, 'create_user', 'users', 3, NULL, '{"role": "student", "full_name": "Budi Student"}', '192.168.1.100', 'Mozilla/5.0 Admin Browser', 'sess_admin_001', 'info', NOW()),
(2, 'create_session', 'attendance_sessions', 1, NULL, '{"class_id": 1, "topic": "Pengenalan Python"}', '192.168.1.101', 'Mozilla/5.0 Lecturer Browser', 'sess_lecturer_001', 'info', NOW()),
(3, 'check_in', 'student_attendances', 1, NULL, '{"status": "present", "method": "face_recognition"}', '192.168.1.102', 'Mozilla/5.0 Student Browser', 'sess_student_001', 'info', NOW());

-- 16. INSERT SYSTEM SETTINGS
INSERT INTO `system_settings` (
    `setting_key`, `setting_value`, `setting_type`, `category`, `description`, 
    `is_public`, `updated_by`, `updated_at`
) VALUES 
('face_recognition_threshold', '0.8', 'string', 'attendance', 'Minimum confidence score for face recognition', 0, 1, NOW()),
('attendance_window_minutes', '15', 'integer', 'attendance', 'Minutes before/after class start time for attendance', 0, 1, NOW()),
('max_file_upload_size', '10485760', 'integer', 'system', 'Maximum file upload size in bytes (10MB)', 1, 1, NOW()),
('notification_email_enabled', 'true', 'boolean', 'notification', 'Enable email notifications', 1, 1, NOW()),
('system_maintenance_mode', 'false', 'boolean', 'system', 'Enable maintenance mode', 0, 1, NOW());

-- 17. INSERT SESSIONS (Sample session data)
INSERT INTO `sessions` (
    `sid`, `expires`, `data`, `createdAt`, `updatedAt`
) VALUES 
('sess_admin_dandi_001', '2025-06-21 20:00:00', '{"userId": 1, "userRole": "super-admin", "email": "dandiapeiadi22@gmail.com"}', NOW(), NOW()),
('sess_lecturer_001', '2025-06-21 18:00:00', '{"userId": 2, "userRole": "lecturer", "email": "dosen.informatika@university.ac.id"}', NOW(), NOW()),
('sess_student_001', '2025-06-21 16:00:00', '{"userId": 3, "userRole": "student", "email": "mahasiswa.informatika@student.ac.id"}', NOW(), NOW());

-- ===============================================
-- QUERY VERIFIKASI DATA
-- ===============================================

-- Cek semua users
SELECT id, user_id, email, full_name, role, status FROM users;

-- Cek enrollment mahasiswa
SELECT 
    u.full_name as student_name,
    c.course_name,
    cc.class_name,
    se.status as enrollment_status
FROM student_enrollments se
JOIN users u ON se.student_id = u.id
JOIN course_classes cc ON se.class_id = cc.id
JOIN courses c ON cc.course_id = c.id;

-- Cek attendance hari ini
SELECT 
    u.full_name as student_name,
    c.course_name,
    ats.topic,
    sa.status as attendance_status,
    sa.check_in_time
FROM student_attendances sa
JOIN users u ON sa.student_id = u.id
JOIN attendance_sessions ats ON sa.session_id = ats.id
JOIN course_classes cc ON ats.class_id = cc.id
JOIN courses c ON cc.course_id = c.id
WHERE DATE(ats.session_date) = CURDATE();
