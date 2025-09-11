import {
    Users,
    Courses,
    CourseClasses,
    AttendanceSessions,
    StudentAttendances,
    StudentEnrollments,
    Notifications,
    FaceDatasets,
    db
} from "../../models/index.js";
import { Op } from "sequelize";
import logger from "../../utils/logger.js";

// ===============================================
// DASHBOARD CONTROLLERS
// ===============================================

/**
 * Get Super Admin Dashboard Data
 */
export const getSuperAdminDashboard = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat mengakses dashboard ini"
            });
        }

        // Get current date for filtering
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Get total counts
        const [
            totalUsers,
            totalStudents,
            totalLecturers,
            totalCourses,
            totalClasses,
            activeSessions,
            todayAttendances,
            pendingFaceDatasets,
            unreadNotifications
        ] = await Promise.all([
            Users.count(),
            Students.count(),
            Lecturers.count(),
            Courses.count(),
            CourseClasses.count({ where: { status: 'active' } }),
            AttendanceSessions.count({ where: { status: 'active' } }),
            StudentAttendances.count({
                where: {
                    created_at: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                }
            }),
            FaceDatasets.count({ where: { verification_status: 'pending' } }),
            Notifications.count({
                where: {
                    user_id: req.session.userId,
                    status: 'unread'
                }
            })
        ]);

        // Get user growth data (last 7 days)
        const userGrowthData = await Users.findAll({
            where: {
                created_at: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            attributes: [
                [db.fn('DATE', db.col('created_at')), 'date'],
                'role',
                [db.fn('COUNT', db.col('id')), 'count']
            ],
            group: [db.fn('DATE', db.col('created_at')), 'role'],
            raw: true
        });

        // Get attendance statistics (current month)
        const attendanceStats = await StudentAttendances.findAll({
            where: {
                created_at: {
                    [Op.gte]: startOfMonth
                }
            },
            attributes: [
                'status',
                [db.fn('COUNT', db.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        // Get recent system logs from file
        const recentLogs = await logger.getRecentLogs('system', 10);

        // Get most active courses (by attendance sessions)
        const activeCourses = await AttendanceSessions.findAll({
            where: {
                created_at: {
                    [Op.gte]: startOfMonth
                }
            },
            attributes: [
                [db.fn('COUNT', db.col('AttendanceSessions.id')), 'session_count']
            ],
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            attributes: ['course_name', 'course_code']
                        }
                    ]
                }
            ],
            group: ['courseClass.course.id', 'courseClass.course.course_name', 'courseClass.course.course_code'],
            order: [[db.fn('COUNT', db.col('AttendanceSessions.id')), 'DESC']],
            limit: 5,
            raw: false
        });

        const dashboardData = {
            overview: {
                total_users: totalUsers,
                total_students: totalStudents,
                total_lecturers: totalLecturers,
                total_courses: totalCourses,
                total_classes: totalClasses,
                active_sessions: activeSessions,
                today_attendances: todayAttendances,
                pending_face_datasets: pendingFaceDatasets,
                unread_notifications: unreadNotifications
            },
            user_growth: userGrowthData,
            attendance_statistics: attendanceStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            recent_system_logs: recentLogs.slice(0, 5),
            active_courses: activeCourses,
            quick_actions: [
                { label: 'Kelola User', action: 'manage_users', icon: 'users' },
                { label: 'Kelola Mata Kuliah', action: 'manage_courses', icon: 'book' },
                { label: 'Kelola Ruangan', action: 'manage_rooms', icon: 'building' },
                { label: 'Lihat Laporan', action: 'view_reports', icon: 'chart' },
                { label: 'Pengaturan Sistem', action: 'system_settings', icon: 'settings' }
            ]
        };

        res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        console.error('Get super admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data dashboard"
        });
    }
};

/**
 * Get Lecturer Dashboard Data
 */
