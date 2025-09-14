import {
    AttendanceSessions,
    StudentAttendances,
    CourseClasses,
    Users,
    Courses,
    FaceDatasets,
    FaceRecognitionLogs,
    getUserWithRoleDetails,
    db
} from "../../models/index.js";
import { Op } from "sequelize";

// ===============================================
// ATTENDANCE MANAGEMENT CONTROLLERS
// ===============================================

/**
 * Create attendance session (Lecturer only)
 */
export const createAttendanceSession = async (req, res) => {
    try {
        if (req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang dapat membuat sesi kehadiran"
            });
        }

        const {
            course_class_id,
            session_name,
            session_date,
            start_time,
            end_time,
            attendance_method,
            location,
            notes
        } = req.body;

        const lecturerId = req.session.userId;

        // Validation
        if (!course_class_id || !session_name || !session_date || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib harus diisi"
            });
        }

        // Check if course class exists and lecturer has access
        const courseClass = await CourseClasses.findOne({
            where: { id: course_class_id },
            include: [
                {
                    model: Courses,
                    as: 'course',
                    where: { lecturer_id: lecturerId }
                }
            ]
        });

        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan atau Anda tidak memiliki akses"
            });
        }

        // Check if session with same date and time already exists
        const existingSession = await AttendanceSessions.findOne({
            where: {
                course_class_id,
                session_date,
                start_time: {
                    [Op.between]: [start_time, end_time]
                }
            }
        });

        if (existingSession) {
            return res.status(400).json({
                success: false,
                message: "Sudah ada sesi kehadiran pada waktu yang sama"
            });
        }

        const session = await AttendanceSessions.create({
            course_class_id,
            session_name,
            session_date,
            start_time,
            end_time,
            attendance_method: attendance_method || 'manual',
            location,
            notes,
            status: 'scheduled',
            created_by: lecturerId
        });

        res.status(201).json({
            success: true,
            message: "Sesi kehadiran berhasil dibuat",
            data: session
        });
    } catch (error) {
        console.error('Create attendance session error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat sesi kehadiran"
        });
    }
};

/**
 * Get attendance sessions for a class
 */
export const getAttendanceSessions = async (req, res) => {
    try {
        const { course_class_id } = req.params;
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = { course_class_id };
        if (status) {
            whereClause.status = status;
        }

        const sessions = await AttendanceSessions.findAndCountAll({
            where: whereClause,
            order: [['session_date', 'DESC'], ['start_time', 'DESC']],
            limit: parseInt(limit),
            offset: offset,
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
                },
                {
                    model: Users,
                    as: 'creator',
                    attributes: ['full_name', 'role']
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                sessions: sessions.rows,
                pagination: {
                    total: sessions.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(sessions.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get attendance sessions error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil sesi kehadiran"
        });
    }
};

/**
 * Start attendance session (Lecturer only)
 */
export const startAttendanceSession = async (req, res) => {
    try {
        if (req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang dapat memulai sesi kehadiran"
            });
        }

        const { id } = req.params;
        const lecturerId = req.session.userId;

        const session = await AttendanceSessions.findOne({
            where: { id },
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            where: { lecturer_id: lecturerId }
                        }
                    ]
                }
            ]
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Sesi kehadiran tidak ditemukan atau Anda tidak memiliki akses"
            });
        }

        if (session.status !== 'scheduled') {
            return res.status(400).json({
                success: false,
                message: "Sesi kehadiran sudah dimulai atau selesai"
            });
        }

        await session.update({
            status: 'active',
            actual_start_time: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Sesi kehadiran berhasil dimulai",
            data: session
        });
    } catch (error) {
        console.error('Start attendance session error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memulai sesi kehadiran"
        });
    }
};

/**
 * End attendance session (Lecturer only)
 */
export const endAttendanceSession = async (req, res) => {
    try {
        if (req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang dapat mengakhiri sesi kehadiran"
            });
        }

        const { id } = req.params;
        const lecturerId = req.session.userId;

        const session = await AttendanceSessions.findOne({
            where: { id },
            include: [
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    include: [
                        {
                            model: Courses,
                            as: 'course',
                            where: { lecturer_id: lecturerId }
                        }
                    ]
                }
            ]
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Sesi kehadiran tidak ditemukan atau Anda tidak memiliki akses"
            });
        }

        if (session.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: "Sesi kehadiran belum dimulai atau sudah selesai"
            });
        }

        await session.update({
            status: 'completed',
            actual_end_time: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Sesi kehadiran berhasil diakhiri",
            data: session
        });
    } catch (error) {
        console.error('End attendance session error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengakhiri sesi kehadiran"
        });
    }
};

