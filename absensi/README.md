# Sistem Absensi Face Recognition

Sistem absensi berbasis pengenalan wajah dengan kontrol akses ruangan yang terintegrasi dengan backend.

## Fitur Utama

### 🔐 Keamanan & Autentikasi
- **Login admin-only**: Hanya admin dan dosen yang dapat mengakses sistem
- **Password verification**: Menggunakan Argon2 untuk hashing password yang aman
- **Database integration**: Terhubung dengan database backend melalui variabel .env

### 👥 Manajemen Pengguna
- **Admin interface**: Admin dapat mengelola dataset wajah untuk semua pengguna
- **Individual user management**: Tambah dataset wajah satu per satu untuk setiap pengguna
- **User selection**: Dropdown untuk memilih pengguna yang akan dikelola datasetnya

### 🚪 Kontrol Akses Ruangan
- **Real-time verification**: Verifikasi apakah pengguna diizinkan masuk ruangan pada hari tertentu
- **Backend integration**: Mengecek jadwal kelas dari backend untuk memvalidasi akses
- **Access logging**: Mencatat semua percobaan akses (berhasil/ditolak) ke database

### 🤖 Face Recognition
- **Automatic capture**: Capture 100 foto wajah secara otomatis untuk training
- **Model training**: Training model pengenalan wajah menggunakan OpenCV LBPH
- **Real-time recognition**: Pengenalan wajah real-time dengan confidence score
- **Attendance marking**: Absensi otomatis setelah verifikasi akses ruangan

## Persyaratan Sistem

### Software Requirements
- Python 3.8+
- MySQL/MariaDB
- OpenCV dengan contrib modules
- Backend API (Node.js) yang sudah berjalan

### Hardware Requirements
- Webcam/Camera yang kompatibel
- RAM minimum 4GB (disarankan 8GB)
- Storage minimum 2GB untuk dataset

## Instalasi & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd absensi
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Konfigurasi Environment
Copy file `.env.example` ke `.env` dan sesuaikan konfigurasi:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=elearning

# Backend API Configuration
BACKEND_API_URL=http://localhost:5000

# App Configuration
DATASET_PATH=./datasets
TEMP_PATH=./temp
CAMERA_INDEX=0
RECOGNITION_THRESHOLD=0.6

# Training Configuration
TRAINING_EPOCHS=100
BATCH_SIZE=32
LEARNING_RATE=0.001
```

### 4. Setup Database
Pastikan database MySQL/MariaDB sudah berjalan dan telah tersedia database `elearning`.

**Tabel yang diperlukan akan dibuat otomatis saat aplikasi pertama kali dijalankan:**
- `face_training`: Menyimpan model dan data training wajah
- Admin user sudah tersedia: `admin@system.local` / `admin123`

### 5. Jalankan Aplikasi
```bash
python main.py
```

## Panduan Penggunaan

### Login
1. Jalankan aplikasi
2. Login dengan akun admin:
   - Email: `admin@system.local`
   - Password: `admin123` (ganti setelah login pertama)

### Mengelola Dataset Wajah (Admin)
1. Masuk ke tab **"Kelola Dataset"**
2. Pilih user dari dropdown
3. Klik **"Refresh Users"** untuk memuat data terbaru
4. Untuk user yang dipilih:
   - **"Ambil Dataset Wajah"**: Capture 100 foto untuk training
   - **"Train Model"**: Latih model dari dataset yang ada
   - **"Hapus Model"**: Hapus model yang sudah ada
   - **"Cek Akses Ruangan"**: Verifikasi apakah user boleh masuk hari ini

### Verifikasi Akses Ruangan
Sistem akan mengecek:
- ✅ Apakah user memiliki jadwal kelas hari ini
- ✅ Apakah sesi kelas sedang aktif
- ✅ Apakah user terdaftar di kelas tersebut

### Absensi Real-time
1. Masuk ke tab **"Absensi"**
2. Klik **"Mulai Kamera"**
3. Sistem akan:
   - Mendeteksi wajah secara real-time
   - Mengenali wajah yang sudah dilatih
   - Memverifikasi akses ruangan
   - Mencatat absensi jika diizinkan

## Struktur Database

### Tabel Utama
- `users`: Data pengguna (dari backend)
- `face_training`: Model dan data training wajah
- `face_attendance_log`: Log pengenalan wajah
- `door_access_logs`: Log akses ruangan
- `face_dataset_images`: Metadata gambar dataset

### Integrasi Backend
Sistem terintegrasi dengan:
- `attendance_sessions`: Jadwal sesi kelas
- `course_classes`: Data kelas
- `class_students`: Daftar mahasiswa per kelas

## Troubleshooting

### Camera Issues
```bash
# Test camera
python -c "import cv2; cap = cv2.VideoCapture(0); print('Camera OK' if cap.read()[0] else 'Camera Error')"
```

### Database Connection
```bash
# Test database connection
python -c "from simple_database import simple_db; print('DB OK' if simple_db.execute_query('SELECT 1') else 'DB Error')"
```

### Backend API Connection
```bash
# Test backend API
python -c "from backend_api import backend_api; print('API OK' if backend_api.check_user_room_access('test') is not None else 'API Error')"
```

## Keamanan

### Password Security
- Menggunakan Argon2 untuk hashing password
- Salt dan cost factor yang aman
- Tidak menyimpan password plain text

### Access Control
- Login terbatas untuk admin dan dosen saja
- Verifikasi role sebelum memberikan akses
- Log semua aktivitas akses

### Data Protection
- Enkripsi koneksi database
- Validasi input untuk mencegah injection
- Backup otomatis model dan dataset

## Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi

[Tentukan lisensi yang sesuai]

## Support

Untuk bantuan teknis:
- Buat issue di repository
- Email: [email-support]
- Dokumentasi: [link-dokumentasi]

---

**Catatan**: Pastikan backend API sudah berjalan sebelum menggunakan sistem ini untuk fungsi verifikasi akses ruangan yang optimal.