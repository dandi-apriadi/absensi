# 🚀 Quick Start Guide - Face Recognition Attendance

## ⚡ Super Cepat - 3 Langkah

### 1. **Double-click `test.bat`**
   - Verifikasi semua komponen OK
   - Pastikan semua test ✅ PASS

### 2. **Double-click `run.bat`**
   - Aplikasi akan otomatis terbuka

### 3. **Login & Setup**
   - Login dengan credentials database
   - Setup dataset karyawan
   - Mulai absensi!

## 🔑 Default Login (sesuaikan dengan database)

Cek tabel `users` untuk credentials yang valid:
```sql
SELECT email, password, role FROM users WHERE status = 'active';
```

## 📱 Interface Aplikasi

```
┌─ Tab 1: ABSENSI ─────────────────────────┐
│  [Start Camera] [Stop Camera]           │
│  ┌─────────────┐  ┌─────────────────────┐│
│  │             │  │ Recognition Info    ││
│  │   CAMERA    │  │ - Employee detected ││
│  │   PREVIEW   │  │ - Confidence: 85%   ││
│  │             │  │ - Status: Success   ││
│  │             │  │                     ││
│  └─────────────┘  │ Today's Attendance  ││
│                    │ ┌─────────────────┐ ││
│                    │ │ Name │ Time │...│ ││
│                    │ └─────────────────┘ ││
│                    └─────────────────────┘│
└──────────────────────────────────────────┘

┌─ Tab 2: DATASET ─────────────────────────┐
│  Employee: [John Doe ▼]                 │
│  [Capture Dataset] [Train Model] [Delete]│
│                                          │
│  Process Log:                            │
│  ┌──────────────────────────────────────┐│
│  │ [12:34:56] Starting capture...      ││
│  │ [12:35:01] Captured 5/30 images     ││
│  │ [12:35:45] Training model...        ││
│  │ [12:36:12] ✅ Training complete!    ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

## 🎯 Workflow Lengkap

### **Setup Awal (sekali saja):**
1. **Employee Dataset:**
   - Tab "Kelola Dataset"
   - Pilih karyawan
   - "Ambil Dataset Wajah" (30 foto)
   - Wait for auto-training

2. **Repeat untuk semua karyawan**

### **Daily Usage:**
1. **Buka aplikasi**
2. **Tab "Absensi"**
3. **"Mulai Kamera"**
4. **Karyawan datang → Auto attendance**

### **Monitoring:**
1. **Tab "Laporan"**
2. **Pilih tanggal**
3. **Generate report**

## 🔧 Settings & Config

### **File `.env`:**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=insightflow

# Camera
CAMERA_INDEX=0          # Change to 1,2,3 if camera not detected

# Recognition
RECOGNITION_THRESHOLD=0.6   # Higher = more strict
```

### **Jika Camera Tidak Terdeteksi:**
1. Check `CAMERA_INDEX` di `.env`
2. Try values: 0, 1, 2, 3
3. Restart aplikasi

### **Jika Recognition Tidak Akurat:**
1. Capture dataset ulang dengan lighting baik
2. Variasikan pose wajah
3. Adjust `RECOGNITION_THRESHOLD`

## 🆘 Troubleshooting Cepat

### **Error saat start:**
```bash
python test_simple.py  # Check apa yang error
```

### **Login gagal:**
- Check credentials di database `users`
- Pastikan status = 'active'

### **Face detection tidak jalan:**
- Check camera permission
- Pastikan lighting cukup
- Test dengan `test.bat` dulu

### **Database error:**
- Start MySQL service
- Check connection di `.env`
- Import `insightflow (12).sql`

## 📞 Support Commands

```bash
# Test system
python test_simple.py

# Run app directly
python main.py

# Check dependencies
pip list | findstr -i "opencv customtkinter mysql"
```

## 🎉 Happy Face Recognition!

Sistem siap digunakan untuk absensi otomatis menggunakan face recognition. 

**Enjoy! 🚀**
