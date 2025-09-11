import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Import all models
import { Users } from "./userManagementModel.js";
import { Courses, Rooms, CourseClasses, StudentEnrollments } from "./courseManagementModel.js";
import { AttendanceSessions, StudentAttendances, FaceDatasets, FaceRecognitionLogs } from "./attendanceModel.js";
import { Notifications, DoorAccessLogs, RoomAccessPermissions, SystemLogs, SystemSettings } from "./systemModel.js";

// ===============================================
// RELATIONSHIPS REMOVED TO PREVENT TABLESPACE ISSUES
// ===============================================
// All model relationships have been removed to prevent foreign key constraint issues
// and tablespace conflicts during database initialization.
// 
// Foreign key fields still exist in the tables as regular INTEGER fields
// but without Sequelize associations to avoid automatic constraint creation.
//
// Manual joins can still be performed in queries when needed.

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
    const courseClass = await CourseClasses.findByPk(classId);
    
    if (courseClass) {
        // Manual joins since we removed associations
        const course = await Courses.findByPk(courseClass.course_id);
        const lecturer = await Users.findByPk(courseClass.lecturer_id);
        const room = await Rooms.findByPk(courseClass.room_id);
        const enrollments = await StudentEnrollments.findAll({
            where: { class_id: classId }
        });

        return {
            ...courseClass.toJSON(),
            course,
            lecturer,
            room,
            enrollments
        };
    }
    return null;
};

/**
 * Get attendance session with complete details
 * @param {number} sessionId - Session ID
 * @returns {Object} Attendance session with all relations
 */
const getAttendanceSessionDetails = async (sessionId) => {
    const session = await AttendanceSessions.findByPk(sessionId);
    
    if (session) {
        // Manual joins since we removed associations
        const classInfo = await CourseClasses.findByPk(session.class_id);
        const course = classInfo ? await Courses.findByPk(classInfo.course_id) : null;
        const room = await Rooms.findByPk(session.room_id);
        const creator = await Users.findByPk(session.created_by);
        const attendances = await StudentAttendances.findAll({
            where: { session_id: sessionId }
        });

        return {
            ...session.toJSON(),
            class: classInfo ? {
                ...classInfo.toJSON(),
                course
            } : null,
            room,
            creator,
            attendances
        };
    }
    return null;
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
