# Dokumentasi Controller Sistem Absensi

## Overview
Sistem Absensi telah dilengkapi dengan controller-controller lengkap untuk mengelola semua aspek sistem kehadiran. Dokumentasi ini menjelaskan setiap controller dan endpoint yang tersedia.

## Structure Controller

### 1. Shared Controllers (Semua Role)

#### 1.1 Authentication Controller (`authController.js`)
**Path**: `backend/controllers/shared/authController.js`
**Endpoints**:
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru
- `GET /api/auth/profile` - Mendapatkan profil user
- `PUT /api/auth/profile` - Update profil user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Ganti password

#### 1.2 Dashboard Controller (`dashboardController.js`)
**Path**: `backend/controllers/shared/dashboardController.js`
**Endpoints**:
- `GET /api/dashboard/super-admin` - Dashboard Super Admin
- `GET /api/dashboard/lecturer` - Dashboard Dosen
- `GET /api/dashboard/student` - Dashboard Mahasiswa

#### 1.3 Notification Controller (`notificationController.js`)
**Path**: `backend/controllers/shared/notificationController.js`
**Endpoints**:
- `GET /api/notifications/` - Mendapatkan notifikasi user
- `GET /api/notifications/unread-count` - Jumlah notifikasi belum dibaca
- `PATCH /api/notifications/:id/read` - Tandai notifikasi dibaca
- `PATCH /api/notifications/read-all` - Tandai semua notifikasi dibaca
- `DELETE /api/notifications/:id` - Hapus notifikasi
- `POST /api/notifications/send` - Kirim notifikasi (Admin/Lecturer)
- `POST /api/notifications/broadcast` - Broadcast notifikasi (Admin/Lecturer)

#### 1.4 Attendance Controller (`attendanceController.js`)
**Path**: `backend/controllers/shared/attendanceController.js`
**Endpoints**:
- `POST /api/attendance/sessions` - Buat sesi kehadiran (Lecturer)
- `GET /api/attendance/sessions/class/:course_class_id` - Ambil sesi kehadiran kelas
- `PATCH /api/attendance/sessions/:id/start` - Mulai sesi kehadiran
- `PATCH /api/attendance/sessions/:id/end` - Akhiri sesi kehadiran
- `POST /api/attendance/record` - Catat kehadiran manual
- `POST /api/attendance/record/face` - Catat kehadiran via face recognition
- `GET /api/attendance/session/:session_id` - Ambil data kehadiran sesi
- `PATCH /api/attendance/records/:id` - Update status kehadiran
- `GET /api/attendance/statistics/class/:course_class_id` - Statistik kehadiran kelas

#### 1.5 Course Controller (`courseController.js`)
**Path**: `backend/controllers/shared/courseController.js`
**Endpoints**:
- `GET /api/courses/` - Ambil semua mata kuliah
- `POST /api/courses/` - Buat mata kuliah baru (Super Admin)
- `PUT /api/courses/:id` - Update mata kuliah (Super Admin)
- `DELETE /api/courses/:id` - Hapus mata kuliah (Super Admin)
- `GET /api/courses/:course_id/classes` - Ambil kelas mata kuliah
- `POST /api/courses/classes` - Buat kelas baru
- `GET /api/courses/classes/:class_id/enrollments` - Ambil pendaftaran kelas
- `POST /api/courses/enrollments` - Daftarkan mahasiswa ke kelas
- `PATCH /api/courses/enrollments/:id/status` - Update status pendaftaran

#### 1.6 Room Controller (`roomController.js`)
**Path**: `backend/controllers/shared/roomController.js`
**Endpoints**:
- `GET /api/rooms/` - Ambil semua ruangan
- `GET /api/rooms/:id` - Ambil ruangan by ID
- `POST /api/rooms/` - Buat ruangan baru (Super Admin)
- `PUT /api/rooms/:id` - Update ruangan (Super Admin)
- `DELETE /api/rooms/:id` - Hapus ruangan (Super Admin)
- `GET /api/rooms/:id/schedule` - Jadwal ruangan
- `GET /api/rooms/:id/availability` - Cek ketersediaan ruangan
- `GET /api/rooms/:id/access-history` - Riwayat akses ruangan

#### 1.7 Report Controller (`reportController.js`)
**Path**: `backend/controllers/shared/reportController.js`
**Endpoints**:
- `GET /api/reports/attendance/class/:class_id` - Laporan kehadiran kelas
- `GET /api/reports/attendance/student/:student_id` - Laporan kehadiran mahasiswa
- `GET /api/reports/attendance/lecturer/:lecturer_id` - Ringkasan kehadiran dosen

