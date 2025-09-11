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
// 2. COURSE CLASSES TABLE - Kelas per Mata Kuliah (No Room - Single Room System)
// ===============================================
const CourseClasses = db.define('course_classes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to courses table (manual relationship)'
    },
    lecturer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to users table where role = lecturer (manual relationship)'
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
    schedule: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Array of schedule objects: [{day, start_time, end_time}] - Single room system'
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
    },    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to users table where role = student (manual relationship)'
    },
    class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to course_classes table (manual relationship)'
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
// RELATIONSHIPS REMOVED TO PREVENT TABLESPACE ISSUES
// ===============================================
// All model relationships have been removed to prevent foreign key constraint issues
// and tablespace conflicts during database initialization.
// 
// Foreign key fields still exist in the tables as regular INTEGER fields
// but without Sequelize associations to avoid automatic constraint creation.
//
// Manual joins can still be performed in queries when needed:
// 
// Example manual joins:
// const courseClass = await CourseClasses.findByPk(classId);
// const course = await Courses.findByPk(courseClass.course_id);
// const lecturer = await Users.findByPk(courseClass.lecturer_id);

export { Courses, CourseClasses, StudentEnrollments };
