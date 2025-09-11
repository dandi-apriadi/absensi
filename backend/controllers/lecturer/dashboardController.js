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
    getCourseClassDetails,
    getAttendanceSessionDetails,
    db
} from "../../models/index.js";

// ===============================================
// LECTURER DASHBOARD CONTROLLERS
// ===============================================

/**
 * Get Lecturer Dashboard
 */
export const getDashboard = async (req, res) => {
    try {
        // Check if user is lecturer
        if (req.session.userRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang diizinkan."
            });
        }

        // Get lecturer details
        const lecturer = await Lecturers.findOne({
            where: { user_id: req.session.userId },
            include: [{
                model: Users,
                as: 'user',
                attributes: ['full_name', 'email']
            }]
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Data dosen tidak ditemukan"
            });
        }

        // Get lecturer's classes for current academic year
        const currentYear = new Date().getFullYear();
        const academicYear = `${currentYear}/${currentYear + 1}`;

        const myClasses = await CourseClasses.findAll({
            where: {
                lecturer_id: lecturer.id,
                academic_year: academicYear,
                status: 'active'
            },
            include: [
                {
                    model: Courses,
                    as: 'course'
                },
                {
                    model: StudentEnrollments,
                    as: 'enrollments',
                    where: { status: 'enrolled' },
                    required: false
                }
            ]
        });

        // Get today's sessions
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = await AttendanceSessions.findAll({
            where: {
                session_date: today,
                created_by: lecturer.id
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
                }
            ],
            order: [['start_time', 'ASC']]
        });

        // Get upcoming sessions (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingSessions = await AttendanceSessions.findAll({
            where: {
                session_date: {
                    [db.Sequelize.Op.between]: [today, nextWeek.toISOString().split('T')[0]]
                },
                created_by: lecturer.id,
                status: 'scheduled'
            },
            include: [
                {
                    model: CourseClasses,
                    as: 'class',
                    include: [{
                        model: Courses,
                        as: 'course'
                    }]
                }
            ],
            order: [['session_date', 'ASC'], ['start_time', 'ASC']],
            limit: 5
        });

        // Get recent attendance statistics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentSessions = await AttendanceSessions.findAll({
            where: {
                created_by: lecturer.id,
                session_date: {
                    [db.Sequelize.Op.gte]: thirtyDaysAgo.toISOString().split('T')[0]
                },
                status: 'completed'
            },
            include: [{
                model: StudentAttendances,
                as: 'attendances'
            }]
        });

        // Calculate statistics
        const totalClasses = myClasses.length;
        const totalStudents = myClasses.reduce((sum, cls) => sum + (cls.enrollments?.length || 0), 0);
        const todaySessionsCount = todaySessions.length;
        const completedSessionsCount = recentSessions.length;

        // Calculate attendance rate
        let totalAttendanceRecords = 0;
        let presentCount = 0;

        recentSessions.forEach(session => {
            session.attendances.forEach(attendance => {
                totalAttendanceRecords++;
                if (attendance.status === 'present') {
                    presentCount++;
                }
            });
        });

        const attendanceRate = totalAttendanceRecords > 0
            ? Math.round((presentCount / totalAttendanceRecords) * 100)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                lecturer: {
                    name: lecturer.user.full_name,
                    nip: lecturer.nip,
                    department: lecturer.department,
                    position: lecturer.position
                },
                statistics: {
                    totalClasses,
                    totalStudents,
                    todaySessionsCount,
                    completedSessionsCount,
                    attendanceRate
                },
                todaySessions,
                upcomingSessions,
                myClasses: myClasses.map(cls => ({
                    id: cls.id,
                    courseName: cls.course.course_name,
                    courseCode: cls.course.course_code,
                    className: cls.class_name,
                    studentCount: cls.enrollments?.length || 0,
                    credits: cls.course.credits
                }))
            }
        });

    } catch (error) {
        console.error('Get lecturer dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

// ===============================================
// COURSE MANAGEMENT CONTROLLERS
// ===============================================

/**
 * Get Lecturer's Courses
 */
export const getMyCourses = async (req, res) => {
    try {
        if (req.session.userRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang diizinkan."
            });
        }

        const {
            page = 1,
            limit = 10,
            academic_year,
            status = 'active'
        } = req.query;

        // Get lecturer details
        const lecturer = await Lecturers.findOne({
            where: { user_id: req.session.userId }
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Data dosen tidak ditemukan"
            });
        }

        // Build where clause
        const whereClause = {
            lecturer_id: lecturer.id,
            status
        };

        if (academic_year) {
            whereClause.academic_year = academic_year;
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get courses with pagination
        const { count, rows: courses } = await CourseClasses.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Courses,
                    as: 'course'
                },
                {
                    model: Rooms,
                    as: 'room'
                },
                {
                    model: StudentEnrollments,
                    as: 'enrollments',
                    where: { status: 'enrolled' },
                    required: false,
                    include: [{
                        model: Students,
                        as: 'student',
                        include: [{
                            model: Users,
                            as: 'user',
                            attributes: ['full_name', 'email']
                        }]
                    }]
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                courses,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get lecturer courses error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Get Course Class Details
 */
export const getCourseDetails = async (req, res) => {
    try {
        if (req.session.userRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang diizinkan."
            });
        }

        const { classId } = req.params;

        // Get lecturer details
        const lecturer = await Lecturers.findOne({
            where: { user_id: req.session.userId }
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Data dosen tidak ditemukan"
            });
        }

        // Get course class details
        const courseClass = await getCourseClassDetails(parseInt(classId));

        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        // Check if this lecturer owns this class
        if (courseClass.lecturer_id !== lecturer.id) {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke kelas ini"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                courseClass
            }
        });

    } catch (error) {
        console.error('Get course details error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

// ===============================================
// ATTENDANCE SESSION MANAGEMENT
// ===============================================

/**
 * Create Attendance Session
 */
export const createAttendanceSession = async (req, res) => {
    try {
        if (req.session.userRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang diizinkan."
            });
        }

        const {
            class_id,
            session_number,
            session_date,
            start_time,
            end_time,
            room_id,
            topic,
            session_type = 'regular',
            attendance_method = 'face_recognition',
            notes
        } = req.body;

        // Validation
        if (!class_id || !session_number || !session_date || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "Data wajib harus diisi"
            });
        }

        // Get lecturer details
        const lecturer = await Lecturers.findOne({
            where: { user_id: req.session.userId }
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Data dosen tidak ditemukan"
            });
        }

        // Verify the class belongs to this lecturer
        const courseClass = await CourseClasses.findOne({
            where: {
                id: parseInt(class_id),
                lecturer_id: lecturer.id
            }
        });

        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan atau bukan milik Anda"
            });
        }

        // Check if session already exists
        const existingSession = await AttendanceSessions.findOne({
            where: {
                class_id: parseInt(class_id),
                session_number: parseInt(session_number)
            }
        });

        if (existingSession) {
            return res.status(409).json({
                success: false,
                message: "Sesi dengan nomor pertemuan ini sudah ada"
            });
        }

        // Generate QR code if method includes QR
        let qrCode = null;
        let qrExpireTime = null;

        if (attendance_method === 'qr_code' || attendance_method === 'mixed') {
            // Generate simple QR code data (in production, use proper QR library)
            qrCode = `attendance_${class_id}_${session_number}_${Date.now()}`;

            // Set QR expire time (default 30 minutes after start)
            const sessionStart = new Date(`${session_date}T${start_time}`);
            qrExpireTime = new Date(sessionStart.getTime() + 30 * 60000);
        }

        // Create attendance session
        const newSession = await AttendanceSessions.create({
            class_id: parseInt(class_id),
            session_number: parseInt(session_number),
            session_date,
            start_time,
            end_time,
            room_id: room_id ? parseInt(room_id) : null,
            topic,
            session_type,
            attendance_method,
            qr_code: qrCode,
            qr_expire_time: qrExpireTime,
            notes,
            created_by: lecturer.id,
            status: 'scheduled'
        });

        // Get complete session data
        const completeSession = await getAttendanceSessionDetails(newSession.id);

        res.status(201).json({
            success: true,
            message: "Sesi absensi berhasil dibuat",
            data: {
                session: completeSession
            }
        });

    } catch (error) {
        console.error('Create attendance session error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Get Attendance Sessions
 */
export const getAttendanceSessions = async (req, res) => {
    try {
        if (req.session.userRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang diizinkan."
            });
        }

        const {
            page = 1,
            limit = 10,
            class_id,
            status,
            session_date,
            session_type
        } = req.query;

        // Get lecturer details
        const lecturer = await Lecturers.findOne({
            where: { user_id: req.session.userId }
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Data dosen tidak ditemukan"
            });
        }

        // Build where clause
        const whereClause = { created_by: lecturer.id };

        if (class_id) {
            whereClause.class_id = parseInt(class_id);
        }
        if (status) {
            whereClause.status = status;
        }
        if (session_date) {
            whereClause.session_date = session_date;
        }
        if (session_type) {
            whereClause.session_type = session_type;
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get sessions with pagination
        const { count, rows: sessions } = await AttendanceSessions.findAndCountAll({
            where: whereClause,
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
                    include: [{
                        model: Students,
                        as: 'student',
                        include: [{
                            model: Users,
                            as: 'user',
                            attributes: ['full_name']
                        }]
                    }]
                }
            ],
            order: [['session_date', 'DESC'], ['start_time', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                sessions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get attendance sessions error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Start Attendance Session
 */
export const startAttendanceSession = async (req, res) => {
    try {
        if (req.session.userRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang diizinkan."
            });
        }

        const { sessionId } = req.params;

        // Get lecturer details
        const lecturer = await Lecturers.findOne({
            where: { user_id: req.session.userId }
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Data dosen tidak ditemukan"
            });
        }

        // Find session
        const session = await AttendanceSessions.findOne({
            where: {
                id: parseInt(sessionId),
                created_by: lecturer.id
            }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Sesi tidak ditemukan"
            });
        }

        // Check if session can be started
        if (session.status !== 'scheduled') {
            return res.status(400).json({
                success: false,
                message: `Sesi tidak dapat dimulai. Status saat ini: ${session.status}`
            });
        }

        // Update session status and set attendance open time
        await session.update({
            status: 'ongoing',
            attendance_open_time: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Sesi absensi berhasil dimulai",
            data: {
                session: {
                    id: session.id,
                    status: session.status,
                    attendance_open_time: session.attendance_open_time,
                    qr_code: session.qr_code
                }
            }
        });

    } catch (error) {
        console.error('Start attendance session error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * End Attendance Session
 */
export const endAttendanceSession = async (req, res) => {
    try {
        if (req.session.userRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang diizinkan."
            });
        }

        const { sessionId } = req.params;

        // Get lecturer details
        const lecturer = await Lecturers.findOne({
            where: { user_id: req.session.userId }
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Data dosen tidak ditemukan"
            });
        }

        // Find session
        const session = await AttendanceSessions.findOne({
            where: {
                id: parseInt(sessionId),
                created_by: lecturer.id
            }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Sesi tidak ditemukan"
            });
        }

        // Check if session can be ended
        if (session.status !== 'ongoing') {
            return res.status(400).json({
                success: false,
                message: `Sesi tidak dapat diakhiri. Status saat ini: ${session.status}`
            });
        }

        // Update session status and set attendance close time
        await session.update({
            status: 'completed',
            attendance_close_time: new Date()
        });

        // Get attendance summary
        const attendanceSummary = await StudentAttendances.findAll({
            where: { session_id: session.id },
            attributes: [
                'status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']
            ],
            group: ['status']
        });

        const summary = {};
        attendanceSummary.forEach(item => {
            summary[item.status] = parseInt(item.dataValues.count);
        });

        res.status(200).json({
            success: true,
            message: "Sesi absensi berhasil diakhiri",
            data: {
                session: {
                    id: session.id,
                    status: session.status,
                    attendance_close_time: session.attendance_close_time
                },
                attendanceSummary: summary
            }
        });

    } catch (error) {
        console.error('End attendance session error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};