#### 1.8 System Controller (`systemController.js`)
**Path**: `backend/controllers/shared/systemController.js`
**Endpoints**:
- `GET /api/system/logs` - Ambil log sistem (Super Admin)
- `POST /api/system/logs` - Buat log sistem
- `GET /api/system/settings` - Ambil pengaturan sistem (Admin/Lecturer)
- `PUT /api/system/settings/:id` - Update pengaturan sistem (Super Admin)
- `GET /api/system/door-access-logs` - Log akses pintu (Admin/Lecturer)
- `GET /api/system/room-access-permissions` - Izin akses ruangan (Admin/Lecturer)
- `POST /api/system/room-access-permissions` - Berikan izin akses ruangan (Super Admin)
- `DELETE /api/system/room-access-permissions/:id` - Cabut izin akses ruangan (Super Admin)

#### 1.9 Face Dataset Controller (`faceDatasetController.js`)
**Path**: `backend/controllers/shared/faceDatasetController.js`
**Endpoints**:
- `POST /api/face-datasets/upload` - Upload dataset wajah
- `GET /api/face-datasets/user/:user_id` - Ambil dataset wajah user
- `POST /api/face-datasets/verify/:id` - Verifikasi dataset wajah (Admin/Lecturer)
- `DELETE /api/face-datasets/:id` - Hapus dataset wajah
- `GET /api/face-datasets/pending` - Dataset pending verifikasi (Admin/Lecturer)

### 2. Administrator Controllers

#### 2.1 User Management Controller (`userManagementController.js`)
**Path**: `backend/controllers/administrator/userManagementController.js`
**Endpoints**:
- `GET /api/admin/users` - Ambil semua user
- `GET /api/admin/users/:id` - Ambil user by ID
- `POST /api/admin/users` - Buat user baru
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Hapus user
- `PATCH /api/admin/users/:id/status` - Update status user
- `POST /api/admin/users/bulk-create` - Buat user dalam jumlah banyak
- `PATCH /api/admin/users/bulk-update-status` - Update status user massal
- `GET /api/admin/users/statistics` - Statistik user

#### 2.2 Dashboard Controller (`dashboardController.js`)
**Path**: `backend/controllers/administrator/dashboardController.js`
**Endpoints**:
- `GET /api/admin/dashboard` - Dashboard administrator

### 3. Lecturer Controllers

#### 3.1 Dashboard Controller (`dashboardController.js`)
**Path**: `backend/controllers/lecturer/dashboardController.js`
**Endpoints**:
- `GET /api/lecturer/dashboard` - Dashboard dosen
- `GET /api/lecturer/courses` - Mata kuliah yang diampu
- `GET /api/lecturer/classes/:id/students` - Mahasiswa dalam kelas
- `GET /api/lecturer/attendance-sessions` - Sesi kehadiran yang dibuat
- `POST /api/lecturer/attendance-sessions` - Buat sesi kehadiran baru

### 4. Student Controllers

#### 4.1 Dashboard Controller (`dashboardController.js`)
**Path**: `backend/controllers/student/dashboardController.js`
**Endpoints**:
- `GET /api/student/dashboard` - Dashboard mahasiswa
- `GET /api/student/schedule` - Jadwal kuliah
- `GET /api/student/attendance-history` - Riwayat kehadiran
- `GET /api/student/courses` - Mata kuliah yang diambil

## Fitur Utama Setiap Controller

### Authentication & Authorization
- Session-based authentication
- Role-based access control (super-admin, lecturer, student)
- Password hashing dengan argon2
- Profile management

### Dashboard
- Role-specific dashboards dengan data yang relevan
- Real-time statistics
- Quick actions sesuai role
- Activity summaries

### Attendance Management
- Manual attendance recording
- Face recognition integration
- Session management (create, start, end)
- Attendance verification
- Statistics dan reporting

### Course & Class Management
- CRUD operations untuk courses
- Class scheduling
- Student enrollment management
- Conflict detection untuk jadwal

### Room Management
- Room scheduling
- Availability checking
- Access control
- Usage history

### Notification System
- Real-time notifications
- Broadcasting capabilities
- Read/unread status
- Different notification types

### Reporting
- Class attendance reports
- Student attendance reports
- Lecturer summaries
- Export capabilities

### System Management
- System logs
- Settings management
- Access control
- Audit trails

## Middleware Integration
Semua controller menggunakan:
- **AuthUser middleware** untuk authentication
- **Role checking** di dalam controller
- **Input validation**
- **Error handling**
- **Logging**

## Database Integration
- Menggunakan Sequelize ORM
- Relasi antar model sudah terdefinisi
- Transaction support
- Query optimization

## Security Features
- Input sanitization
- SQL injection prevention
- Access control berdasarkan role
- Session management
- File upload security (untuk face datasets)

## Error Handling
- Consistent error response format
- Detailed error logging
- User-friendly error messages
- HTTP status codes yang tepat

## Performance Optimization
- Pagination untuk large datasets
- Efficient queries dengan include/exclude
- Caching untuk frequently accessed data
- Background processing untuk heavy operations

Semua controller telah diimplementasi dengan best practices dan siap untuk digunakan dalam production environment.
