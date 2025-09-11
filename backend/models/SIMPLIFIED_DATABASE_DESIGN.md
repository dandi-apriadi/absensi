# DESAIN DATABASE SEDERHANA UNTUK SISTEM ABSENSI
## Simplified Database Design for Attendance System

### OVERVIEW
Database ini dirancang dengan pendekatan sederhana untuk mendukung fungsi-fungsi utama:
1. **Pembuatan User** (Mahasiswa, Dosen, Admin)
2. **Pengelolaan Jadwal** (Mata kuliah, Kelas, Waktu)
3. **Pengelolaan Kelas** (Enrollment mahasiswa)
4. **Pengenalan Wajah** (Face recognition untuk absensi)
5. **Akses Pintu** (Door access control)

> **Note**: System tables (SystemSettings, SystemLogs) telah dihapus untuk menyederhanakan arsitektur. 
> Konfigurasi sistem sekarang dikelola melalui environment variables dan file config.

---

## STRUKTUR TABEL

### 1. **USERS** - Tabel Pengguna
Menyimpan semua jenis pengguna dalam satu tabel (unified table)

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key auto increment |
| user_id | VARCHAR(20) | NIM/NIP/Admin ID (unique) |
| email | VARCHAR(100) | Email pengguna (unique) |
| password | VARCHAR(255) | Password terenkripsi |
| full_name | VARCHAR(100) | Nama lengkap |
| role | ENUM | 'student', 'lecturer', 'admin' |
| status | ENUM | 'active', 'inactive' |
| phone | VARCHAR(15) | Nomor telepon |
| profile_picture | VARCHAR(255) | Path foto profil |
| program_study | VARCHAR(50) | Program studi (untuk student) |
| semester | INTEGER | Semester (untuk student) |
| department | VARCHAR(50) | Departemen (untuk lecturer) |

**Kegunaan:**
- Unified table untuk semua role
- Mudah maintenance dan query
- Field spesifik role bisa null

---

### 2. **COURSES** - Mata Kuliah
Menyimpan data mata kuliah

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| course_code | VARCHAR(20) | Kode mata kuliah (unique) |
| course_name | VARCHAR(100) | Nama mata kuliah |
| credits | INTEGER | Jumlah SKS |
| semester | INTEGER | Semester mata kuliah |
| program_study | VARCHAR(50) | Program studi |
| status | ENUM | 'active', 'inactive' |

**Kegunaan:**
- Master data mata kuliah
- Basis untuk pembuatan jadwal

---

### 3. **ROOMS** - Ruangan
Menyimpan data ruangan kuliah

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| room_code | VARCHAR(20) | Kode ruangan (unique) |
| room_name | VARCHAR(50) | Nama ruangan |
| building | VARCHAR(30) | Nama gedung |
| capacity | INTEGER | Kapasitas ruangan |
| has_door_access | BOOLEAN | Apakah ada akses pintu otomatis |
| status | ENUM | 'active', 'inactive', 'maintenance' |

**Kegunaan:**
- Master data ruangan
- Kontrol akses pintu
- Scheduling

---

### 4. **SCHEDULES** - Jadwal Kuliah
Menyimpan jadwal perkuliahan

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| course_id | INTEGER | FK ke courses |
| lecturer_id | INTEGER | FK ke users (dosen) |
| room_id | INTEGER | FK ke rooms |
| class_name | VARCHAR(50) | Nama kelas (A, B, C) |
| day_of_week | ENUM | Hari dalam seminggu |
| start_time | TIME | Jam mulai |
| end_time | TIME | Jam selesai |
| academic_year | VARCHAR(10) | Tahun akademik |
| semester_period | ENUM | 'ganjil', 'genap' |
| max_students | INTEGER | Maksimal mahasiswa |
| status | ENUM | 'active', 'inactive' |

**Kegunaan:**
- Penjadwalan rutin kuliah
- Basis untuk pembuatan sesi absensi
- Enrollment mahasiswa

---

### 5. **ENROLLMENTS** - Pendaftaran Mahasiswa
Menyimpan data pendaftaran mahasiswa ke kelas

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| schedule_id | INTEGER | FK ke schedules |
| student_id | INTEGER | FK ke users (mahasiswa) |
| enrolled_at | DATE | Tanggal mendaftar |
| status | ENUM | 'active', 'dropped', 'completed' |

**Kegunaan:**
- Relasi many-to-many antara mahasiswa dan jadwal
- Tracking enrollment status

---

### 6. **FACE_DATASETS** - Dataset Wajah
Menyimpan data wajah untuk face recognition

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| user_id | INTEGER | FK ke users |
| face_encoding | TEXT | Data encoding wajah |
| image_path | VARCHAR(255) | Path file gambar |
| quality_score | DECIMAL(3,2) | Skor kualitas (0-1) |
| status | ENUM | 'pending', 'approved', 'rejected' |
| approved_by | INTEGER | FK ke users (approver) |
| approved_at | DATE | Tanggal approve |

