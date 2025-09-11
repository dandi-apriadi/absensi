# Face Recognition Attendance System

Sistem absensi menggunakan face recognition yang dibuat dengan Python GUI.

## Fitur

- **Login System**: Autentikasi pengguna menggunakan database
- **Face Recognition**: Pengenalan wajah untuk absensi otomatis
- **Dataset Management**: Kelola dataset wajah karyawan
- **Training System**: Melatih model face recognition
- **Real-time Attendance**: Absensi real-time menggunakan kamera
- **Reports**: Laporan absensi harian

## Persyaratan

- Python 3.8+
- MySQL Server
- Webcam/Camera
- Visual Studio Build Tools (untuk dlib)

## Instalasi

1. Clone atau download project ini
2. Install dependencies:
   ```bash
   python setup.py
   ```
   
   Atau manual:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup database:
   - Import file `insightflow (12).sql` ke MySQL
   - Update konfigurasi database di `.env`

4. Jalankan aplikasi:
   ```bash
   python main.py
   ```

## Struktur Database

Aplikasi menggunakan tabel-tabel berikut:

### Tabel Utama
- `users`: Data pengguna dan login
- `employees`: Data karyawan
- `attendance`: Data absensi

### Tabel Face Recognition
- `face_training`: Menyimpan model wajah yang telah dilatih
- `face_attendance_log`: Log percobaan face recognition

## Konfigurasi

Edit file `.env` untuk konfigurasi:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=insightflow

# App Configuration
DATASET_PATH=./datasets
TEMP_PATH=./temp
CAMERA_INDEX=0
RECOGNITION_THRESHOLD=0.6
```

## Cara Penggunaan

### 1. Login
- Masukkan email dan password yang terdaftar di database
- Hanya user dengan status 'active' yang bisa login

### 2. Kelola Dataset
- Pilih karyawan dari dropdown
- Klik "Ambil Dataset Wajah" untuk capture 30 foto wajah
- Sistem akan otomatis melatih model setelah capture selesai

### 3. Absensi
- Klik "Mulai Kamera" untuk mengaktifkan face recognition
- Posisikan wajah di depan kamera
- Sistem akan otomatis mendeteksi dan mencatat absensi
- Minimum confidence 60% untuk absensi berhasil

### 4. Laporan
- Pilih tanggal untuk melihat laporan absensi
- Data menampilkan nama, waktu masuk/keluar, status, dan metode verifikasi

## Struktur Project

```
absensi/
├── main.py                     # File utama aplikasi
├── database.py                 # Koneksi dan operasi database
├── face_recognition_system.py  # Sistem face recognition
├── setup.py                    # Script instalasi
├── requirements.txt            # Dependencies
├── .env                        # Konfigurasi
├── datasets/                   # Folder dataset wajah
├── models/                     # Folder model terlatih
└── temp/                       # Folder temporary
```

## Troubleshooting

### Error face_recognition tidak bisa diinstall
Coba salah satu solusi berikut:

1. Install Visual Studio Build Tools
2. Menggunakan conda:
   ```bash
   conda install -c conda-forge dlib
   pip install face_recognition
   ```
3. Menggunakan wheel file pre-compiled

### Error kamera tidak terdeteksi
- Pastikan kamera terhubung dan tidak digunakan aplikasi lain
- Coba ganti `CAMERA_INDEX` di file `.env` (0, 1, 2, etc.)

### Error koneksi database
- Pastikan MySQL server berjalan
- Periksa konfigurasi di file `.env`
- Pastikan database `insightflow` sudah dibuat

## Fitur Tambahan

- **Auto-attendance**: Absensi otomatis saat wajah terdeteksi
- **Confidence scoring**: Sistem confidence untuk akurasi pengenalan
- **Multiple face detection**: Bisa mendeteksi beberapa wajah sekaligus
- **Logging system**: Log semua aktivitas face recognition
- **Model management**: Kelola model wajah yang sudah dilatih

## Keamanan

- Password menggunakan hashing (dalam development: plain text)
- Session management untuk user login
- Logging semua aktivitas absensi
- Validasi input dan sanitization

## Pengembangan Selanjutnya

- [ ] Implementasi password hashing (bcrypt)
- [ ] Export laporan ke Excel/PDF
- [ ] Notifikasi real-time
- [ ] Mobile app integration
- [ ] Cloud storage untuk gambar
- [ ] Advanced analytics dashboard

## Kontribusi

Silakan buat pull request atau buka issue untuk kontribusi dan bug report.

## Lisensi

MIT License - Silakan gunakan untuk project pribadi atau komersial.
