# SIMPLIFIED DATABASE MODELS
## Model Database yang Disederhanakan untuk Sistem Absensi

### 📋 OVERVIEW

Database telah dirancang ulang dengan pendekatan yang lebih sederhana untuk mendukung:
- ✅ **Pembuatan User** (Student, Lecturer, Admin)
- ✅ **Pengelolaan Jadwal** (Course scheduling)
- ✅ **Pengelolaan Kelas** (Class management & enrollment)
- ✅ **Pengenalan Wajah** (Face recognition untuk absensi)
- ✅ **Akses Pintu** (Door access control)

> **⚠️ Important**: System tables (SystemSettings, SystemLogs, RoomAccessPermissions) telah dihapus 
> dari desain baru untuk menyederhanakan arsitektur. Konfigurasi sistem sekarang menggunakan:
> - Environment variables untuk settings
> - File config untuk konfigurasi aplikasi
> - Direct permission check berdasarkan user role

---

## 🗂️ FILE STRUCTURE

```
models/
├── simplifiedModels.js          # Model utama yang disederhanakan
├── indexSimplified.js           # Index dengan helper functions
├── migrationScript.js           # Script untuk migrasi data
├── runMigration.js             # Command line tool untuk migrasi
├── SIMPLIFIED_DATABASE_DESIGN.md  # Dokumentasi desain database
├── ERD_SIMPLIFIED.md           # Entity Relationship Diagram
└── README_SIMPLIFIED.md        # File ini
```

---

## 🗑️ REMOVED SYSTEM TABLES

Untuk menyederhanakan arsitektur, table-table berikut telah dihapus dari desain baru:

### ❌ **SystemSettings** 
**Replacement**: Environment variables + config files
```javascript
// Before (SystemSettings table)
const setting = await SystemSettings.findOne({ where: { key: 'max_face_datasets' } });

// After (Environment variable)
const maxFaceDatasets = process.env.MAX_FACE_DATASETS || 5;
```

### ❌ **SystemLogs** 
**Replacement**: Application logging + monitoring tools
```javascript
// Before (SystemLogs table)
await SystemLogs.create({ action: 'user_login', user_id: 1 });

// After (Logger)
import logger from '../utils/logger.js';
logger.info('User login', { user_id: 1, timestamp: new Date() });
```

### ❌ **RoomAccessPermissions** 
**Replacement**: Role-based access control
```javascript
// Before (RoomAccessPermissions table)
const permission = await RoomAccessPermissions.findOne({ 
    where: { user_id: 1, room_id: 1 } 
});

// After (Direct role check)
const hasAccess = (user.role === 'admin') || 
                 (user.role === 'lecturer' && schedule.lecturer_id === user.id);
```

### 🔧 **Configuration Management**
```javascript
// config/systemSettings.js
export const SYSTEM_CONFIG = {
    // Face Recognition Settings
    FACE_RECOGNITION: {
        MAX_DATASETS_PER_USER: process.env.MAX_FACE_DATASETS || 5,
        MIN_CONFIDENCE_SCORE: process.env.MIN_CONFIDENCE_SCORE || 0.8,
        IMAGE_QUALITY_THRESHOLD: process.env.IMAGE_QUALITY_THRESHOLD || 0.7
    },
    
    // Attendance Settings
    ATTENDANCE: {
        LATE_THRESHOLD_MINUTES: process.env.LATE_THRESHOLD_MINUTES || 15,
        QR_CODE_EXPIRE_MINUTES: process.env.QR_CODE_EXPIRE_MINUTES || 5,
        AUTO_CLOSE_ATTENDANCE_HOURS: process.env.AUTO_CLOSE_ATTENDANCE_HOURS || 2
    },
    
    // Door Access Settings
    DOOR_ACCESS: {
        MAX_FAILED_ATTEMPTS: process.env.MAX_FAILED_ATTEMPTS || 3,
        LOCKOUT_DURATION_MINUTES: process.env.LOCKOUT_DURATION_MINUTES || 30
    },
    
    // Notification Settings
    NOTIFICATIONS: {
        REMINDER_BEFORE_CLASS_MINUTES: process.env.REMINDER_BEFORE_CLASS_MINUTES || 15,
        LOW_ATTENDANCE_THRESHOLD: process.env.LOW_ATTENDANCE_THRESHOLD || 75
    }
};
```

---

## 🚀 QUICK START

### 1. **Test New Models**
```bash
cd backend/models
node runMigration.js --action=test
```

### 2. **Run Migration (dari model lama ke baru)**
```bash
# Backup otomatis akan dibuat
node runMigration.js --action=migrate
```