**Kegunaan:**
- Penyimpanan data wajah untuk recognition
- Approval workflow untuk dataset
- Quality control

---

### 7. **ATTENDANCE_SESSIONS** - Sesi Absensi
Menyimpan sesi perkuliahan untuk absensi

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| schedule_id | INTEGER | FK ke schedules |
| session_number | INTEGER | Pertemuan ke-berapa |
| session_date | DATE | Tanggal sesi |
| start_time | TIME | Jam mulai |
| end_time | TIME | Jam selesai |
| topic | VARCHAR(200) | Topik perkuliahan |
| attendance_method | ENUM | Metode absensi |
| qr_code | TEXT | QR code untuk absensi |
| qr_expire_time | DATETIME | Expire time QR |
| attendance_open | BOOLEAN | Status absensi terbuka |
| status | ENUM | Status sesi |

**Kegunaan:**
- Pembuatan sesi absensi per pertemuan
- Multiple metode absensi
- QR code support

---

### 8. **ATTENDANCES** - Record Absensi
Menyimpan record kehadiran mahasiswa

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| session_id | INTEGER | FK ke attendance_sessions |
| student_id | INTEGER | FK ke users (student) |
| attendance_status | ENUM | Status kehadiran |
| check_in_time | DATETIME | Waktu check-in |
| method_used | ENUM | Metode yang digunakan |
| confidence_score | DECIMAL(3,2) | Confidence score (face recognition) |
| notes | TEXT | Catatan tambahan |
| marked_by | INTEGER | FK ke users (manual marker) |

**Kegunaan:**
- Record kehadiran mahasiswa
- Support multiple attendance methods
- Confidence scoring untuk face recognition

---

### 9. **DOOR_ACCESS_LOGS** - Log Akses Pintu
Menyimpan log akses ke ruangan

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| user_id | INTEGER | FK ke users (nullable) |
| room_id | INTEGER | FK ke rooms |
| access_time | DATETIME | Waktu akses |
| access_method | ENUM | Metode akses |
| access_granted | BOOLEAN | Akses diberikan/ditolak |
| confidence_score | DECIMAL(3,2) | Confidence score |
| image_path | VARCHAR(255) | Path gambar capture |
| reason | VARCHAR(100) | Alasan ditolak/catatan |

**Kegunaan:**
- Security logging
- Face recognition untuk akses pintu
- Audit trail

---

### 10. **NOTIFICATIONS** - Notifikasi
Sistem notifikasi untuk pengguna

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Primary key |
| user_id | INTEGER | FK ke users |
| type | ENUM | Jenis notifikasi |
| title | VARCHAR(100) | Judul notifikasi |
| message | TEXT | Isi pesan |
| is_read | BOOLEAN | Status dibaca |
| read_at | DATETIME | Waktu dibaca |

**Kegunaan:**
- Push notifications
- System alerts
- User notifications

---

## KEUNGGULAN DESAIN SEDERHANA INI:

### 1. **Simplified Architecture**
- Mengurangi kompleksitas relationship
- Mudah dipahami dan dimaintain
- Performa query yang lebih baik

### 2. **Unified User Table**
- Satu tabel untuk semua role user
- Mengurangi JOIN operations
- Mudah untuk role-based access control

### 3. **Flexible Scheduling**
- Support multiple classes per course
- Easy semester/academic year management
- Room allocation yang fleksibel

### 4. **Multi-Method Attendance**
- Face recognition sebagai primary method
- QR code sebagai backup
- Manual override untuk edge cases

### 5. **Integrated Door Access**
- Unified dengan sistem attendance
- Security logging yang komprehensif
- Face recognition consistency

### 6. **Scalable Notification System**
- Type-based notifications
- Easy to extend notification types
- User-centric design

---

## IMPLEMENTASI WORKFLOW:

### 1. **User Management Flow**
```
Admin creates user → User activates account → Face dataset enrollment → Approval → Active user
```

### 2. **Schedule Creation Flow**
```
Admin creates course → Admin creates schedule → Students enroll → Classes ready
```

### 3. **Attendance Flow**
```
Lecturer starts session → Students check-in (face/QR) → Attendance recorded → Session completed
```

### 4. **Door Access Flow**
```
User approaches door → Face recognition → Access granted/denied → Log recorded
```

### 5. **Notification Flow**
```
System event occurs → Notification created → User receives notification → User reads notification
```

---

## INDEXES UNTUK PERFORMANCE:

- `users(user_id)`, `users(email)`, `users(role)`
- `schedules(course_id, day_of_week)`, `schedules(lecturer_id)`
- `enrollments(schedule_id, student_id)` (unique)
- `attendances(session_id, student_id)` (unique)
- `face_datasets(user_id, status)`
- `door_access_logs(room_id, access_time)`
- `notifications(user_id, is_read)`

Desain ini fokus pada **simplicity, performance, dan maintainability** sambil tetap mendukung semua fitur yang dibutuhkan untuk sistem absensi yang modern.
