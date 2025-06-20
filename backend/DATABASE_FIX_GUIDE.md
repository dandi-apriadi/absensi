# 🔧 Panduan Mengatasi Error Database

## ❌ Error yang Terjadi
```
ER_WRONG_AUTO_KEY: Incorrect table definition; there can be only one auto column and it must be defined as a key
```

## 🔍 Penyebab Error
Error ini terjadi karena:
1. Tabel `users` sudah ada di database
2. Terdapat konflik kolom auto_increment
3. Sequelize mencoba menambahkan kolom `id` auto_increment baru ke tabel yang sudah memiliki kolom auto_increment

## ✅ Solusi

### Opsi 1: Reset Database (Recommended)
```bash
# Jalankan script reset database
npm run reset-db

# Atau langsung dengan node
node resetDatabase.js

# Kemudian jalankan aplikasi
npm start
```

### Opsi 2: Manual Database Reset
1. Buka MySQL/phpMyAdmin
2. Hapus semua tabel di database `absensi`
3. Jalankan aplikasi untuk membuat tabel baru

### Opsi 3: Drop Specific Tables
```sql
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS student_attendances;
DROP TABLE IF EXISTS face_recognition_logs;
DROP TABLE IF EXISTS face_datasets;
DROP TABLE IF EXISTS attendance_sessions;
DROP TABLE IF EXISTS student_enrollments;
DROP TABLE IF EXISTS course_classes;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS lecturers;
DROP TABLE IF EXISTS super_admins;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS system_logs;
DROP TABLE IF EXISTS door_access_logs;
DROP TABLE IF EXISTS room_access_permissions;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;
```

## 🚀 Langkah-langkah Selanjutnya

### 1. Reset Database
```bash
cd backend
npm run reset-db
```

### 2. Jalankan Aplikasi
```bash
npm start
```

### 3. Verifikasi
- Aplikasi akan membuat semua tabel dengan struktur yang benar
- Tidak akan ada konflik auto_increment
- Semua relasi foreign key akan terbuat dengan benar

## 📋 Tabel yang Akan Dibuat
1. `users` - Tabel utama pengguna
2. `students` - Data mahasiswa
3. `lecturers` - Data dosen
4. `super_admins` - Data super admin
5. `courses` - Data mata kuliah
6. `rooms` - Data ruangan
7. `course_classes` - Kelas mata kuliah
8. `student_enrollments` - Pendaftaran mahasiswa
9. `attendance_sessions` - Sesi kehadiran
10. `student_attendances` - Data kehadiran
11. `face_datasets` - Dataset wajah
12. `face_recognition_logs` - Log pengenalan wajah
13. `notifications` - Notifikasi
14. `system_logs` - Log sistem
15. `system_settings` - Pengaturan sistem
16. `door_access_logs` - Log akses pintu
17. `room_access_permissions` - Izin akses ruangan

## ⚠️ Catatan Penting
- Script reset akan menghapus SEMUA data yang ada
- Pastikan backup data penting sebelum reset
- Setelah reset, aplikasi akan membuat struktur tabel yang benar
- Tidak perlu menjalankan migrasi manual

## 🎯 Hasil Akhir
Setelah reset dan restart aplikasi:
- Semua tabel akan terbuat dengan struktur yang benar
- Tidak ada konflik auto_increment
- Semua relasi foreign key akan berfungsi
- Aplikasi backend siap digunakan

Jalankan perintah berikut untuk menyelesaikan masalah:
```bash
npm run reset-db && npm start
```
