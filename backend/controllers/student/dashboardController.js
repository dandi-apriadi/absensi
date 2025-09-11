import {
    Users,
    Students,
    Lecturers,
    Courses,
    CourseClasses,
    StudentEnrollments,
    AttendanceSessions,
    StudentAttendances,
    FaceDatasets,
    db
} from "../../models/index.js";

// ===============================================
// STUDENT DASHBOARD CONTROLLERS
// ===============================================

/**
 * Get Student Dashboard
 */
export const getDashboard = async (req, res) => {
    try {
        // Check if user is student
        if (req.session.userRole !== 'student') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya mahasiswa yang diizinkan."
            });
        }

        // Get student details
        const student = await Students.findOne({
            where: { user_id: req.session.userId },
            include: [{
                model: Users,
                as: 'user',
                attributes: ['full_name', 'email']
            }]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        // Get enrolled classes for current academic year
        const enrolledClasses = await StudentEnrollments.findAll({
            where: {
                student_id: student.id,
                status: 'enrolled'
            },
            include: [{
                model: CourseClasses,
                as: 'class',
                include: [
                    {
                        model: Courses,
                        as: 'course'
                    },
                    {
                        model: Lecturers,
                        as: 'lecturer',
                        include: [{
                            model: Users,
                            as: 'user',
                            attributes: ['full_name']
                        }]
                    }
                ]
            }]
        });

        // Get today's schedule
        const today = new Date().toISOString().split('T')[0];
        const todaySchedule = await AttendanceSessions.findAll({
            where: {
                session_date: today,
                status: ['scheduled', 'ongoing']
            },
            include: [{
                model: CourseClasses,
                as: 'class',
                where: {
                    id: {
                        [db.Sequelize.Op.in]: enrolledClasses.map(enrollment => enrollment.class_id)
                    }
                },
                include: [
                    {
                        model: Courses,
                        as: 'course'
                    },
                    {
                        model: Lecturers,
                        as: 'lecturer',
                        include: [{
                            model: Users,
                            as: 'user',
                            attributes: ['full_name']
                        }]
                    }
                ]
            }],
            order: [['start_time', 'ASC']]
        });

        // Get upcoming sessions (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingSessions = await AttendanceSessions.findAll({
            where: {
                session_date: {
                    [db.Sequelize.Op.between]: [
                        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
                        nextWeek.toISOString().split('T')[0]
                    ]
                },
                status: 'scheduled'
            },
            include: [{
                model: CourseClasses,
                as: 'class',
                where: {
                    id: {
                        [db.Sequelize.Op.in]: enrolledClasses.map(enrollment => enrollment.class_id)
                    }
                },
                include: [{
                    model: Courses,
                    as: 'course'
                }]
            }],
            order: [['session_date', 'ASC'], ['start_time', 'ASC']],
            limit: 5
        });

        // Calculate attendance statistics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const attendanceStats = await StudentAttendances.findAll({
            where: {
                student_id: student.id,
                created_at: {
                    [db.Sequelize.Op.gte]: thirtyDaysAgo
                }
            },
            attributes: [
                'status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']
            ],
            group: ['status']
        });

        const stats = {
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            sick: 0
        };

        attendanceStats.forEach(stat => {
            stats[stat.status] = parseInt(stat.dataValues.count);
        });

        const totalSessions = Object.values(stats).reduce((sum, count) => sum + count, 0);
        const attendanceRate = totalSessions > 0
            ? Math.round((stats.present / totalSessions) * 100)
            : 0;

        // Get face dataset status
        const faceDataset = await FaceDatasets.findOne({
            where: {
                user_id: req.session.userId,
                verification_status: 'approved',
                is_primary: true
            }
        });

        const totalCredits = enrolledClasses.reduce((sum, enrollment) =>
            sum + (enrollment.class.course.credits || 0), 0
        );

        res.status(200).json({
            success: true,
            data: {
                student: {
                    name: student.user.full_name,
                    nim: student.nim,
                    program_study: student.program_study,
                    semester: student.semester,
                    gpa: student.gpa
                },
                statistics: {
                    enrolledClasses: enrolledClasses.length,
                    totalCredits,
                    attendanceRate,
                    totalSessions,
                    faceDatasetStatus: faceDataset ? 'approved' : 'pending'
                },
                attendanceBreakdown: stats,
                todaySchedule,
                upcomingSessions,
                enrolledClasses: enrolledClasses.map(enrollment => ({
                    id: enrollment.class.id,
                    courseName: enrollment.class.course.course_name,
                    courseCode: enrollment.class.course.course_code,
                    className: enrollment.class.class_name,
                    lecturerName: enrollment.class.lecturer.user.full_name,
                    credits: enrollment.class.course.credits,
                    roomName: enrollment.class.room?.room_name
                }))
            }
        });

    } catch (error) {
        console.error('Get student dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

// ===============================================
// COURSE SCHEDULE CONTROLLERS
// ===============================================

/**
 * Get Student's Course Schedule
 */
export const getMySchedule = async (req, res) => {
    try {
        if (req.session.userRole !== 'student') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya mahasiswa yang diizinkan."
            });
        }

        const { week_start, week_end } = req.query;

        // Get student details
        const student = await Students.findOne({
            where: { user_id: req.session.userId }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        // Get enrolled classes
        const enrolledClasses = await StudentEnrollments.findAll({
            where: {
                student_id: student.id,
                status: 'enrolled'
            },
            include: [{
                model: CourseClasses,
                as: 'class',
                include: [
                    {
                        model: Courses,
                        as: 'course'
                    },
                    {
                        model: Lecturers,
                        as: 'lecturer',
                        include: [{
                            model: Users,
                            as: 'user',
                            attributes: ['full_name']
                        }]
                    },
                    {
                        model: Rooms,
                        as: 'room'
                    }
                ]
            }]
        });

        // Build where clause for sessions
        const whereClause = {
            class_id: {
                [db.Sequelize.Op.in]: enrolledClasses.map(enrollment => enrollment.class_id)
            }
        };

        if (week_start && week_end) {
            whereClause.session_date = {
                [db.Sequelize.Op.between]: [week_start, week_end]
            };
        }

        // Get attendance sessions for the classes
        const sessions = await AttendanceSessions.findAll({
            where: whereClause,
            include: [
                {
                    model: CourseClasses,
                    as: 'class',
                    include: [
                        {
                            model: Courses,
                            as: 'course'
                        },
                        {
                            model: Lecturers,
                            as: 'lecturer',
                            include: [{
                                model: Users,
                                as: 'user',
                                attributes: ['full_name']
                            }]
                        }
                    ]
                },
                {
                    model: Rooms,
                    as: 'room'
                },
                {
                    model: StudentAttendances,
                    as: 'attendances',
                    where: { student_id: student.id },
                    required: false
                }
            ],
            order: [['session_date', 'ASC'], ['start_time', 'ASC']]
        });

        // Group sessions by date
        const scheduleByDate = {};
        sessions.forEach(session => {
            const date = session.session_date;
            if (!scheduleByDate[date]) {
                scheduleByDate[date] = [];
            }

            const attendance = session.attendances.length > 0 ? session.attendances[0] : null;

            scheduleByDate[date].push({
                sessionId: session.id,
                sessionNumber: session.session_number,
                courseName: session.class.course.course_name,
                courseCode: session.class.course.course_code,
                className: session.class.class_name,
                lecturerName: session.class.lecturer.user.full_name,
                startTime: session.start_time,
                endTime: session.end_time,
                roomName: session.room?.room_name,
                topic: session.topic,
                sessionType: session.session_type,
                status: session.status,
                attendanceStatus: attendance?.status || null,
                attendanceMethod: session.attendance_method
            });
        });

        res.status(200).json({
            success: true,
            data: {
                scheduleByDate,
                enrolledClasses: enrolledClasses.map(enrollment => ({
                    id: enrollment.class.id,
                    courseName: enrollment.class.course.course_name,
                    courseCode: enrollment.class.course.course_code,
                    className: enrollment.class.class_name,
                    lecturerName: enrollment.class.lecturer.user.full_name,
                    schedule: enrollment.class.schedule
                }))
            }
        });

    } catch (error) {
        console.error('Get student schedule error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

// ===============================================
// ATTENDANCE CONTROLLERS
// ===============================================

/**
 * Get Student's Attendance History
 */
export const getMyAttendance = async (req, res) => {
    try {
        if (req.session.userRole !== 'student') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya mahasiswa yang diizinkan."
            });
        }

        const {
            page = 1,
            limit = 10,
            class_id,
            status,
            date_from,
            date_to
        } = req.query;

        // Get student details
        const student = await Students.findOne({
            where: { user_id: req.session.userId }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        // Build where clause
        const whereClause = { student_id: student.id };

        if (status) {
            whereClause.status = status;
        }

        // Build session where clause
        const sessionWhereClause = {};

        if (class_id) {
            sessionWhereClause.class_id = parseInt(class_id);
        }

        if (date_from && date_to) {
            sessionWhereClause.session_date = {
                [db.Sequelize.Op.between]: [date_from, date_to]
            };
        } else if (date_from) {
            sessionWhereClause.session_date = {
                [db.Sequelize.Op.gte]: date_from
            };
        } else if (date_to) {
            sessionWhereClause.session_date = {
                [db.Sequelize.Op.lte]: date_to
            };
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get attendance records with pagination
        const { count, rows: attendances } = await StudentAttendances.findAndCountAll({
            where: whereClause,
            include: [{
                model: AttendanceSessions,
                as: 'session',
                where: sessionWhereClause,
                include: [{
                    model: CourseClasses,
                    as: 'class',
                    include: [
                        {
                            model: Courses,
                            as: 'course'
                        },
                        {
                            model: Lecturers,
                            as: 'lecturer',
                            include: [{
                                model: Users,
                                as: 'user',
                                attributes: ['full_name']
                            }]
                        }
                    ]
                }, {
                    model: Rooms,
                    as: 'room'
                }]
            }],
            order: [['session', 'session_date', 'DESC'], ['session', 'start_time', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / parseInt(limit));

        // Get attendance statistics
        const stats = await StudentAttendances.findAll({
            where: { student_id: student.id },
            attributes: [
                'status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']
            ],
            group: ['status']
        });

        const attendanceStats = {
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            sick: 0
        };

        stats.forEach(stat => {
            attendanceStats[stat.status] = parseInt(stat.dataValues.count);
        });

        const totalRecords = Object.values(attendanceStats).reduce((sum, count) => sum + count, 0);
        const attendanceRate = totalRecords > 0
            ? Math.round((attendanceStats.present / totalRecords) * 100)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                attendances,
                statistics: {
                    ...attendanceStats,
                    totalRecords,
                    attendanceRate
                },
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get student attendance error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Check In Attendance (QR Code Method)
 */
export const checkInAttendance = async (req, res) => {
    try {
        if (req.session.userRole !== 'student') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya mahasiswa yang diizinkan."
            });
        }

        const { qr_code, location_lat, location_lng } = req.body;

        if (!qr_code) {
            return res.status(400).json({
                success: false,
                message: "QR Code harus disediakan"
            });
        }

        // Get student details
        const student = await Students.findOne({
            where: { user_id: req.session.userId }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        // Find attendance session by QR code
        const session = await AttendanceSessions.findOne({
            where: {
                qr_code,
                status: 'ongoing',
                qr_expire_time: {
                    [db.Sequelize.Op.gt]: new Date()
                }
            },
            include: [{
                model: CourseClasses,
                as: 'class',
                include: [{
                    model: StudentEnrollments,
                    as: 'enrollments',
                    where: { student_id: student.id },
                    required: true
                }]
            }]
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "QR Code tidak valid, sudah kedaluwarsa, atau Anda tidak terdaftar di kelas ini"
            });
        }

        // Check if student already checked in
        const existingAttendance = await StudentAttendances.findOne({
            where: {
                session_id: session.id,
                student_id: student.id
            }
        });

        if (existingAttendance) {
            return res.status(409).json({
                success: false,
                message: "Anda sudah melakukan absensi untuk sesi ini",
                data: {
                    attendance: existingAttendance
                }
            });
        }

        // Determine attendance status based on time
        const now = new Date();
        const sessionStart = new Date(`${session.session_date}T${session.start_time}`);
        const lateThreshold = new Date(sessionStart.getTime() + 15 * 60000); // 15 minutes late

        let attendanceStatus = 'present';
        if (now > lateThreshold) {
            attendanceStatus = 'late';
        }

        // Create attendance record
        const attendance = await StudentAttendances.create({
            session_id: session.id,
            student_id: student.id,
            status: attendanceStatus,
            check_in_time: now,
            attendance_method: 'qr_code',
            location_lat: location_lat || null,
            location_lng: location_lng || null
        });

        res.status(201).json({
            success: true,
            message: `Absensi berhasil! Status: ${attendanceStatus}`,
            data: {
                attendance: {
                    id: attendance.id,
                    status: attendance.status,
                    check_in_time: attendance.check_in_time,
                    session: {
                        id: session.id,
                        session_number: session.session_number,
                        topic: session.topic,
                        class: session.class
                    }
                }
            }
        });

    } catch (error) {
        console.error('Check in attendance error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Get Available Sessions for Check-in
 */
export const getAvailableSessions = async (req, res) => {
    try {
        if (req.session.userRole !== 'student') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya mahasiswa yang diizinkan."
            });
        }

        // Get student details
        const student = await Students.findOne({
            where: { user_id: req.session.userId }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        // Get enrolled classes
        const enrolledClasses = await StudentEnrollments.findAll({
            where: {
                student_id: student.id,
                status: 'enrolled'
            },
            attributes: ['class_id']
        });

        const classIds = enrolledClasses.map(enrollment => enrollment.class_id);

        // Get today's ongoing sessions where student can check in
        const today = new Date().toISOString().split('T')[0];

        const availableSessions = await AttendanceSessions.findAll({
            where: {
                session_date: today,
                status: 'ongoing',
                class_id: {
                    [db.Sequelize.Op.in]: classIds
                },
                qr_expire_time: {
                    [db.Sequelize.Op.gt]: new Date()
                }
            },
            include: [
                {
                    model: CourseClasses,
                    as: 'class',
                    include: [{
                        model: Courses,
                        as: 'course'
                    }]
                },
                {
                    model: Rooms,
                    as: 'room'
                },
                {
                    model: StudentAttendances,
                    as: 'attendances',
                    where: { student_id: student.id },
                    required: false
                }
            ]
        });

        // Filter out sessions where student already checked in
        const sessionsWithoutAttendance = availableSessions.filter(session =>
            session.attendances.length === 0
        );

        res.status(200).json({
            success: true,
            data: {
                availableSessions: sessionsWithoutAttendance.map(session => ({
                    id: session.id,
                    sessionNumber: session.session_number,
                    courseName: session.class.course.course_name,
                    courseCode: session.class.course.course_code,
                    className: session.class.class_name,
                    topic: session.topic,
                    startTime: session.start_time,
                    endTime: session.end_time,
                    roomName: session.room?.room_name,
                    qrExpireTime: session.qr_expire_time,
                    attendanceMethod: session.attendance_method
                }))
            }
        });

    } catch (error) {
        console.error('Get available sessions error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};
