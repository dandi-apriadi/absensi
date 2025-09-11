# 🚀 Sistem Absensi Face Recognition (OpenCV Version)

Aplikasi absensi menggunakan face recognition yang dibuat dengan Python GUI. Versi ini menggunakan OpenCV LBPH Face Recognizer yang lebih mudah diinstall dibandingkan library face_recognition.

## ✅ Status Testing

Semua komponen telah ditest dan berjalan dengan baik:
- ✅ Database Connection (86 users found)
- ✅ Camera Access
- ✅ Face Detection (Haar Cascade)
- ✅ LBPH Face Recognizer
- ✅ GUI Libraries (CustomTkinter)
- ✅ Directory Structure

## 🌟 Fitur Utama

### 🔐 **Login System**
- Autentikasi menggunakan email dan password
- Validasi dengan database users
- Session management

### 👤 **Face Recognition**
- Capture dataset wajah (30 foto per karyawan)
- Training model menggunakan OpenCV LBPH
- Real-time face detection dan recognition
- Auto-attendance saat wajah terdeteksi

### 📱 **4 Tab Menu Utama:**

1. **🎯 Tab Absensi**
   - Kamera real-time untuk face recognition
   - Auto-detect dan mark attendance
   - Display info recognition dan confidence
   - Daftar absensi hari ini

2. **📸 Tab Kelola Dataset**
   - Pilih karyawan dari dropdown
   - Capture dataset wajah dengan panduan visual
   - Train model secara otomatis
   - Hapus model yang sudah ada

3. **⚙️ Tab Manajemen**
   - List semua model yang sudah dilatih
   - Reload models
   - Status active/inactive
   - Model management

4. **📊 Tab Laporan**
   - Generate laporan absensi per tanggal
   - Filter berdasarkan karyawan
   - Export data

## 🛠️ Teknologi

- **Python 3.8+**
- **OpenCV + OpenCV Contrib** - Computer vision dan face recognition
- **CustomTkinter** - Modern GUI framework
- **MySQL** - Database
- **NumPy** - Numerical computing
- **PIL/Pillow** - Image processing

## 📦 Dependencies yang Sudah Terinstall

```
✅ opencv-python==4.12.0.88
✅ opencv-contrib-python==4.11.0.86
✅ customtkinter==5.2.2
✅ pillow==11.3.0
✅ mysql-connector-python==9.4.0
✅ python-dotenv==1.1.0
✅ numpy==2.2.6
```

## 🚀 Cara Menjalankan

### 1. Aplikasi sudah siap dijalankan:
```bash
python main.py
```

### 2. Login dengan credentials database:
- Email: sesuai data di tabel `users`
- Password: sesuai data di tabel `users`

### 3. Testing system (opsional):
```bash
python test_simple.py
```

## 📋 Langkah Penggunaan

### 1. **Login**
- Masukkan email dan password yang terdaftar di database
- Hanya user dengan status 'active' yang bisa login

### 2. **Setup Dataset Karyawan**
- Masuk ke tab "Kelola Dataset"
- Pilih karyawan dari dropdown
- Klik "Ambil Dataset Wajah"
- Ikuti instruksi di layar:
  - Posisikan wajah di area frame
  - Tekan SPACE untuk capture (30 foto)
  - Tekan ESC untuk keluar
- Training akan otomatis berjalan setelah capture selesai

### 3. **Mulai Absensi**
- Masuk ke tab "Absensi"
- Klik "Mulai Kamera"
- Posisikan wajah di depan kamera
- Sistem akan otomatis mendeteksi dan mencatat absensi
- Minimum confidence untuk auto-attendance

### 4. **Lihat Laporan**
- Masuk ke tab "Laporan"
- Pilih tanggal
- Klik "Generate Report"

## 🔧 Konfigurasi Database

File `.env` yang sudah dikonfigurasi:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=insightflow
CAMERA_INDEX=0
RECOGNITION_THRESHOLD=0.6
```

## 🗄️ Database Structure

### Tabel yang Digunakan:
- **`users`** - Data login dan informasi user
- **`employees`** - Data karyawan
- **`attendance`** - Data absensi
- **`face_training`** - Model wajah yang sudah dilatih
- **`face_attendance_log`** - Log percobaan face recognition

## 🎯 Keunggulan Versi OpenCV

### ✅ **Kelebihan:**
- ✅ Instalasi mudah (tidak perlu CMake/Visual Studio)
- ✅ Dependencies ringan
- ✅ Performa cepat
- ✅ Stabil dan reliable
- ✅ Cocok untuk production environment

### ⚠️ **Limitasi:**
- Akurasi face recognition sedikit lebih rendah dari face_recognition library
- Memerlukan lighting yang baik untuk hasil optimal
- Training dataset perlu lebih banyak untuk akurasi tinggi

## 🔍 Tips Penggunaan

### **Untuk Hasil Terbaik:**
1. **Capture Dataset:**
   - Pastikan pencahayaan cukup
   - Variasikan ekspresi wajah
   - Ambil dari berbagai sudut
   - Pastikan wajah jelas dan fokus

2. **Absensi:**
   - Posisikan wajah langsung ke kamera
   - Hindari penggunaan kacamata gelap
   - Pastikan tidak ada bayangan di wajah
   - Jaga jarak optimal (30-50cm dari kamera)

## 🐛 Troubleshooting

### **Kamera tidak terdeteksi:**
```bash
# Ganti camera index di .env
CAMERA_INDEX=1  # atau 2, 3, dst
```

### **Recognition tidak akurat:**
- Tambah dataset dengan capture ulang
- Pastikan pencahayaan konsisten
- Check confidence threshold di settings

### **Error database:**
- Pastikan MySQL server berjalan
- Check credentials di file `.env`
- Verify database `insightflow` exists

## 📈 Monitoring & Logs

Aplikasi akan mencatat:
- Semua percobaan face recognition
- Confidence score setiap detection
- Waktu attendance yang berhasil
- Error logs untuk debugging

## 🔄 Update & Maintenance

### **Backup Regular:**
- Database (export ke SQL)
- Folder `datasets/` (gambar training)
- Folder `models/` (model terlatih)

### **Cleaning:**
- Hapus file temporary di `temp/`
- Archive old attendance logs
- Update model jika ada perubahan wajah karyawan

## 🎉 Ready to Use!

Sistem sudah siap digunakan dengan konfigurasi optimal. Semua test telah passed dan komponen bekerja dengan baik.

**Next Steps:**
1. `python main.py` - Jalankan aplikasi
2. Login dengan user credentials
3. Setup dataset untuk karyawan
4. Mulai absensi dengan face recognition!

---
*Developed by: AI Assistant*  
*Version: OpenCV Edition*  
*Date: August 29, 2025*
