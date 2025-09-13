# 🏫 Politeknik Negeri Manado - Course Management System

## 📋 Overview
Sistem manajemen mata kuliah yang telah diimplementasikan untuk Politeknik Negeri Manado dengan fitur:

- ✅ **Manajemen Mata Kuliah**: Tambah, edit, hapus mata kuliah
- ✅ **Manajemen Kelas**: Buat kelas baru dengan jadwal
- ✅ **Pendaftaran Mahasiswa**: Kelola mahasiswa dalam kelas
- ✅ **Multi Program Studi**: Support untuk semua jurusan Polimdo

## 🎓 Program Studi yang Tersedia

### 1. **Teknik Informatika**
- 35+ mata kuliah dari semester 1-6
- Meliputi: Algoritma, Database, Web Programming, AI, Mobile Development

### 2. **Teknik Elektro**
- Matematika Teknik, Fisika Teknik
- Rangkaian Listrik, Elektronika Analog

### 3. **Teknik Mesin**
- Gambar Teknik Mesin
- Pengantar Teknik Mesin

### 4. **Teknik Sipil**
- Gambar Teknik Sipil
- Pengantar Teknik Sipil

### 5. **Akuntansi**
- Pengantar Akuntansi, Matematika Bisnis
- Ekonomi Mikro, Komunikasi Bisnis

### 6. **Administrasi Bisnis**
- Administrasi Bisnis, Ekonomi
- Komunikasi Bisnis

## 🔧 Implementasi yang Dilakukan

### Frontend Changes (`AddClass.jsx`):
1. ✅ Tambah dropdown **Program Studi** dengan 6 jurusan Polimdo
2. ✅ Filter mata kuliah berdasarkan program studi yang dipilih
3. ✅ Update tampilan untuk mencerminkan Politeknik Negeri Manado
4. ✅ Auto-refresh mata kuliah saat ganti program studi

### Backend Enhancement:
1. ✅ Endpoint untuk filter mata kuliah berdasarkan `program_study`
2. ✅ Function `deleteEnrollment` untuk hapus mahasiswa dari kelas
3. ✅ Route DELETE `/api/courses/enrollments/:id`

### Data Seeding:
1. ✅ **Node.js Seeder**: `polimdo-courses.js` (memerlukan node-fetch)
2. ✅ **PowerShell Script**: `seed-ti-courses.ps1` (untuk Windows)
3. ✅ **Bash Script**: `seed-ti-courses.sh` (untuk Linux/WSL)

## 📚 Mata Kuliah Teknik Informatika

### Semester 1:
- **TI101** - Algoritma dan Pemrograman I (3 SKS)
- **TI102** - Matematika Diskrit (3 SKS)
- **TI103** - Pengantar Teknologi Informasi (2 SKS)
- **TI104** - Bahasa Inggris I (2 SKS)
- **TI105** - Pancasila (2 SKS)
- **TI106** - Sistem Digital (3 SKS)
- **TI107** - Fisika Dasar (3 SKS)

### Semester 2:
- **TI201** - Algoritma dan Pemrograman II (3 SKS)
- **TI202** - Struktur Data (3 SKS)
- **TI203** - Matematika Terapan (3 SKS)
- **TI204** - Bahasa Inggris II (2 SKS)
- **TI205** - Kewarganegaraan (2 SKS)
- **TI206** - Organisasi dan Arsitektur Komputer (3 SKS)
- **TI207** - Elektronika Dasar (3 SKS)

### Semester 3:
- **TI301** - Pemrograman Berorientasi Objek (3 SKS)
- **TI302** - Basis Data I (3 SKS)
- **TI303** - Sistem Operasi (3 SKS)
- **TI304** - Jaringan Komputer I (3 SKS)
- **TI305** - Statistika dan Probabilitas (3 SKS)
- **TI306** - Interaksi Manusia dan Komputer (2 SKS)
- **TI307** - Bahasa Indonesia (2 SKS)

### Semester 4:
- **TI401** - Rekayasa Perangkat Lunak (3 SKS)
- **TI402** - Basis Data II (3 SKS)
- **TI403** - Pemrograman Web I (3 SKS)
- **TI404** - Jaringan Komputer II (3 SKS)
- **TI405** - Analisis dan Perancangan Sistem (3 SKS)
- **TI406** - Metodologi Penelitian (2 SKS)
- **TI407** - Grafika Komputer (3 SKS)

### Semester 5:
- **TI501** - Pemrograman Web II (3 SKS)
- **TI502** - Keamanan Jaringan (3 SKS)
- **TI503** - Kecerdasan Buatan (3 SKS)
- **TI504** - Data Mining (3 SKS)
- **TI505** - Mobile Programming (3 SKS)
- **TI506** - E-Commerce (2 SKS)
- **TI507** - Sistem Informasi Manajemen (3 SKS)

### Semester 6:
- **TI601** - Kerja Praktik (2 SKS)
- **TI602** - Proyek Akhir (4 SKS)
- **TI603** - Sistem Terdistribusi (3 SKS)
- **TI604** - Cloud Computing (3 SKS)
- **TI605** - Internet of Things (IoT) (3 SKS)
- **TI606** - Teknologi Multimedia (3 SKS)
- **TI607** - Kewirausahaan (2 SKS)

## 🚀 Cara Menggunakan

### 1. Menambah Mata Kuliah (Manual)
1. Login sebagai **Super Admin**
2. Buka halaman **Tambah Kelas**
3. Pilih **Program Studi** dari dropdown
4. Mata kuliah akan ter-filter otomatis

### 2. Menambah Mata Kuliah (Seeding)
**Perlu login sebagai Super Admin terlebih dahulu!**

```powershell
# Jalankan script PowerShell
cd backend/seeders
.\seed-ti-courses.ps1
```

### 3. Verifikasi Data
```bash
# Check courses via API
curl "http://localhost:5001/api/courses?program_study=Teknik%20Informatika&limit=50"
```

## 🔐 Authentication Required
Semua operasi memerlukan autentikasi sebagai **Super Admin**:
- Creating courses: Requires `super-admin` role
- Managing enrollments: Requires `super-admin` or `lecturer` role

## 📁 Files Modified/Created

### Frontend:
- `frontend/src/views/super-admin/courses/AddClass.jsx` ✅ Updated
- `frontend/src/views/super-admin/courses/ManageClassUsers.jsx` ✅ Updated

### Backend:
- `backend/controllers/shared/courseController.js` ✅ Enhanced
- `backend/routes/shared/courseRoutes.js` ✅ Enhanced

### Seeders:
- `backend/seeders/polimdo-courses.js` ✅ Created
- `backend/seeders/run-seeder.js` ✅ Created  
- `backend/seeders/seed-ti-courses.ps1` ✅ Created
- `backend/seeders/seed-ti-courses.sh` ✅ Created

## 🎯 Next Steps
1. **Login sebagai Super Admin** untuk testing
2. **Run seeder scripts** untuk menambah mata kuliah
3. **Test course creation** dan class management
4. **Add more program studi** sesuai kebutuhan

## 📞 Support
Untuk pertanyaan teknis atau penambahan fitur, silakan hubungi tim development.

---
*Generated by AI Assistant - Politeknik Negeri Manado Course Management System*