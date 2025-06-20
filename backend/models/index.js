import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Import all models
import { Users } from "./userManagementModel.js";
import { Courses, Rooms, CourseClasses, StudentEnrollments } from "./courseManagementModel.js";
import { AttendanceSessions, StudentAttendances, FaceDatasets, FaceRecognitionLogs } from "./attendanceModel.js";
import { Notifications, DoorAccessLogs, RoomAccessPermissions, SystemLogs, SystemSettings } from "./systemModel.js";

// ===============================================
// ADDITIONAL CROSS-MODEL RELATIONSHIPS
// ===============================================

// Users and FaceDatasets relationship (1:many)
Users.hasMany(FaceDatasets, {
    foreignKey: 'user_id',
    as: 'faceDatasets',
    onDelete: 'CASCADE'
});
FaceDatasets.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
});

// Users verify FaceDatasets (1:many)
Users.hasMany(FaceDatasets, {
    foreignKey: 'verified_by',
    as: 'verifiedDatasets',
    onDelete: 'SET NULL'
});
FaceDatasets.belongsTo(Users, {
    foreignKey: 'verified_by',
    as: 'verifier',
    onDelete: 'SET NULL'
});

// Users and FaceRecognitionLogs relationship (1:many)
Users.hasMany(FaceRecognitionLogs, {
    foreignKey: 'recognized_user_id',
    as: 'recognitionLogs',
    onDelete: 'SET NULL'
});
FaceRecognitionLogs.belongsTo(Users, {
    foreignKey: 'recognized_user_id',
    as: 'recognizedUser',
    onDelete: 'SET NULL'
});

// Users (Students) and StudentEnrollments relationship (1:many)
Users.hasMany(StudentEnrollments, {
    foreignKey: 'student_id',
    as: 'enrollments',
    onDelete: 'CASCADE',
    scope: {
        role: 'student'
    }
});
StudentEnrollments.belongsTo(Users, {
    foreignKey: 'student_id',
    as: 'student',
    onDelete: 'CASCADE'
});

// Users verify StudentAttendances (1:many)
Users.hasMany(StudentAttendances, {
    foreignKey: 'verified_by',
    as: 'verifiedAttendances',
    onDelete: 'SET NULL'
});
StudentAttendances.belongsTo(Users, {
    foreignKey: 'verified_by',
    as: 'verifier',
    onDelete: 'SET NULL'
});

// Users (Lecturers) and CourseClasses relationship (1:many)
Users.hasMany(CourseClasses, {
    foreignKey: 'lecturer_id',
    as: 'classes',
    onDelete: 'SET NULL',
    scope: {
        role: 'lecturer'
    }
});
CourseClasses.belongsTo(Users, {
    foreignKey: 'lecturer_id',
    as: 'lecturer',
    onDelete: 'SET NULL'
});

// Users (Lecturers) and AttendanceSessions relationship (1:many)
Users.hasMany(AttendanceSessions, {
    foreignKey: 'created_by',
    as: 'createdSessions',
    onDelete: 'SET NULL',
    scope: {
        role: 'lecturer'
    }
});
AttendanceSessions.belongsTo(Users, {
    foreignKey: 'created_by',
    as: 'creator',
    onDelete: 'SET NULL'
});

// Users (Students) and StudentAttendances relationship (1:many)
Users.hasMany(StudentAttendances, {
    foreignKey: 'student_id',
    as: 'attendances',
    onDelete: 'CASCADE',
    scope: {
        role: 'student'
    }
});
StudentAttendances.belongsTo(Users, {
    foreignKey: 'student_id',
    as: 'student',
    onDelete: 'CASCADE'
});

// ===============================================
// MODEL SYNCHRONIZATION FUNCTION
// ===============================================
const syncModels = async (options = {}) => {
    try {
        // Test database connection
        await db.authenticate();
        console.log('✅ Database connection established successfully.');

        // Sync all models
        await db.sync(options);
        console.log('✅ All models synchronized successfully.');

        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        throw error;
    }
};

// ===============================================
// HELPER FUNCTIONS FOR COMMON QUERIES
// ===============================================

/**
 * Get user with role-specific details (menggunakan model terpadu)
 * @param {number} userId - User ID
 * @returns {Object} User with role details
 */
const getUserWithRoleDetails = async (userId) => {
    const user = await Users.findByPk(userId);
    if (user) {
        return user.getRoleSpecificData();
    }
    return null;
};

/**
 * Get course class with complete details
 * @param {number} classId - Class ID
 * @returns {Object} Course class with all relations
 */
const getCourseClassDetails = async (classId) => {
    const courseClass = await CourseClasses.findByPk(classId, {
        include: [
            {
                model: Courses,
                as: 'course'
            },
            {
                model: Users,
                as: 'lecturer',
                where: { role: 'lecturer' },
                attributes: ['id', 'user_id', 'full_name', 'email', 'phone', 'department', 'position', 'education_level']
            },
            {
                model: Rooms,
                as: 'room'
            },
            {
                model: StudentEnrollments,
                as: 'enrollments',
                include: [
                    {
                        model: Users,
                        as: 'student',
                        where: { role: 'student' },
                        attributes: ['id', 'user_id', 'full_name', 'email', 'program_study', 'semester']
                    }
                ]
            }
        ]
    });
    return courseClass;
};

/**
 * Get attendance session with complete details
 * @param {number} sessionId - Session ID
 * @returns {Object} Attendance session with all relations
 */
const getAttendanceSessionDetails = async (sessionId) => {
    const session = await AttendanceSessions.findByPk(sessionId, {
        include: [
            {
                model: CourseClasses,
                as: 'class',
                include: [
                    {
                        model: Courses,
                        as: 'course'
                    }
                ]
            },
            {
                model: Rooms,
                as: 'room'
            },
            {
                model: Users,
                as: 'creator',
                where: { role: 'lecturer' },
                attributes: ['id', 'user_id', 'full_name']
            },
            {
                model: StudentAttendances,
                as: 'attendances',
                include: [
                    {
                        model: Users,
                        as: 'student',
                        where: { role: 'student' },
                        attributes: ['id', 'user_id', 'full_name']
                    }
                ]
            }
        ]
    });
    return session;
};

// ===============================================
// EXPORT ALL MODELS AND FUNCTIONS
// ===============================================
export {
    // Database connection
    db,

    // User Management Models (Unified)
    Users,

    // Course Management Models
    Courses,
    Rooms,
    CourseClasses,
    StudentEnrollments,

    // Attendance Models
    AttendanceSessions,
    StudentAttendances,
    FaceDatasets,
    FaceRecognitionLogs,

    // System Models
    Notifications,
    DoorAccessLogs,
    RoomAccessPermissions,
    SystemLogs,
    SystemSettings,

    // Utility functions
    syncModels,
    getUserWithRoleDetails,
    getCourseClassDetails,
    getAttendanceSessionDetails
};

// Export default for easy import
export default {
    db,
    models: {
        Users,
        Courses,
        Rooms,
        CourseClasses,
        StudentEnrollments,
        AttendanceSessions,
        StudentAttendances,
        FaceDatasets,
        FaceRecognitionLogs,
        Notifications,
        DoorAccessLogs,
        RoomAccessPermissions,
        SystemLogs,
        SystemSettings
    },
    helpers: {
        syncModels,
        getUserWithRoleDetails,
        getCourseClassDetails,
        getAttendanceSessionDetails
    }
};