### 3. **Rollback (jika diperlukan)**
```bash
node runMigration.js --action=rollback --timestamp=2024_01_15_10_30_00
```

---

## 📊 TABEL UTAMA

### 1. **USERS** - Unified User Table
```javascript
// Contoh penggunaan
import { Users } from './simplifiedModels.js';

// Create new user
const newStudent = await Users.create({
    user_id: '2024001',
    email: 'student@example.com',
    password: 'hashedPassword',
    full_name: 'John Doe',
    role: 'student',
    program_study: 'Teknik Informatika',
    semester: 3
});

// Create new lecturer
const newLecturer = await Users.create({
    user_id: 'LEC001',
    email: 'lecturer@example.com',
    password: 'hashedPassword',
    full_name: 'Dr. Jane Smith',
    role: 'lecturer',
    department: 'Informatika'
});
```

### 2. **SCHEDULES** - Jadwal Kuliah
```javascript
import { Schedules } from './simplifiedModels.js';

// Create new schedule
const newSchedule = await Schedules.create({
    course_id: 1,
    lecturer_id: 2,
    room_id: 1,
    class_name: 'A',
    day_of_week: 'monday',
    start_time: '08:00:00',
    end_time: '10:00:00',
    academic_year: '2024/2025',
    semester_period: 'ganjil',
    max_students: 40
});
```

### 3. **FACE_DATASETS** - Dataset Wajah
```javascript
import { FaceDatasets } from './simplifiedModels.js';

// Add face dataset
const faceDataset = await FaceDatasets.create({
    user_id: 1,
    face_encoding: 'encoded_face_data_here',
    image_path: '/uploads/faces/user1_face1.jpg',
    quality_score: 0.95,
    status: 'pending'
});
```

### 4. **ATTENDANCES** - Record Absensi
```javascript
import { Attendances } from './simplifiedModels.js';

// Record attendance
const attendance = await Attendances.create({
    session_id: 1,
    student_id: 1,
    attendance_status: 'present',
    check_in_time: new Date(),
    method_used: 'face_recognition',
    confidence_score: 0.98
});
```

---

## 🔧 HELPER FUNCTIONS

File `indexSimplified.js` menyediakan helper functions yang siap pakai:

### **User Management**
```javascript
import { getUserDetails } from './indexSimplified.js';

// Get user details (tanpa password)
const user = await getUserDetails(userId);
```

### **Schedule Management**
```javascript
import { 
    getLecturerSchedules, 
    getStudentSchedules 
} from './indexSimplified.js';

// Get lecturer's schedules
const lecturerSchedules = await getLecturerSchedules(lecturerId);

// Get student's enrolled schedules
const studentSchedules = await getStudentSchedules(studentId);
```

### **Attendance Tracking**
```javascript
import { getStudentAttendanceSummary } from './indexSimplified.js';

// Get attendance summary for student in specific schedule
const summary = await getStudentAttendanceSummary(studentId, scheduleId);
// Returns: { totalSessions, attendedSessions, lateSessions, absentSessions, attendancePercentage }
```

### **Face Recognition**
```javascript
import { 
    getUserFaceDatasets, 
    getPendingFaceDatasets 
} from './indexSimplified.js';

// Get user's face datasets
const userFaces = await getUserFaceDatasets(userId);

// Get pending face datasets for approval
const pendingFaces = await getPendingFaceDatasets();
```

### **Door Access**
```javascript
import { getRecentDoorAccessLogs } from './indexSimplified.js';

// Get recent door access logs for a room
const recentLogs = await getRecentDoorAccessLogs(roomId, 50);
```

### **Notifications**
```javascript
import { 
    getUnreadNotifications, 
    markNotificationAsRead,
    createNotification 
} from './indexSimplified.js';

// Get unread notifications
const unreadNotifs = await getUnreadNotifications(userId);

// Mark as read
await markNotificationAsRead(notificationId, userId);

// Create new notification
await createNotification({
    user_id: userId,
    type: 'attendance_reminder',
    title: 'Reminder: Class Starting Soon',
    message: 'Your class will start in 15 minutes.'
});
```

---

## 🔄 MIGRATION PROCESS

### **Pre-Migration Checklist**
- [ ] Backup database
- [ ] Test new models di environment development
- [ ] Verify semua relationships berfungsi
- [ ] Prepare rollback plan

### **Migration Steps**
1. **Backup**: Otomatis membuat backup tables
2. **Schema**: Create new simplified tables
3. **Data**: Migrate data dari old ke new tables
4. **Validation**: Verify data integrity
5. **Cleanup**: Archive old tables (optional)

### **Post-Migration**
- Update aplikasi untuk menggunakan `indexSimplified.js`
- Test semua fungsi utama
- Monitor performance
- Update dokumentasi API