/**
 * Record student attendance (Manual)
 */
export const recordAttendance = async (req, res) => {
    try {
        const { session_id, student_id, status, notes } = req.body;
        const recordedBy = req.session.userId;
        const recordedByRole = req.session.role;

        // Validation
        if (!session_id || !student_id || !status) {
            return res.status(400).json({
                success: false,
                message: "Session ID, Student ID, dan status harus diisi"
            });
        }

        // Check if session exists and is active
        const session = await AttendanceSessions.findOne({
            where: { id: session_id, status: 'active' }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Sesi kehadiran tidak ditemukan atau tidak aktif"
            });
        }        // Check if student exists
        const student = await Users.findOne({
            where: {
                id: student_id,
                role: 'student'
            }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Mahasiswa tidak ditemukan"
            });
        }

        // Check if attendance already recorded
        const existingAttendance = await StudentAttendances.findOne({
            where: { session_id, student_id }
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: "Kehadiran mahasiswa sudah tercatat untuk sesi ini"
            });
        }

        const attendance = await StudentAttendances.create({
            session_id,
            student_id,
            status,
            check_in_time: status === 'present' ? new Date() : null,
            attendance_method: 'manual',
            notes,
            verified_by: recordedByRole === 'lecturer' ? recordedBy : null,
            verification_status: recordedByRole === 'lecturer' ? 'verified' : 'pending'
        });

        res.status(201).json({
            success: true,
            message: "Kehadiran berhasil dicatat",
            data: attendance
        });
    } catch (error) {
        console.error('Record attendance error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mencatat kehadiran"
        });
    }
};

/**
 * Record attendance via face recognition
 */
export const recordAttendanceByFace = async (req, res) => {
    try {
        const { session_id, recognized_user_id, confidence_score, face_image_path } = req.body;

        // Validation
        if (!session_id || !recognized_user_id || !confidence_score) {
            return res.status(400).json({
                success: false,
                message: "Session ID, User ID, dan confidence score harus diisi"
            });
        }

        // Check if session exists and is active
        const session = await AttendanceSessions.findOne({
            where: { id: session_id, status: 'active' }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Sesi kehadiran tidak ditemukan atau tidak aktif"
            });
        }        // Check if user is a student
        const student = await Users.findOne({
            where: {
                id: recognized_user_id,
                role: 'student'
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Mahasiswa tidak ditemukan"
            });
        }

        // Check confidence threshold (assuming minimum 0.8)
        if (confidence_score < 0.8) {
            return res.status(400).json({
                success: false,
                message: "Confidence score terlalu rendah untuk verifikasi wajah"
            });
        }

        // Check if attendance already recorded
        const existingAttendance = await StudentAttendances.findOne({
            where: { session_id, student_id: student.id }
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: "Kehadiran mahasiswa sudah tercatat untuk sesi ini"
            });
        }

        // Create face recognition log
        const faceLog = await FaceRecognitionLogs.create({
            session_id,
            recognized_user_id,
            confidence_score,
            recognition_time: new Date(),
            face_image_path,
            status: 'success'
        });

        // Record attendance
        const attendance = await StudentAttendances.create({
            session_id,
            student_id: student.id,
            status: 'present',
            check_in_time: new Date(),
            attendance_method: 'face_recognition',
            face_recognition_log_id: faceLog.id,
            verification_status: 'auto_verified'
        });

        res.status(201).json({
            success: true,
            message: "Kehadiran berhasil dicatat melalui pengenalan wajah",
            data: { attendance, faceLog }
        });
    } catch (error) {
        console.error('Record attendance by face error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mencatat kehadiran melalui pengenalan wajah"
        });
    }
};

/**
 * Get attendance records for a session
 */
