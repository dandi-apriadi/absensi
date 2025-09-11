import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Import old models for data migration
import {
    Users as OldUsers,
    Courses as OldCourses,
    Rooms as OldRooms,
    CourseClasses as OldCourseClasses,
    StudentEnrollments as OldStudentEnrollments,
    AttendanceSessions as OldAttendanceSessions,
    StudentAttendances as OldStudentAttendances,
    FaceDatasets as OldFaceDatasets,
    DoorAccessLogs as OldDoorAccessLogs,
    Notifications as OldNotifications
} from "./index.js";

// Import new simplified models
import {
    Users,
    Courses,
    Rooms,
    Schedules,
    Enrollments,
    FaceDatasets,
    AttendanceSessions,
    Attendances,
    DoorAccessLogs,
    Notifications,
    syncSimplifiedModels
} from "./simplifiedModels.js";

/**
 * Migration Script dari Model Lama ke Model Baru
 */
class DatabaseMigration {
    
    constructor() {
        this.migrationLog = [];
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}`;
        console.log(logMessage);
        this.migrationLog.push(logMessage);
    }

    /**
     * Backup existing data
     */
    async backupExistingData() {
        try {
            this.log('Starting data backup...');
            
            // Create backup tables with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
            
            // Backup critical tables
            await db.query(`CREATE TABLE users_backup_${timestamp} AS SELECT * FROM users`);
            await db.query(`CREATE TABLE courses_backup_${timestamp} AS SELECT * FROM courses`);
            await db.query(`CREATE TABLE rooms_backup_${timestamp} AS SELECT * FROM rooms`);
            
            this.log('Data backup completed successfully');
            return true;
        } catch (error) {
            this.log(`Error during backup: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate Users data
     */
    async migrateUsers() {
        try {
            this.log('Migrating users data...');
            
            const oldUsers = await OldUsers.findAll();
            
            for (const oldUser of oldUsers) {
                const userData = {
                    user_id: oldUser.user_id,
                    email: oldUser.email,
                    password: oldUser.password,
                    full_name: oldUser.full_name,
                    role: oldUser.role,
                    status: oldUser.status === 'suspended' ? 'inactive' : oldUser.status,
                    phone: oldUser.phone,
                    profile_picture: oldUser.profile_picture,
                    
                    // Student specific fields
                    program_study: oldUser.program_study,
                    semester: oldUser.semester,
                    
                    // Lecturer specific fields (map from old structure)
                    department: oldUser.department || oldUser.faculty
                };

                await Users.create(userData);
            }
            
            this.log(`Migrated ${oldUsers.length} users successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating users: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate Courses data
     */
    async migrateCourses() {
        try {
            this.log('Migrating courses data...');
            
            const oldCourses = await OldCourses.findAll();
            
            for (const oldCourse of oldCourses) {
                const courseData = {
                    course_code: oldCourse.course_code,
                    course_name: oldCourse.course_name,
                    credits: oldCourse.credits,
                    semester: oldCourse.semester,
                    program_study: oldCourse.program_study,
                    status: oldCourse.status
                };

                await Courses.create(courseData);
            }
            
            this.log(`Migrated ${oldCourses.length} courses successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating courses: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate Rooms data
     */
    async migrateRooms() {
        try {
            this.log('Migrating rooms data...');
            
            const oldRooms = await OldRooms.findAll();
            
            for (const oldRoom of oldRooms) {
                const roomData = {
                    room_code: oldRoom.room_code,
                    room_name: oldRoom.room_name,
                    building: oldRoom.building,
                    capacity: oldRoom.capacity,
                    has_door_access: oldRoom.has_camera_system || false,
                    status: oldRoom.status
                };

                await Rooms.create(roomData);
            }
            
            this.log(`Migrated ${oldRooms.length} rooms successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating rooms: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate CourseClasses to Schedules
     */
    async migrateSchedules() {
        try {
            this.log('Migrating course classes to schedules...');
            
            const oldClasses = await OldCourseClasses.findAll();
            
            for (const oldClass of oldClasses) {
                const scheduleData = {
                    course_id: oldClass.course_id,
                    lecturer_id: oldClass.lecturer_id,
                    room_id: oldClass.room_id,
                    class_name: oldClass.class_name,
                    day_of_week: oldClass.day_of_week,
                    start_time: oldClass.start_time,
                    end_time: oldClass.end_time,
                    academic_year: oldClass.academic_year,
                    semester_period: oldClass.semester_period,
                    max_students: oldClass.max_students || 40,
                    status: oldClass.status
                };

                await Schedules.create(scheduleData);
            }
            
            this.log(`Migrated ${oldClasses.length} schedules successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating schedules: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate StudentEnrollments to Enrollments
     */
    async migrateEnrollments() {
        try {
            this.log('Migrating student enrollments...');
            
            const oldEnrollments = await OldStudentEnrollments.findAll();
            
            for (const oldEnrollment of oldEnrollments) {
                const enrollmentData = {
                    schedule_id: oldEnrollment.class_id, // class_id becomes schedule_id
                    student_id: oldEnrollment.student_id,
                    enrolled_at: oldEnrollment.enrolled_at || oldEnrollment.created_at,
                    status: oldEnrollment.status
                };

                await Enrollments.create(enrollmentData);
            }
            
            this.log(`Migrated ${oldEnrollments.length} enrollments successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating enrollments: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate FaceDatasets
     */
    async migrateFaceDatasets() {
        try {
            this.log('Migrating face datasets...');
            
            const oldDatasets = await OldFaceDatasets.findAll();
            
            for (const oldDataset of oldDatasets) {
                const datasetData = {
                    user_id: oldDataset.user_id,
                    face_encoding: oldDataset.face_encoding,
                    image_path: oldDataset.image_path,
                    quality_score: oldDataset.quality_score,
                    status: oldDataset.status,
                    approved_by: oldDataset.approved_by,
                    approved_at: oldDataset.approved_at
                };

                await FaceDatasets.create(datasetData);
            }
            
            this.log(`Migrated ${oldDatasets.length} face datasets successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating face datasets: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate AttendanceSessions
     */
    async migrateAttendanceSessions() {
        try {
            this.log('Migrating attendance sessions...');
            
            const oldSessions = await OldAttendanceSessions.findAll();
            
            for (const oldSession of oldSessions) {
                const sessionData = {
                    schedule_id: oldSession.class_id, // class_id becomes schedule_id
                    session_number: oldSession.session_number,
                    session_date: oldSession.session_date,
                    start_time: oldSession.start_time,
                    end_time: oldSession.end_time,
                    topic: oldSession.topic,
                    attendance_method: oldSession.attendance_method,
                    qr_code: oldSession.qr_code,
                    qr_expire_time: oldSession.qr_expire_time,
                    attendance_open: oldSession.attendance_close_time ? false : true,
                    status: oldSession.status
                };

                await AttendanceSessions.create(sessionData);
            }
            
            this.log(`Migrated ${oldSessions.length} attendance sessions successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating attendance sessions: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate StudentAttendances to Attendances
     */
    async migrateAttendances() {
        try {
            this.log('Migrating student attendances...');
            
            const oldAttendances = await OldStudentAttendances.findAll();
            
            for (const oldAttendance of oldAttendances) {
                const attendanceData = {
                    session_id: oldAttendance.session_id,
                    student_id: oldAttendance.student_id,
                    attendance_status: oldAttendance.attendance_status,
                    check_in_time: oldAttendance.check_in_time,
                    method_used: oldAttendance.recognition_method || 'manual',
                    confidence_score: oldAttendance.confidence_score,
                    notes: oldAttendance.notes,
                    marked_by: oldAttendance.marked_by
                };

                await Attendances.create(attendanceData);
            }
            
            this.log(`Migrated ${oldAttendances.length} attendances successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating attendances: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate DoorAccessLogs
     */
    async migrateDoorAccessLogs() {
        try {
            this.log('Migrating door access logs...');
            
            const oldLogs = await OldDoorAccessLogs.findAll();
            
            for (const oldLog of oldLogs) {
                const logData = {
                    user_id: oldLog.user_id,
                    room_id: oldLog.room_id,
                    access_time: oldLog.access_time,
                    access_method: oldLog.access_method,
                    access_granted: oldLog.access_granted,
                    confidence_score: oldLog.confidence_score,
                    image_path: oldLog.image_path,
                    reason: oldLog.reason
                };

                await DoorAccessLogs.create(logData);
            }
            
            this.log(`Migrated ${oldLogs.length} door access logs successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating door access logs: ${error.message}`);
            throw error;
        }
    }

    /**
     * Migrate Notifications
     */
    async migrateNotifications() {
        try {
            this.log('Migrating notifications...');
            
            const oldNotifications = await OldNotifications.findAll();
            
            for (const oldNotification of oldNotifications) {
                const notificationData = {
                    user_id: oldNotification.recipient_id,
                    type: this.mapNotificationType(oldNotification.type),
                    title: oldNotification.title,
                    message: oldNotification.message,
                    is_read: oldNotification.is_read,
                    read_at: oldNotification.read_at
                };

                await Notifications.create(notificationData);
            }
            
            this.log(`Migrated ${oldNotifications.length} notifications successfully`);
            return true;
        } catch (error) {
            this.log(`Error migrating notifications: ${error.message}`);
            throw error;
        }
    }

    /**
     * Map old notification types to new simplified types
     */
    mapNotificationType(oldType) {
        const typeMapping = {
            'attendance_reminder': 'attendance_reminder',
            'session_cancelled': 'session_cancelled',
            'session_rescheduled': 'session_cancelled',
            'low_attendance_warning': 'low_attendance',
            'face_dataset_approved': 'face_dataset_update',
            'face_dataset_rejected': 'face_dataset_update',
            'system_maintenance': 'system_alert',
            'security_alert': 'system_alert',
            'grade_updated': 'general',
            'general_announcement': 'general'
        };
        
        return typeMapping[oldType] || 'general';
    }

    /**
     * Run complete migration
     */
    async runMigration() {
        try {
            this.log('=== STARTING DATABASE MIGRATION ===');
            
            // 1. Create backup
            await this.backupExistingData();
            
            // 2. Sync new models
            this.log('Syncing new simplified models...');
            await syncSimplifiedModels({ force: false, alter: true });
            
            // 3. Migrate data in order (considering dependencies)
            await this.migrateUsers();
            await this.migrateCourses();
            await this.migrateRooms();
            await this.migrateSchedules();
            await this.migrateEnrollments();
            await this.migrateFaceDatasets();
            await this.migrateAttendanceSessions();
            await this.migrateAttendances();
            await this.migrateDoorAccessLogs();
            await this.migrateNotifications();
            
            this.log('=== MIGRATION COMPLETED SUCCESSFULLY ===');
            
            // Return migration summary
            return {
                success: true,
                migrationLog: this.migrationLog,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            this.log(`=== MIGRATION FAILED: ${error.message} ===`);
            throw error;
        }
    }

    /**
     * Rollback migration (restore from backup)
     */
    async rollbackMigration(backupTimestamp) {
        try {
            this.log('=== STARTING MIGRATION ROLLBACK ===');
            
            // Restore from backup tables
            await db.query(`DROP TABLE IF EXISTS users`);
            await db.query(`CREATE TABLE users AS SELECT * FROM users_backup_${backupTimestamp}`);
            
            await db.query(`DROP TABLE IF EXISTS courses`);
            await db.query(`CREATE TABLE courses AS SELECT * FROM courses_backup_${backupTimestamp}`);
            
            await db.query(`DROP TABLE IF EXISTS rooms`);
            await db.query(`CREATE TABLE rooms AS SELECT * FROM rooms_backup_${backupTimestamp}`);
            
            this.log('=== ROLLBACK COMPLETED ===');
            return true;
            
        } catch (error) {
            this.log(`=== ROLLBACK FAILED: ${error.message} ===`);
            throw error;
        }
    }
}

export default DatabaseMigration;