export const getLecturerDashboard = async (req, res) => {
    try {
        if (req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang dapat mengakses dashboard ini"
            });
        }

        const userId = req.session.userId;

        // Get lecturer data
        const lecturer = await Lecturers.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['full_name', 'email']
                }
            ]
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Data dosen tidak ditemukan"
            });
        }

        // Get current date for filtering
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

        // Get lecturer's courses and classes
        const courses = await Courses.findAll({
            where: { lecturer_id: lecturer.id },
            include: [
                {
                    model: CourseClasses,
                    as: 'classes',
                    where: { status: 'active' },
                    required: false
                }
            ]
        });

        const classIds = [];
        courses.forEach(course => {
            course.classes.forEach(cls => {
                classIds.push(cls.id);
            });
        });

        // Get today's sessions
        const todaySessions = await AttendanceSessions.findAll({
            where: {
                course_class_id: { [Op.in]: classIds },
                session_date: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            attributes: ['course_name', 'course_code']
                        }
                    ]
                }
            ],
            order: [['start_time', 'ASC']]
        });

        // Get active sessions
        const activeSessions = await AttendanceSessions.findAll({
            where: {
                course_class_id: { [Op.in]: classIds },
                status: 'active'
            },
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            attributes: ['course_name', 'course_code']
                        }
                    ]
                }
            ]
        });

        // Get this week's attendance statistics
        const thisWeekStats = await StudentAttendances.findAll({
            where: {
                created_at: {
                    [Op.gte]: startOfWeek
                }
            },
            attributes: [
                'status',
                [db.fn('COUNT', db.col('id')), 'count']
            ],
            include: [
                {
                    model: AttendanceSessions,
                    as: 'session',
                    where: {
                        course_class_id: { [Op.in]: classIds }
                    },
                    attributes: []
                }
            ],
            group: ['status'],
            raw: true
        });

        // Get recent attendance sessions
        const recentSessions = await AttendanceSessions.findAll({
            where: {
                course_class_id: { [Op.in]: classIds }
            },
            order: [['created_at', 'DESC']],
            limit: 5,
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            attributes: ['course_name', 'course_code']
                        }
                    ]
                }
            ]
        });

        // Get unread notifications
        const unreadNotifications = await Notifications.count({
            where: {
                user_id: userId,
                status: 'unread'
            }
        });

        // Get total enrolled students across all classes
        const totalEnrolledStudents = await StudentEnrollments.count({
            where: {
                course_class_id: { [Op.in]: classIds },
                status: { [Op.in]: ['enrolled', 'active'] }
            }
        });

        const dashboardData = {
            lecturer_info: {
                name: lecturer.user.full_name,
                email: lecturer.user.email,
                department: lecturer.department,
                specialization: lecturer.specialization
            },
            overview: {
                total_courses: courses.length,
                total_classes: classIds.length,
                total_enrolled_students: totalEnrolledStudents,
                active_sessions: activeSessions.length,
                unread_notifications: unreadNotifications
            },
            today_schedule: todaySessions,
            active_sessions: activeSessions,
            weekly_attendance_stats: thisWeekStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            recent_sessions: recentSessions,
            quick_actions: [
                { label: 'Buat Sesi Kehadiran', action: 'create_session', icon: 'plus' },
                { label: 'Lihat Kehadiran', action: 'view_attendance', icon: 'eye' },
                { label: 'Kelola Kelas', action: 'manage_classes', icon: 'users' },
                { label: 'Laporan Kehadiran', action: 'attendance_reports', icon: 'chart' },
                { label: 'Profil', action: 'profile', icon: 'user' }
            ]
        };

        res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        console.error('Get lecturer dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data dashboard"
        });
    }
};

/**
 * Get Student Dashboard Data  
 */
