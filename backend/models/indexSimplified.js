import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Import simplified models
import {
    Users,
    Courses,
    Schedules,
    Enrollments,
    FaceDatasets,
    AttendanceSessions,
    Attendances,
    DoorAccessLogs,
    Notifications,
    syncSimplifiedModels
} from "./simplifiedModels.js";

// ===============================================
// MODEL SYNCHRONIZATION FUNCTION
// ===============================================
const syncModels = async (options = {}) => {
    try {
        // Test database connection
        await db.authenticate();
        console.log('✅ Database connection established successfully.');

        // Sync all simplified models
        await syncSimplifiedModels(options);
        console.log('✅ All simplified models synchronized successfully.');

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
 * Get user with basic info
 * @param {number} userId - User ID
 * @returns {Object} User details
 */
const getUserDetails = async (userId) => {
    try {
        const user = await Users.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        return user;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

/**
 * Get active schedules for a lecturer
 * @param {number} lecturerId - Lecturer ID
 * @returns {Array} Active schedules
 */
const getLecturerSchedules = async (lecturerId) => {
    try {
        const schedules = await Schedules.findAll({
            where: {
                lecturer_id: lecturerId,
                status: 'active'
            },
            include: [
                {
                    model: Courses,
                    attributes: ['course_code', 'course_name', 'credits']
                }
            ]
        });
        return schedules;
    } catch (error) {
        console.error('Error fetching lecturer schedules:', error);
        throw error;
    }
};

/**
 * Get enrolled schedules for a student
 * @param {number} studentId - Student ID
 * @returns {Array} Enrolled schedules
 */
const getStudentSchedules = async (studentId) => {
    try {
        const enrollments = await Enrollments.findAll({
            where: {
                student_id: studentId,
                status: 'active'
            },
            include: [
                {
                    model: Schedules,
                    include: [
                        {
                            model: Courses,
                            attributes: ['course_code', 'course_name', 'credits']
                        },
                        {
                            model: Users,
                            attributes: ['full_name', 'email'],
                            where: { role: 'lecturer' }
                        }
                    ]
                }
            ]
        });
        return enrollments;
    } catch (error) {
        console.error('Error fetching student schedules:', error);
        throw error;
    }
};

/**
 * Get attendance summary for a student in a specific schedule
 * @param {number} studentId - Student ID
 * @param {number} scheduleId - Schedule ID
 * @returns {Object} Attendance summary
 */
const getStudentAttendanceSummary = async (studentId, scheduleId) => {
    try {
        const totalSessions = await AttendanceSessions.count({
            where: {
                schedule_id: scheduleId,
                status: 'completed'
            }
        });

        const attendedSessions = await Attendances.count({
            where: {
                student_id: studentId,
                attendance_status: 'present'
            },
            include: [{
                model: AttendanceSessions,
                where: {
                    schedule_id: scheduleId,
                    status: 'completed'
                }
            }]
        });

        const lateSessions = await Attendances.count({
            where: {
                student_id: studentId,
                attendance_status: 'late'
            },
            include: [{
                model: AttendanceSessions,
                where: {
                    schedule_id: scheduleId,
                    status: 'completed'
                }
            }]
        });

        const attendancePercentage = totalSessions > 0 
            ? Math.round(((attendedSessions + lateSessions) / totalSessions) * 100) 
            : 0;

        return {
            totalSessions,
            attendedSessions,
            lateSessions,
            absentSessions: totalSessions - attendedSessions - lateSessions,
            attendancePercentage
        };
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        throw error;
    }
};

/**
 * Get face datasets for a user
 * @param {number} userId - User ID
 * @returns {Array} Face datasets
 */
const getUserFaceDatasets = async (userId) => {
    try {
        const datasets = await FaceDatasets.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
        return datasets;
    } catch (error) {
        console.error('Error fetching face datasets:', error);
        throw error;
    }
};

/**
 * Get pending face datasets for approval
 * @returns {Array} Pending datasets
 */
const getPendingFaceDatasets = async () => {
    try {
        const datasets = await FaceDatasets.findAll({
            where: { status: 'pending' },
            include: [{
                model: Users,
                attributes: ['user_id', 'full_name', 'role']
            }],
            order: [['created_at', 'ASC']]
        });
        return datasets;
    } catch (error) {
        console.error('Error fetching pending face datasets:', error);
        throw error;
    }
};

/**
 * Get recent door access logs (all rooms - simplified since only 1 room)
 * @param {number} limit - Number of logs to fetch
 * @returns {Array} Recent access logs
 */
const getRecentDoorAccessLogs = async (limit = 50) => {
    try {
        const logs = await DoorAccessLogs.findAll({
            include: [{
                model: Users,
                attributes: ['user_id', 'full_name', 'role'],
                required: false
            }],
            order: [['access_time', 'DESC']],
            limit
        });
        return logs;
    } catch (error) {
        console.error('Error fetching door access logs:', error);
        throw error;
    }
};

/**
 * Get unread notifications for a user
 * @param {number} userId - User ID
 * @returns {Array} Unread notifications
 */
const getUnreadNotifications = async (userId) => {
    try {
        const notifications = await Notifications.findAll({
            where: {
                user_id: userId,
                is_read: false
            },
            order: [['created_at', 'DESC']]
        });
        return notifications;
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        throw error;
    }
};

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @param {number} userId - User ID
 * @returns {boolean} Success status
 */
const markNotificationAsRead = async (notificationId, userId) => {
    try {
        const [updatedRows] = await Notifications.update(
            {
                is_read: true,
                read_at: new Date()
            },
            {
                where: {
                    id: notificationId,
                    user_id: userId
                }
            }
        );
        return updatedRows > 0;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

/**
 * Create a new notification
 * @param {Object} notificationData - Notification data
 * @returns {Object} Created notification
 */
const createNotification = async (notificationData) => {
    try {
        const notification = await Notifications.create(notificationData);
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// ===============================================
// EXPORTS
// ===============================================
export {
    // Models
    Users,
    Courses,
    Schedules,
    Enrollments,
    FaceDatasets,
    AttendanceSessions,
    Attendances,
    DoorAccessLogs,
    Notifications,
    
    // Functions
    syncModels,
    
    // Helper functions
    getUserDetails,
    getLecturerSchedules,
    getStudentSchedules,
    getStudentAttendanceSummary,
    getUserFaceDatasets,
    getPendingFaceDatasets,
    getRecentDoorAccessLogs,
    getUnreadNotifications,
    markNotificationAsRead,
    createNotification
};

// Default export untuk backward compatibility
export default {
    Users,
    Courses,
    Schedules,
    Enrollments,
    FaceDatasets,
    AttendanceSessions,
    Attendances,
    DoorAccessLogs,
    Notifications,
    syncModels
};
