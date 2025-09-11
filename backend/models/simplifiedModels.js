import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// ===============================================
// 1. USERS TABLE - Tabel Pengguna (Simplified)
// ===============================================
const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        comment: 'NIM/NIP/Admin ID'
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'lecturer', 'admin'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    profile_picture: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // Student specific fields
    program_study: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // Lecturer specific fields
    department: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// ===============================================
// 2. COURSES TABLE - Mata Kuliah (Simplified)
// ===============================================
const Courses = db.define('courses', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },
    course_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    program_study: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// ===============================================
// 3. SCHEDULES TABLE - Jadwal Kuliah (Simplified)
// ===============================================
const Schedules = db.define('schedules', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to courses table'
    },
    lecturer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to users table (lecturer)'
    },
    class_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Nama kelas: A, B, C, dll'
    },
    day_of_week: {
        type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        allowNull: false
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    academic_year: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Format: 2024/2025'
    },
    semester_period: {
        type: DataTypes.ENUM('ganjil', 'genap'),
        allowNull: false
    },
    max_students: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 40
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// ===============================================
// 4. ENROLLMENTS TABLE - Pendaftaran Mahasiswa ke Kelas
// ===============================================
const Enrollments = db.define('enrollments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to schedules table'
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to users table (student)'
    },
    enrolled_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('active', 'dropped', 'completed'),
        defaultValue: 'active'
    }
}, {
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['schedule_id', 'student_id']
        }
    ]
});

// ===============================================
// 5. FACE_DATASETS TABLE - Dataset Wajah (Simplified)
// ===============================================
const FaceDatasets = db.define('face_datasets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to users table'
    },
    face_encoding: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: 'Encoded face data untuk recognition'
    },
    image_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Path ke file gambar wajah'
    },
    quality_score: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'Skor kualitas gambar wajah (0.00-1.00)'
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to users table (admin/lecturer)'
    },
    approved_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// ===============================================
// 6. ATTENDANCE_SESSIONS TABLE - Sesi Absensi (Simplified)
// ===============================================
const AttendanceSessions = db.define('attendance_sessions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to schedules table'
    },
    session_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Pertemuan ke-berapa'
    },
    session_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    topic: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    attendance_method: {
        type: DataTypes.ENUM('face_recognition', 'manual', 'qr_code'),
        defaultValue: 'face_recognition'
    },
    qr_code: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    qr_expire_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    attendance_open: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'scheduled'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// ===============================================
// 7. ATTENDANCES TABLE - Record Absensi (Simplified)
// ===============================================
const Attendances = db.define('attendances', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to attendance_sessions table'
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to users table (student)'
    },
    attendance_status: {
        type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
        allowNull: false
    },
    check_in_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    method_used: {
        type: DataTypes.ENUM('face_recognition', 'manual', 'qr_code'),
        allowNull: false
    },
    confidence_score: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'Skor confidence untuk face recognition (0.00-1.00)'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    marked_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to users table (untuk manual attendance)'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['session_id', 'student_id']
        }
    ]
});

// ===============================================
// 8. DOOR_ACCESS_LOGS TABLE - Log Akses Pintu (Simplified)
// ===============================================
const DoorAccessLogs = db.define('door_access_logs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to users table (null jika unrecognized)'
    },
    access_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    access_method: {
        type: DataTypes.ENUM('face_recognition', 'card', 'manual', 'emergency'),
        allowNull: false
    },
    access_granted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    confidence_score: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'Skor confidence untuk face recognition'
    },
    image_path: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Path ke gambar capture saat akses'
    },
    reason: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Alasan akses ditolak atau catatan khusus'
    }
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['access_time']
        }
    ]
});

// ===============================================
// 9. NOTIFICATIONS TABLE - Notifikasi (Simplified)
// ===============================================
const Notifications = db.define('notifications', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to users table'
    },
    type: {
        type: DataTypes.ENUM(
            'attendance_reminder',
            'session_cancelled',
            'low_attendance',
            'face_dataset_update',
            'system_alert',
            'general'
        ),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// ===============================================
// MODEL EXPORTS
// ===============================================
export {
    Users,
    Courses,
    Schedules,
    Enrollments,
    FaceDatasets,
    AttendanceSessions,
    Attendances,
    DoorAccessLogs,
    Notifications
};

// ===============================================
// SYNC FUNCTION
// ===============================================
export const syncSimplifiedModels = async (options = {}) => {
    try {
        await db.authenticate();
        console.log('✅ Database connection established successfully.');

        await db.sync(options);
        console.log('✅ All simplified models synchronized successfully.');

        return true;
    } catch (error) {
        console.error('❌ Unable to sync simplified models:', error);
        throw error;
    }
};
