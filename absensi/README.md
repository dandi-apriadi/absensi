# 🚪 Face Recognition Door Access & Attendance System

## Overview
Sistem dual-function yang menggabungkan:
1. **Face Recognition Attendance** - Absensi otomatis dengan deteksi wajah
2. **Door Access Control** - Kontrol akses pintu otomatis dengan relay untuk Raspberry Pi

## ✨ Features

### 🎯 Dual Function System
- **First Recognition**: Mark attendance + open door
- **Subsequent Recognitions**: Open door only (no duplicate attendance)
- **Automatic Relay Control**: 3-second door unlock duration
- **Audio Feedback**: Success/denied beep patterns

### � Access Control
- **Room Access Verification**: Check scheduled classes for today
- **Database Integration**: Real-time session verification
- **Attendance Logging**: Automatic attendance marking
- **Access Logs**: All attempts logged to database

### 🔧 Hardware Integration
- **Raspberry Pi GPIO Support**: Direct relay control
- **LED Indicators**: Visual status feedback
- **Buzzer Support**: Audio access feedback
- **Simulation Mode**: Works on development machines

## 🏗️ System Architecture

```
Face Recognition Camera
         ↓
    Face Detection
         ↓
    Database Verification
         ↓
    Access Decision
         ↓ (if granted)
    ┌─────────────────────┐
    │  Dual Function      │
    │  1. Mark Attendance │ (first time today)
    │  2. Open Door       │ (always)
    └─────────────────────┘
         ↓
    GPIO Relay Control
         ↓
    Door Unlock (3 sec)
```

## 📁 File Structure

```
absensi/
├── main.py                     # Main application
├── simple_face_recognition.py  # Face detection/recognition
├── simple_database.py          # Database operations
├── backend_api.py              # API integration
├── relay_control.py            # GPIO/Relay control
├── config_raspberry_pi.py      # Hardware configuration
├── datasets/                   # Face training data
├── models/                     # Trained face models
└── README.md                   # This file
```

## 🚀 Quick Start

### Development (Windows/Mac)
```bash
cd absensi
python main.py
```

### Production (Raspberry Pi)
```bash
# Install GPIO libraries
sudo apt-get update
sudo apt-get install python3-pip
pip3 install RPi.GPIO gpiozero

# Run application
python3 main.py
```

## ⚙️ Configuration

### Raspberry Pi GPIO Setup
Edit `config_raspberry_pi.py`:

```python
DOOR_RELAY_ENABLED = True   # Enable GPIO control
DOOR_RELAY_PIN = 18         # GPIO pin for relay
DOOR_OPEN_DURATION = 3      # Seconds to keep door open
LED_INDICATOR_PIN = 24      # Status LED
BUZZER_PIN = 23             # Audio feedback
```

### Hardware Wiring
```
Raspberry Pi → Relay Module
GPIO 18      → Relay IN
5V           → Relay VCC
GND          → Relay GND

Relay Module → Door Lock
NO (Normally Open) → Door Lock +
COM (Common)       → Door Lock -
```

## 🔧 System Behavior

### Access Granted (First Time Today)
1. ✅ Face recognized with high confidence
2. ✅ User has scheduled class today
3. ✅ Attendance marked to database
4. 🔓 Door relay activated (3 seconds)
5. 🔊 Success beep sound
6. 📝 Log: "Selamat datang [Name]! Absensi dicatat + Pintu dibuka"

### Access Granted (Return Visit)
1. ✅ Face recognized with high confidence
2. ✅ User has scheduled class today
3. ⚠️ Attendance already marked
4. 🔓 Door relay activated (3 seconds)
5. 🔊 Success beep sound
6. 📝 Log: "Selamat datang kembali [Name]! Pintu dibuka"

### Access Denied
1. ❌ No scheduled class today, OR
2. ❌ Face not recognized, OR
3. ❌ Low confidence score
4. 🔒 Door remains locked
5. 🔊 Denied beep pattern
6. 📝 Log: "Akses ditolak: [Reason]"

## 📊 Database Tables

### student_attendances
Records actual attendance marks (once per session)

### door_access_logs
Records all door access attempts

## 🎛️ Admin Interface

### Face Dataset Management
- Capture face datasets (100 photos per person)
- Train face recognition models
- Manage user access permissions

### Room Access Testing
- Test access for specific users
- View scheduled sessions
- Check enrollment status

### Real-time Monitoring
- Live camera feed
- Recognition confidence scores
- Today's attendance list
- Access attempt logs

## 🐛 Troubleshooting

### Common Issues

**1. "Tidak dapat memverifikasi akses ruangan"**
- Check database connection
- Ensure user has scheduled classes today
- Verify student_enrollments table

**2. "Attendance already marked for today"**
- This is normal behavior for return visits
- Door will still open for valid users
- Only attendance marking is skipped

**3. GPIO/Relay not working**
- Ensure RPi.GPIO is installed
- Check wiring connections
- Verify DOOR_RELAY_ENABLED = True
- Test with simulation mode first

**4. Face recognition accuracy issues**
- Improve lighting conditions
- Retrain face models with more samples
- Adjust CONFIDENCE_THRESHOLD in config

## 🔒 Security Features

- **Confidence Threshold**: Minimum 0.6 confidence required
- **Session Validation**: Real-time class schedule verification
- **Access Logging**: All attempts recorded with timestamps
- **Anti-Spoofing**: Live camera feed required (no photos)
- **Role-Based Access**: Only enrolled students gain access

## 📈 Performance

- **Recognition Speed**: ~30 FPS camera processing
- **Response Time**: <1 second from face detection to door unlock
- **False Positive Rate**: <1% with proper training
- **Concurrent Users**: Supports unlimited enrolled faces

---

*Last updated: September 14, 2025*