export const getStudentDashboard = async (req, res) => {
    try {
        if (req.session.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya mahasiswa yang dapat mengakses dashboard ini"
            });
        }

        const userId = req.session.userId;

        // Get student data
        const student = await Students.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['full_name', 'email', 'user_id']
                }
            ]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        // Get current date for filtering
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

        // Get student enrollments
        const enrollments = await StudentEnrollments.findAll({
            where: {
                student_id: student.id,
                status: { [Op.in]: ['enrolled', 'active'] }
            },
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            include: [
                                {
                                    model: Lecturers,
                                    as: 'lecturer',
                                    include: [
                                        {
                                            model: Users,
                                            as: 'user',
                                            attributes: ['full_name']
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        const classIds = enrollments.map(e => e.course_class_id);

        // Get today's sessions
        const todaySessions = await AttendanceSessions.findAll({
            where: {
                course_class_id: { [Op.in]: classIds },
                session_date: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            attributes: ['course_name', 'course_code']
                        }
                    ]
                }
            ],
            order: [['start_time', 'ASC']]
        });

        // Get student's attendance records for today's sessions
        const todaySessionIds = todaySessions.map(s => s.id);
        const todayAttendances = await StudentAttendances.findAll({
            where: {
                student_id: student.id,
                session_id: { [Op.in]: todaySessionIds }
            }
        });

        // Combine today's sessions with attendance status
        const todaySchedule = todaySessions.map(session => {
            const attendance = todayAttendances.find(a => a.session_id === session.id);
            return {
                ...session.toJSON(),
                attendance_status: attendance ? attendance.status : 'not_recorded',
                check_in_time: attendance ? attendance.check_in_time : null
            };
        });

        // Get recent attendance records
        const recentAttendances = await StudentAttendances.findAll({
            where: { student_id: student.id },
            order: [['created_at', 'DESC']],
            limit: 10,
            include: [
                {
                    model: AttendanceSessions,
                    as: 'session',
                    include: [
                        {
                            model: CourseClasses,
                            as: 'courseClass',
                            include: [
                                {
                                    model: Courses,
                                    as: 'course',
                                    attributes: ['course_name', 'course_code']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        // Get attendance statistics for current semester
        const attendanceStats = await StudentAttendances.findAll({
            where: { student_id: student.id },
            attributes: [
                'status',
                [db.fn('COUNT', db.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        // Calculate overall attendance rate
        const totalAttendances = attendanceStats.reduce((sum, stat) => sum + parseInt(stat.count), 0);
        const presentAttendances = attendanceStats
            .filter(stat => stat.status === 'present' || stat.status === 'late')
            .reduce((sum, stat) => sum + parseInt(stat.count), 0);
        const attendanceRate = totalAttendances > 0
            ? ((presentAttendances / totalAttendances) * 100).toFixed(2)
            : 0;

        // Get unread notifications
        const unreadNotifications = await Notifications.count({
            where: {
                user_id: userId,
                status: 'unread'
            }
        });

        // Check face dataset status
        const faceDataset = await FaceDatasets.findOne({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });

        const dashboardData = {
            student_info: {
                name: student.user.full_name,
                nim: student.user.user_id,
                email: student.user.email,
                program_study: student.program_study,
                semester: student.semester,
                entrance_year: student.entrance_year
            },
            overview: {
                total_courses: enrollments.length,
                attendance_rate: parseFloat(attendanceRate),
                unread_notifications: unreadNotifications,
                face_dataset_status: faceDataset ? faceDataset.verification_status : 'not_uploaded'
            },
            today_schedule: todaySchedule,
            enrolled_courses: enrollments.map(e => ({
                course_id: e.courseClass.course.id,
                course_name: e.courseClass.course.course_name,
                course_code: e.courseClass.course.course_code,
                class_name: e.courseClass.class_name,
                lecturer_name: e.courseClass.course.lecturer.user.full_name,
                schedule: {
                    day: e.courseClass.schedule_day,
                    start_time: e.courseClass.start_time,
                    end_time: e.courseClass.end_time
                }
            })),
            attendance_statistics: attendanceStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            recent_attendances: recentAttendances.slice(0, 5),
            quick_actions: [
                { label: 'Lihat Jadwal', action: 'view_schedule', icon: 'calendar' },
                { label: 'Riwayat Kehadiran', action: 'attendance_history', icon: 'list' },
                { label: 'Upload Foto Wajah', action: 'upload_face', icon: 'camera' },
                { label: 'Profil', action: 'profile', icon: 'user' },
                { label: 'Notifikasi', action: 'notifications', icon: 'bell' }
            ]
        };

        res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        console.error('Get student dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data dashboard"
        });
    }
};
