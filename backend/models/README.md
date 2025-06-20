# Database Models Documentation

## Overview
Sistem manajemen absensi dengan face recognition ini memiliki struktur database yang komprehensif yang terdiri dari 15 tabel utama yang saling berelasi. Models dibagi menjadi 4 kategori utama berdasarkan fungsinya.

## File Structure
```
backend/models/
├── index.js                    # Main model file with all relationships
├── userManagementModel.js      # User, Student, Lecturer, SuperAdmin models
├── courseManagementModel.js    # Course, Room, CourseClass, StudentEnrollment models
├── attendanceModel.js          # Attendance, FaceDataset, FaceRecognition models
└── systemModel.js              # Notification, DoorAccess, SystemLog models
```

## Model Categories

### 1. User Management Models (`userManagementModel.js`)
#### Users
- **Purpose**: Tabel utama untuk semua pengguna sistem
- **Key Fields**: 
  - `user_id`: Identifier unik (NIM/NIP/Admin ID)
  - `role`: student, lecturer, super-admin
  - `status`: active, inactive, suspended
- **Relationships**: 
  - 1:1 dengan Students, Lecturers, atau SuperAdmins

#### Students
- **Purpose**: Detail khusus mahasiswa
- **Key Fields**: 
  - `nim`: Nomor Induk Mahasiswa
  - `program_study`: Program studi
  - `semester`, `gpa`: Data akademik
- **Relationships**: 
  - belongsTo Users
  - hasMany StudentEnrollments, StudentAttendances

#### Lecturers
- **Purpose**: Detail khusus dosen
- **Key Fields**: 
  - `nip`: Nomor Induk Pegawai
  - `department`: Departemen
  - `position`: Jabatan (Dosen, Asisten Dosen, etc.)
- **Relationships**: 
  - belongsTo Users
  - hasMany CourseClasses, AttendanceSessions

#### SuperAdmins
- **Purpose**: Detail khusus super admin
- **Key Fields**: 
  - `admin_level`: system_admin, faculty_admin, it_admin
  - `permissions`: JSON array izin khusus
- **Relationships**: 
  - belongsTo Users

### 2. Course Management Models (`courseManagementModel.js`)
#### Courses
- **Purpose**: Master data mata kuliah
- **Key Fields**: 
  - `course_code`: Kode mata kuliah
  - `credits`: SKS
  - `program_study`: Program studi
- **Relationships**: 
  - hasMany CourseClasses

#### Rooms
- **Purpose**: Master data ruangan
- **Key Fields**: 
  - `room_code`: Kode ruangan
  - `capacity`: Kapasitas
  - `has_face_recognition`: Fitur face recognition
- **Relationships**: 
  - hasMany CourseClasses, AttendanceSessions, DoorAccessLogs

#### CourseClasses
- **Purpose**: Kelas spesifik per semester
- **Key Fields**: 
  - `class_name`: Nama kelas (A, B, C)
  - `academic_year`: Tahun akademik
  - `schedule`: JSON jadwal perkuliahan
- **Relationships**: 
  - belongsTo Courses, Lecturers, Rooms
  - hasMany StudentEnrollments, AttendanceSessions

#### StudentEnrollments
- **Purpose**: Pendaftaran mahasiswa ke kelas
- **Key Fields**: 
  - `status`: enrolled, dropped, completed
  - `final_grade`: Nilai akhir
- **Relationships**: 
  - belongsTo Students, CourseClasses

### 3. Attendance Models (`attendanceModel.js`)
#### AttendanceSessions
- **Purpose**: Sesi perkuliahan untuk absensi
- **Key Fields**: 
  - `session_number`: Nomor pertemuan
  - `attendance_method`: face_recognition, qr_code, manual
  - `qr_code`: Data QR code untuk absensi
  - `status`: scheduled, ongoing, completed, cancelled
- **Relationships**: 
  - belongsTo CourseClasses, Rooms, Lecturers
  - hasMany StudentAttendances, FaceRecognitionLogs

#### StudentAttendances
- **Purpose**: Record kehadiran mahasiswa
- **Key Fields**: 
  - `status`: present, absent, late, excused, sick
  - `attendance_method`: Metode absensi yang digunakan
  - `confidence_score`: Skor confidence face recognition
- **Relationships**: 
  - belongsTo AttendanceSessions, Students, Users (verifier)

#### FaceDatasets
- **Purpose**: Dataset foto wajah untuk recognition
- **Key Fields**: 
  - `image_path`: Path file foto
  - `encoding_data`: JSON data encoding wajah
  - `verification_status`: pending, approved, rejected
  - `is_primary`: Foto utama untuk recognition
- **Relationships**: 
  - belongsTo Users (owner & verifier)

#### FaceRecognitionLogs
- **Purpose**: Log proses face recognition
- **Key Fields**: 
  - `confidence_score`: Skor kepercayaan
  - `recognition_status`: success, failed, low_confidence
  - `processing_time`: Waktu pemrosesan (ms)
- **Relationships**: 
  - belongsTo AttendanceSessions, Users, Rooms

### 4. System Models (`systemModel.js`)
#### Notifications
- **Purpose**: Sistem notifikasi
- **Key Fields**: 
  - `type`: Jenis notifikasi (attendance_reminder, etc.)
  - `priority`: low, normal, high, urgent
  - `delivery_method`: JSON array metode pengiriman
