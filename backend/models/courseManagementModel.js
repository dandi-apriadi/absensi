import { Sequelize } from "sequelize";
import db from "../config/Database.js";
// Note: Users model akan diimport di index.js untuk relationships

const { DataTypes } = Sequelize;

// ===============================================
// 1. COURSES TABLE - Mata Kuliah
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
        type: DataTypes.STRING(150),
        allowNull: false
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'SKS - Satuan Kredit Semester'
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Semester ke berapa mata kuliah ini'
    },
    program_study: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    prerequisites: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of prerequisite course IDs'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            fields: ['course_code']
        },
        {
            fields: ['program_study']
        },
        {
            fields: ['status']
        }
    ]
});

// ===============================================
// 2. ROOMS TABLE - Ruangan
// ===============================================
const Rooms = db.define('rooms', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room_code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },
    room_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    building: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    floor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    room_type: {
        type: DataTypes.ENUM('classroom', 'laboratory', 'auditorium', 'meeting_room', 'office'),
        allowNull: false
    },
    facilities: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of available facilities: projector, AC, etc.'
    },
    has_face_recognition: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    door_access_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Code for electronic door lock'
    },
    status: {
        type: DataTypes.ENUM('available', 'maintenance', 'unavailable'),
        defaultValue: 'available'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            fields: ['room_code']
        },
        {
            fields: ['building', 'floor']
        },
        {
            fields: ['room_type']
        },
        {
            fields: ['status']
        }
    ]
});

// ===============================================
// 3. COURSE CLASSES TABLE - Kelas per Mata Kuliah
// ===============================================
const CourseClasses = db.define('course_classes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'courses',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }, lecturer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'Reference to users table where role = lecturer'
    },
    class_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'A, B, C, etc.'
    },
    academic_year: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    semester_period: {
        type: DataTypes.ENUM('ganjil', 'genap'),
        allowNull: false
    },
    max_students: {
        type: DataTypes.INTEGER,
        defaultValue: 40
    },
    room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'rooms',
            key: 'id'
        },
        allowNull: true
    },
    schedule: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Array of schedule objects: [{day, start_time, end_time, room_id}]'
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            fields: ['course_id', 'academic_year']
        },
        {
            fields: ['lecturer_id']
        },
        {
            fields: ['status']
        }
    ]
});

// ===============================================
// 4. STUDENT ENROLLMENTS TABLE - Pendaftaran Mahasiswa ke Kelas
// ===============================================
const StudentEnrollments = db.define('student_enrollments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, student_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'Reference to users table where role = student'
    },
    class_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'course_classes',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    enrollment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('enrolled', 'dropped', 'completed'),
        defaultValue: 'enrolled'
    },
    final_grade: {
        type: DataTypes.STRING(2),
        allowNull: true,
        comment: 'A, B+, B, C+, C, D+, D, E'
    },
    final_score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    }
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['student_id', 'status']
        },
        {
            fields: ['class_id']
        }
    ]
});

// ===============================================
// RELATIONSHIPS - RELASI ANTAR TABEL
// ===============================================

// Course has many CourseClasses (1:many)
Courses.hasMany(CourseClasses, {
    foreignKey: 'course_id',
    as: 'classes',
    onDelete: 'CASCADE'
});
CourseClasses.belongsTo(Courses, {
    foreignKey: 'course_id',
    as: 'course',
    onDelete: 'CASCADE'
});

// Note: Lecturer relationship akan didefinisikan di index.js menggunakan Users model

// Room has many CourseClasses (1:many)
Rooms.hasMany(CourseClasses, {
    foreignKey: 'room_id',
    as: 'classes',
    onDelete: 'SET NULL'
});
CourseClasses.belongsTo(Rooms, {
    foreignKey: 'room_id',
    as: 'room',
    onDelete: 'SET NULL'
});

// CourseClass has many StudentEnrollments (1:many)
CourseClasses.hasMany(StudentEnrollments, {
    foreignKey: 'class_id',
    as: 'enrollments',
    onDelete: 'CASCADE'
});
StudentEnrollments.belongsTo(CourseClasses, {
    foreignKey: 'class_id',
    as: 'class',
    onDelete: 'CASCADE'
});

export { Courses, Rooms, CourseClasses, StudentEnrollments };
