import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import { CourseClasses } from "./courseManagementModel.js";
import { Users } from "./userManagementModel.js";
import { Rooms } from "./courseManagementModel.js";

const { DataTypes } = Sequelize;

// ===============================================
// 1. ATTENDANCE SESSIONS TABLE - Sesi Perkuliahan
// ===============================================
const AttendanceSessions = db.define('attendance_sessions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    class_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'course_classes',
            key: 'id'
        },
        onDelete: 'CASCADE'
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
    room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'rooms',
            key: 'id'
        },
        allowNull: true
    },
    topic: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Materi yang diajarkan'
    },
    session_type: {
        type: DataTypes.ENUM('regular', 'makeup', 'exam', 'quiz'),
        defaultValue: 'regular'
    },
    attendance_method: {
        type: DataTypes.ENUM('face_recognition', 'qr_code', 'manual', 'mixed'),
        defaultValue: 'face_recognition'
    },
    qr_code: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'QR Code data for attendance'
    },
    qr_expire_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    attendance_open_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    attendance_close_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'scheduled'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }, created_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'Reference to users table where role = lecturer'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['class_id', 'session_date']
        },
        {
            fields: ['status']
        },
        {
            fields: ['session_date']
        }
    ]
});

// ===============================================
// 2. STUDENT ATTENDANCES TABLE - Rekaman Kehadiran Mahasiswa
// ===============================================
const StudentAttendances = db.define('student_attendances', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    session_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'attendance_sessions',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }, student_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'Reference to users table where role = student'
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late', 'excused', 'sick'),
        allowNull: false
    },
    check_in_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    check_out_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    attendance_method: {
        type: DataTypes.ENUM('face_recognition', 'qr_code', 'manual'),
        allowNull: true
    },
    confidence_score: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: true,
        comment: 'Face recognition confidence score (0-1)'
    },
    location_lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    location_lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    verified_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: true,
        comment: 'Who verified manual attendance'
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['session_id', 'student_id']
        },
        {
            fields: ['status']
        },
        {
            fields: ['check_in_time']
        }
    ]
});

// ===============================================
// 3. FACE DATASETS TABLE - Dataset Wajah
// ===============================================
const FaceDatasets = db.define('face_datasets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    image_path: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    image_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    encoding_data: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Face encoding vector data'
    },
    image_quality: {
        type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
        allowNull: true
    },
    face_landmarks: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Facial landmark points'
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Primary photo for recognition'
    },
    verification_status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    verified_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: true
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    upload_method: {
        type: DataTypes.ENUM('single_upload', 'bulk_upload', 'camera_capture'),
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            fields: ['user_id', 'verification_status']
        },
        {
            fields: ['is_primary']
        },
        {
            fields: ['verification_status']
        }
    ]
});

// ===============================================
// 4. FACE RECOGNITION LOGS TABLE - Log Pengenalan Wajah
// ===============================================
const FaceRecognitionLogs = db.define('face_recognition_logs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    session_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'attendance_sessions',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    recognized_user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: true
    },
    confidence_score: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false
    },
    captured_image_path: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    recognition_status: {
        type: DataTypes.ENUM('success', 'failed', 'low_confidence', 'no_face_detected'),
        allowNull: false
    },
    processing_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Processing time in milliseconds'
    },
    camera_id: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'rooms',
            key: 'id'
        },
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            fields: ['session_id']
        },
        {
            fields: ['recognized_user_id']
        },
        {
            fields: ['recognition_status']
        },
        {
            fields: ['created_at']
        }
    ]
});

// ===============================================
// RELATIONSHIPS - RELASI ANTAR TABEL
// ===============================================

// CourseClass has many AttendanceSessions (1:many)
CourseClasses.hasMany(AttendanceSessions, {
    foreignKey: 'class_id',
    as: 'sessions',
    onDelete: 'CASCADE'
});
AttendanceSessions.belongsTo(CourseClasses, {
    foreignKey: 'class_id',
    as: 'class',
    onDelete: 'CASCADE'
});

// Room has many AttendanceSessions (1:many)
Rooms.hasMany(AttendanceSessions, {
    foreignKey: 'room_id',
    as: 'sessions',
    onDelete: 'SET NULL'
});
AttendanceSessions.belongsTo(Rooms, {
    foreignKey: 'room_id',
    as: 'room',
    onDelete: 'SET NULL'
});

// Note: Lecturer relationship akan didefinisikan di index.js menggunakan Users model

// AttendanceSession has many StudentAttendances (1:many)
AttendanceSessions.hasMany(StudentAttendances, {
    foreignKey: 'session_id',
    as: 'attendances',
    onDelete: 'CASCADE'
});
StudentAttendances.belongsTo(AttendanceSessions, {
    foreignKey: 'session_id', as: 'session',
    onDelete: 'CASCADE'
});

// Note: Student-StudentAttendances relationship akan didefinisikan di index.js menggunakan Users model

// AttendanceSession has many FaceRecognitionLogs (1:many)
AttendanceSessions.hasMany(FaceRecognitionLogs, {
    foreignKey: 'session_id',
    as: 'recognitionLogs',
    onDelete: 'CASCADE'
});
FaceRecognitionLogs.belongsTo(AttendanceSessions, {
    foreignKey: 'session_id',
    as: 'session',
    onDelete: 'CASCADE'
});

// Room has many FaceRecognitionLogs (1:many)
Rooms.hasMany(FaceRecognitionLogs, {
    foreignKey: 'room_id',
    as: 'recognitionLogs',
    onDelete: 'SET NULL'
});
FaceRecognitionLogs.belongsTo(Rooms, {
    foreignKey: 'room_id',
    as: 'room',
    onDelete: 'SET NULL'
});

export {
    AttendanceSessions,
    StudentAttendances,
    FaceDatasets,
    FaceRecognitionLogs
};