- **Relationships**: 
  - belongsTo Users (recipient & sender)

#### DoorAccessLogs
- **Purpose**: Log akses pintu ruangan
- **Key Fields**: 
  - `access_type`: face_recognition, keycard, manual_override
  - `access_status`: granted, denied, forced
- **Relationships**: 
  - belongsTo Rooms, Users

#### RoomAccessPermissions
- **Purpose**: Izin akses ruangan
- **Key Fields**: 
  - `permission_type`: full_access, scheduled_access, limited_access
  - `time_restrictions`: JSON pembatasan waktu
- **Relationships**: 
  - belongsTo Users (user & grantor), Rooms

#### SystemLogs
- **Purpose**: Audit trail sistem
- **Key Fields**: 
  - `action`: Aksi yang dilakukan
  - `old_values`, `new_values`: Data sebelum/sesudah
  - `severity`: info, warning, error, critical
- **Relationships**: 
  - belongsTo Users

#### SystemSettings
- **Purpose**: Konfigurasi sistem
- **Key Fields**: 
  - `setting_key`: Kunci setting
  - `setting_type`: string, integer, boolean, json
  - `is_public`: Bisa diakses non-admin
- **Relationships**: 
  - belongsTo Users (updater)

## Key Relationships Summary

### Primary Relationships (1:many)
1. **Users** → Students/Lecturers/SuperAdmins (1:1)
2. **Courses** → CourseClasses (1:many)
3. **Lecturers** → CourseClasses (1:many)
4. **CourseClasses** → StudentEnrollments, AttendanceSessions (1:many)
5. **AttendanceSessions** → StudentAttendances, FaceRecognitionLogs (1:many)
6. **Users** → FaceDatasets, Notifications (1:many)
7. **Rooms** → CourseClasses, AttendanceSessions, DoorAccessLogs (1:many)

### Complex Relationships
- **Students** → StudentEnrollments → CourseClasses (many:many melalui junction table)
- **Users** dapat berperan sebagai recipient DAN sender untuk Notifications
- **Users** dapat menjadi verifier untuk FaceDatasets DAN StudentAttendances

## Usage Examples

### 1. Import Models
```javascript
// Import all models
import { 
    Users, Students, Lecturers, 
    Courses, CourseClasses,
    AttendanceSessions, StudentAttendances 
} from './models/index.js';

// Or import specific category
import { Users, Students } from './models/userManagementModel.js';
```

### 2. Create User with Role Details
```javascript
// Create student
const newUser = await Users.create({
    user_id: '2024001',
    email: 'student@example.com',
    password: 'hashedPassword',
    full_name: 'John Doe',
    role: 'student'
});

const studentDetail = await Students.create({
    user_id: newUser.id,
    nim: '2024001',
    program_study: 'Teknik Informatika',
    semester: 1,
    academic_year: '2024/2025',
    entry_year: 2024
});
```

### 3. Get User with Role Details
```javascript
import { getUserWithRoleDetails } from './models/index.js';

const user = await getUserWithRoleDetails(1);
// Returns user with studentDetail/lecturerDetail/superAdminDetail based on role
```

### 4. Get Course Class with Complete Details
```javascript
import { getCourseClassDetails } from './models/index.js';

const courseClass = await getCourseClassDetails(1);
// Returns class with course, lecturer, room, and enrolled students
```

### 5. Sync Database
```javascript
import { syncModels } from './models/index.js';

// Development - recreate tables
await syncModels({ force: true });

// Production - only add new columns
await syncModels({ alter: true });
```

## Database Indexes
Setiap model sudah dilengkapi dengan indexes yang optimal untuk performa query:
- **Primary keys**: Auto-indexed
- **Foreign keys**: Indexed untuk JOIN operations
- **Search fields**: email, user_id, nim, nip, course_code, etc.
- **Filter fields**: status, role, verification_status, etc.
- **Composite indexes**: Untuk query yang sering menggunakan multiple conditions

## Business Rules Implemented
1. **User Role Consistency**: User hanya bisa memiliki satu role detail
2. **Enrollment Validation**: Student hanya bisa enroll ke kelas sesuai program_study
3. **Attendance Session**: Harus dalam rentang waktu jadwal kelas
4. **Face Dataset**: Harus diverifikasi sebelum digunakan untuk recognition
5. **Room Access**: Permission otomatis expire berdasarkan end_date
6. **Cascade Deletes**: Data terkait otomatis terhapus saat parent dihapus
7. **Audit Trail**: Semua perubahan data penting tercatat di SystemLogs

## Migration Strategy
Untuk project existing, lakukan migration bertahap:
1. Backup database lama
2. Run sync dengan `alter: true` untuk preserve data
3. Migrate data dari struktur lama ke struktur baru
4. Update controllers untuk menggunakan model baru
5. Test semua functionality

## Performance Considerations
- Gunakan `include` dengan hati-hati untuk avoid N+1 queries
- Implementasikan pagination untuk list queries
- Gunakan `attributes` untuk limit fields yang di-select
- Pertimbangkan connection pooling untuk high-traffic
- Monitor query performance dengan logging
