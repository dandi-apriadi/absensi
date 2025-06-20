# Struktur Tabel Users Terpadu

## Perubahan
Struktur database telah diubah dari **3 tabel terpisah** menjadi **1 tabel terpadu** untuk semua role users:

### Sebelumnya (Multi-table):
- `users` - Data dasar pengguna
- `students` - Data khusus mahasiswa
- `lecturers` - Data khusus dosen  
- `super_admins` - Data khusus admin

### Sekarang (Single-table):
- `users` - **Satu tabel untuk semua role** dengan field nullable untuk setiap role

## Field Role-Specific

### Student Fields:
- `program_study` - Program studi
- `semester` - Semester saat ini
- `academic_year` - Tahun akademik (format: 2024/2025)
- `entrance_year` - Tahun masuk
- `gpa` - Grade Point Average
- `guardian_name` - Nama wali
- `guardian_phone` - No telepon wali

### Lecturer Fields:
- `department` - Departemen/Fakultas
- `position` - Jabatan (Dosen, Asisten Dosen, dll)
- `specialization` - Bidang keahlian/spesialisasi
- `education_level` - Tingkat pendidikan (S1, S2, S3, Prof.)
- `office_room` - Ruang kantor
- `employee_id` - NIP (Nomor Induk Pegawai)

### Super Admin Fields:
- `admin_level` - Level administrator (system_admin, faculty_admin, it_admin)
- `permissions` - Array of specific permissions (JSON)
- `department_access` - Array of accessible departments (JSON)
- `department` - Departemen akses

## Methods Tersedia

### `getRoleSpecificData()`
Mengembalikan data user dengan struktur yang disesuaikan role:
```javascript
const user = await Users.findByPk(userId);
const userData = user.getRoleSpecificData();
// Output: { id, user_id, email, ..., student_data: {...} }
```

### `getDisplayName()`
Mengembalikan nama tampilan sesuai role:
```javascript
const displayName = user.getDisplayName();
// Student: "John Doe (NIM123)"
// Lecturer: "Dr. Jane Smith, S3"
// Admin: "Admin User (System Admin)"
```

### `updateRoleSpecificData(data)`
Update field khusus sesuai role:
```javascript
user.updateRoleSpecificData({
  program_study: "Teknik Informatika",
  semester: 6
});
await user.save();
```

## Validasi
Model secara otomatis memvalidasi:
- **Student**: Harus ada `program_study`, `semester`, `entrance_year`
- **Lecturer**: Harus ada `department`, `position`, `employee_id`
- **Super Admin**: Harus ada `admin_level`

## Migration
Untuk menerapkan struktur baru:

1. **Reset database**:
   ```bash
   node resetDatabase.js
   ```

2. **Jalankan aplikasi**:
   ```bash
   npm start
   ```
   Database akan otomatis dibuat dengan struktur baru.

## Controllers yang Sudah Diperbarui
- ✅ `authController.js` - Login, register, profile
- ✅ `models/index.js` - Relationships dan helper functions
- ✅ `models/userManagementModel.js` - Model terpadu

## Next Steps
- Update semua controller lain yang menggunakan model user
- Test semua fungsi CRUD untuk ketiga role
- Update frontend jika diperlukan