---

## 📈 PERFORMANCE IMPROVEMENTS

### **Indexing Strategy**
```sql
-- Primary indexes (auto-created)
users(id), courses(id), rooms(id), schedules(id), etc.

-- Business logic indexes
users(user_id), users(email), users(role)
schedules(course_id, day_of_week), schedules(lecturer_id)
enrollments(schedule_id, student_id) -- unique
attendances(session_id, student_id) -- unique
face_datasets(user_id, status)
door_access_logs(room_id, access_time)
notifications(user_id, is_read)
```

### **Query Optimization**
- Minimal JOIN operations dengan unified Users table
- Denormalized fields untuk common queries
- Proper indexing pada foreign keys
- Efficient pagination support

---

## 🛡️ SECURITY CONSIDERATIONS

### **Data Protection**
- Password hashing (bcrypt recommended)
- Face encoding encryption
- Access control berdasarkan role
- Audit logging untuk sensitive operations

### **Privacy**
- Face datasets require approval
- Personal data access restrictions
- GDPR compliance ready structure
- Data retention policies support

---

## 🧪 TESTING

### **Unit Tests**
```javascript
// Example test structure
import { Users, Schedules, Attendances } from './simplifiedModels.js';

describe('Simplified Models', () => {
    test('Create user with role validation', async () => {
        const user = await Users.create({
            user_id: 'TEST001',
            email: 'test@example.com',
            password: 'hashedpass',
            full_name: 'Test User',
            role: 'student'
        });
        expect(user.role).toBe('student');
    });
    
    test('Enrollment constraints', async () => {
        // Test unique constraint pada schedule_id + student_id
    });
    
    test('Attendance tracking', async () => {
        // Test attendance summary calculations
    });
});
```

### **Integration Tests**
- Test semua helper functions
- Verify relationships work correctly
- Performance testing dengan large datasets
- Concurrent access testing

---

## 📚 API USAGE EXAMPLES

### **REST API Integration**
```javascript
// Example controller using simplified models
import { 
    getUserDetails, 
    getStudentSchedules,
    getStudentAttendanceSummary 
} from '../models/indexSimplified.js';

export const getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user.id;
        
        // Get student details
        const student = await getUserDetails(studentId);
        
        // Get enrolled schedules
        const schedules = await getStudentSchedules(studentId);
        
        // Get attendance summary for each schedule
        const schedulesWithAttendance = await Promise.all(
            schedules.map(async (enrollment) => {
                const summary = await getStudentAttendanceSummary(
                    studentId, 
                    enrollment.schedule_id
                );
                return {
                    ...enrollment.toJSON(),
                    attendance_summary: summary
                };
            })
        );
        
        res.json({
            student,
            schedules: schedulesWithAttendance
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

---

## 🔗 RELATED FILES

- **Database Config**: `../config/Database.js`
- **Controllers**: `../controllers/` (perlu update untuk menggunakan simplified models)
- **Routes**: `../routes/` (compatible dengan existing routes)
- **Middleware**: `../middleware/` (no changes needed)

---

## 🆘 TROUBLESHOOTING

### **Common Issues**

1. **Migration Failed**
   ```bash
   # Check backup tables exist
   # Rollback and investigate error
   node runMigration.js --action=rollback --timestamp=BACKUP_TIMESTAMP
   ```

2. **Foreign Key Constraints**
   ```javascript
   // Models use manual relationships, no automatic constraints
   // Safe to create/update records independently
   ```

3. **Performance Issues**
   ```sql
   -- Check if indexes exist
   SHOW INDEX FROM users;
   SHOW INDEX FROM schedules;
   
   -- Add missing indexes if needed
   CREATE INDEX idx_users_role ON users(role);
   ```

4. **Data Validation Errors**
   ```javascript
   // Check enum values match model definitions
   // Verify required fields are provided
   // Check data types consistency
   ```

---

## 🔄 FUTURE ENHANCEMENTS

### **Planned Features**
- [ ] Automated data archiving
- [ ] Advanced reporting queries
- [ ] Real-time notifications
- [ ] Multi-tenant support
- [ ] Advanced face recognition features

### **Performance Optimizations**
- [ ] Query result caching
- [ ] Database connection pooling
- [ ] Read replicas support
- [ ] Horizontal scaling preparation

---

## 📞 SUPPORT

Untuk pertanyaan atau masalah terkait simplified models:

1. Check dokumentasi di `SIMPLIFIED_DATABASE_DESIGN.md`
2. Review ERD di `ERD_SIMPLIFIED.md`
3. Test dengan `node runMigration.js --action=test`
4. Contact development team

**Happy coding! 🚀**