export const getSessionAttendances = async (req, res) => {
    try {
        const { session_id } = req.params;
        const { page = 1, limit = 50, status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = { session_id };
        if (status) {
            whereClause.status = status;
        }

        const attendances = await StudentAttendances.findAndCountAll({
            where: whereClause,
            order: [['check_in_time', 'ASC']],
            limit: parseInt(limit),
            offset: offset, include: [
                {
                    model: Users,
                    as: 'student',
                    where: { role: 'student' },
                    attributes: ['id', 'user_id', 'full_name', 'email', 'program_study', 'semester']
                },
                {
                    model: Users,
                    as: 'verifier',
                    attributes: ['full_name', 'role'],
                    required: false
                },
                {
                    model: FaceRecognitionLogs,
                    as: 'faceRecognitionLog',
                    required: false
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                attendances: attendances.rows,
                pagination: {
                    total: attendances.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(attendances.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get session attendances error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kehadiran sesi"
        });
    }
};

/**
 * Get attendance statistics for a class
 */
export const getAttendanceStatistics = async (req, res) => {
    try {
        const { course_class_id } = req.params;

        // Get all sessions for this class
        const sessions = await AttendanceSessions.findAll({
            where: { course_class_id },
            attributes: ['id', 'session_name', 'session_date']
        });

        if (sessions.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    total_sessions: 0,
                    attendance_summary: {},
                    student_statistics: []
                }
            });
        }

        const sessionIds = sessions.map(s => s.id);

        // Get attendance counts by status
        const attendanceSummary = await StudentAttendances.findAll({
            where: { session_id: { [Op.in]: sessionIds } },
            attributes: [
                'status',
                [db.fn('COUNT', db.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        // Get student statistics
        const studentStats = await StudentAttendances.findAll({
            where: { session_id: { [Op.in]: sessionIds } },
            attributes: [
                'student_id',
                'status',
                [db.fn('COUNT', db.col('StudentAttendances.id')), 'count']
            ], include: [
                {
                    model: Users,
                    as: 'student',
                    where: { role: 'student' },
                    attributes: ['id', 'user_id', 'full_name']
                }
            ],
            group: ['student_id', 'status', 'student.id'],
            raw: false
        });

        // Process summary data
        const summary = {};
        attendanceSummary.forEach(item => {
            summary[item.status] = parseInt(item.count);
        });

        res.status(200).json({
            success: true,
            data: {
                total_sessions: sessions.length,
                attendance_summary: summary,
                student_statistics: studentStats
            }
        });
    } catch (error) {
        console.error('Get attendance statistics error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik kehadiran"
        });
    }
};

/**
 * Update attendance status (Lecturer only)
 */
export const updateAttendanceStatus = async (req, res) => {
    try {
        if (req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya dosen yang dapat mengubah status kehadiran"
            });
        }

        const { id } = req.params;
        const { status, notes } = req.body;
        const verifiedBy = req.session.userId;

        const attendance = await StudentAttendances.findByPk(id);
        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Data kehadiran tidak ditemukan"
            });
        }

        await attendance.update({
            status,
            notes: notes || attendance.notes,
            verified_by: verifiedBy,
            verification_status: 'verified'
        });

        res.status(200).json({
            success: true,
            message: "Status kehadiran berhasil diperbarui",
            data: attendance
        });
    } catch (error) {
        console.error('Update attendance status error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui status kehadiran"
        });
    }
};

/**
 * Check user room access for face recognition system
 */
export const checkUserRoomAccess = async (req, res) => {
    try {
        const { user_id, date } = req.body;

        // Validation
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user_id diperlukan",
                data: null
            });
        }

        const checkDate = date || new Date().toISOString().split('T')[0];

        // Manual query since we don't use Sequelize associations
        const [sessions] = await db.query(`
            SELECT 
                ats.id as session_id,
                ats.session_date,
                ats.start_time,
                ats.end_time,
                ats.session_name as topic,
                cc.class_name,
                c.course_name
            FROM attendance_sessions ats
            JOIN course_classes cc ON ats.class_id = cc.id
            JOIN courses c ON cc.course_id = c.id
            JOIN class_students cs ON cc.id = cs.class_id
            WHERE cs.student_id = :user_id 
            AND ats.session_date = :session_date
            AND ats.status = 'active'
            ORDER BY ats.start_time
        `, {
            replacements: { 
                user_id: user_id, 
                session_date: checkDate 
            },
            type: db.QueryTypes.SELECT
        });

        if (sessions && sessions.length > 0) {
            return res.status(200).json({
                success: true,
                data: {
                    allowed: true,
                    sessions: sessions,
                    reason: 'Has scheduled classes today'
                }
            });
        } else {
            return res.status(200).json({
                success: true,
                data: {
                    allowed: false,
                    sessions: [],
                    reason: 'No scheduled classes today'
                }
            });
        }

    } catch (error) {
        console.error('Check user room access error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memeriksa akses ruangan",
            data: null
        });
    }
};
