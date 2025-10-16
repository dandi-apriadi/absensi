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
 * Record attendance from edge device (smart) using user_id and class_id
 * Responsibilities:
 * - Create session for today if not exists (scheduled/active window)
 * - Prevent duplicate attendance per student per day per class
 * - Log face recognition confidence to FaceRecognitionLogs
 */
export const recordAttendanceSmart = async (req, res) => {
    try {
        const { user_id, class_id, confidence_score } = req.body;
        if (!user_id || !class_id) {
            return res.status(400).json({ success: false, message: 'user_id dan class_id wajib diisi' });
        }

        // Verify user exists and is student (edge may send lecturer for access but attendance is for students)
        const student = await Users.findOne({ where: { user_id } });
        if (!student) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10);

        // Find or create today's session for this class (align with model fields)
        let session = await AttendanceSessions.findOne({
            where: {
                class_id: class_id,
                session_date: dateStr
            },
            order: [['created_at', 'DESC']]
        });

        if (!session) {
            // Create minimal session window (08:00-17:00 default) and compute session_number
            const countForClass = await AttendanceSessions.count({ where: { class_id: class_id } });
            const nextSessionNumber = countForClass + 1;

            session = await AttendanceSessions.create({
                class_id: class_id,
                session_number: nextSessionNumber,
                session_date: dateStr,
                start_time: '08:00:00',
                end_time: '17:00:00',
                session_type: 'regular',
                attendance_method: 'face_recognition',
                status: 'ongoing'
            });
        } else if (session.status === 'scheduled') {
            // Move scheduled session to ongoing; model doesn't have actual_start_time
            await session.update({ status: 'ongoing', attendance_open_time: new Date() });
        }

        // Prevent duplicate attendance for same class and same day
        const existing = await StudentAttendances.findOne({
            where: {
                session_id: session.id,
                student_id: student.user_id
            }
        });
        if (existing) {
            return res.status(200).json({
                success: false,
                message: 'Sudah absen hari ini untuk kelas ini',
                data: {
                    session_id: session.id,
                    check_in_time: existing.check_in_time
                }
            });
        }

        // Create face recognition log
        await FaceRecognitionLogs.create({
            session_id: session.id,
            recognized_user_id: student.user_id,
            confidence_score: confidence_score ?? 0.95,
            recognition_status: 'success'
        });

        // Record attendance
        const attendance = await StudentAttendances.create({
            session_id: session.id,
            student_id: student.user_id,
            status: 'present',
            check_in_time: new Date(),
            attendance_method: 'face_recognition',
            confidence_score: confidence_score ?? 0.95
        });

        return res.status(201).json({
            success: true,
            message: 'Absensi berhasil dicatat',
            data: {
                session_id: session.id,
                check_in_time: attendance.check_in_time,
                attendance_id: attendance.id
            }
        });

    } catch (error) {
        console.error('Record attendance smart error:', error);
        return res.status(500).json({ success: false, message: 'Gagal mencatat absensi' });
    }
};

/**
 * Get today's attendance simple list for UI (name, time, status)
 */
export const getTodayAttendances = async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().slice(0, 10);
        const rows = await db.query(`
            SELECT u.student_id, u.fullname, sa.check_in_time, sa.status
            FROM student_attendances sa
            JOIN users u ON sa.student_id = u.user_id
            WHERE DATE(sa.check_in_time) = :date
            ORDER BY sa.check_in_time DESC
        `, {
            replacements: { date },
            type: db.QueryTypes.SELECT
        });

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Get today attendances error:', error);
        return res.status(500).json({ success: false, message: 'Gagal mengambil data absensi hari ini' });
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
        console.log('=== DEBUG: checkUserRoomAccess called ===');
        console.log('Request body:', req.body);
        
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
        console.log('Check date:', checkDate);

        // Manual query since we don't use Sequelize associations
        // First, check if user is enrolled in any classes with schedule for today
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        
        // Create day mapping
        const dayMapping = {
            'Monday': 'Senin',
            'Tuesday': 'Selasa', 
            'Wednesday': 'Rabu',
            'Thursday': 'Kamis',
            'Friday': 'Jumat',
            'Saturday': 'Sabtu',
            'Sunday': 'Minggu'
        };
        
        const currentDayIndonesian = dayMapping[currentDay];
        
        console.log(`=== DEBUG ACCESS CHECK ===`);
        console.log(`User: ${user_id}`);
        console.log(`Current day (EN): ${currentDay}`);
        console.log(`Current day (ID): ${currentDayIndonesian}`); 
        console.log(`Current time: ${currentTime}`);
        console.log(`Check date: ${checkDate}`);
        
    const classesResult = await db.query(`
            SELECT 
                cc.id as class_id,
                cc.class_name,
                cc.schedule,
                c.course_name,
                c.course_code
            FROM course_classes cc
            JOIN courses c ON cc.course_id = c.id
            LEFT JOIN student_enrollments se 
                ON cc.id = se.class_id 
                AND se.status = 'enrolled' 
                AND se.student_id = :user_id
            WHERE cc.status = 'active'
              AND (se.student_id IS NOT NULL OR cc.lecturer_id = :user_id)
        `, {
            replacements: { user_id },
            type: db.QueryTypes.SELECT
        });

        // Ensure we have an array of classes; sequelize QueryTypes.SELECT returns an array
    const classes = Array.isArray(classesResult) ? classesResult : (classesResult ? [classesResult] : []);

        console.log(`Found ${classes.length} enrolled classes for user ${user_id}`);
        
        // Helpers: normalize day and parse schedule safely
        const normalizeDay = (val) => {
            if (!val && val !== 0) return undefined;
            const mapEN = { Monday:'Senin', Tuesday:'Selasa', Wednesday:'Rabu', Thursday:'Kamis', Friday:'Jumat', Saturday:'Sabtu', Sunday:'Minggu' };
            const mapID = { Senin:'Senin', Selasa:'Selasa', Rabu:'Rabu', Kamis:'Kamis', Jumat:'Jumat', Sabtu:'Sabtu', Minggu:'Minggu' };
            const mapNum1 = { '1':'Senin','2':'Selasa','3':'Rabu','4':'Kamis','5':'Jumat','6':'Sabtu','7':'Minggu' };
            const mapNum0 = { '0':'Minggu','1':'Senin','2':'Selasa','3':'Rabu','4':'Kamis','5':'Jumat','6':'Sabtu' };
            const s = String(val).trim();
            // Title-case
            const title = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
            if (mapID[title]) return mapID[title];
            if (mapEN[title]) return mapEN[title];
            if (mapNum1[s] !== undefined) return mapNum1[s];
            if (mapNum0[s] !== undefined) return mapNum0[s];
            return undefined;
        };

        const ensureArray = (v) => Array.isArray(v) ? v : (v ? [v] : []);

        // Parse time string to minutes since midnight; supports '8:00', '08:00', '08:00:00', '8.00'
        const timeToMinutes = (val) => {
            if (val === undefined || val === null) return null;
            try {
                let s = String(val).trim();
                if (!s) return null;
                s = s.replace('.', ':'); // e.g., '8.00' -> '8:00'
                // Keep only HH:MM from HH:MM:SS
                if (s.includes(':')) {
                    const parts = s.split(':');
                    const h = parts[0];
                    const m = parts[1] ?? '00';
                    const hh = parseInt(h, 10);
                    const mm = parseInt(m, 10);
                    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
                    return hh * 60 + mm;
                }
                // If only hour '8' -> '8:00'
                const hh = parseInt(s, 10);
                if (Number.isNaN(hh)) return null;
                return hh * 60;
            } catch {
                return null;
            }
        };

        const parseScheduleSlots = (raw) => {
            try {
                if (!raw && raw !== 0) return [];
                let val = raw;
                if (typeof val === 'string') {
                    const trimmed = val.trim();
                    // Attempt JSON parse; handle double-encoded JSON
                    try {
                        val = JSON.parse(trimmed);
                        if (typeof val === 'string') {
                            val = JSON.parse(val);
                        }
                    } catch (e) {
                        console.warn('Schedule JSON parse failed; schedule treated as empty. Raw:', trimmed.slice(0, 80));
                        return [];
                    }
                }
                if (Array.isArray(val)) {
                    return val.filter(x => typeof x === 'object' && x);
                }
                if (typeof val === 'object' && val) {
                    // Single slot object
                    return [val];
                }
                return [];
            } catch (err) {
                console.error('parseScheduleSlots error:', err);
                return [];
            }
        };

        // Check if any class has schedule for current day and time
        let hasAccess = false;
        let accessInfo = [];
        
        for (const cls of classes) {
            const scheduleSlots = parseScheduleSlots(cls.schedule);
            console.log(`Class ${cls.class_name} schedule slots count:`, scheduleSlots.length);

            // Check if current day and time matches any schedule
            for (const slot of scheduleSlots) {
                if (!slot || typeof slot !== 'object') {
                    // Skip invalid slot (e.g., primitives from malformed input)
                    continue;
                }
                const dayValue = slot.day ?? slot.day_name ?? slot.hari ?? slot.Day ?? slot.dayOfWeek ?? slot.dow;
                const slotDayNorm = normalizeDay(dayValue);
                const dayMatch = slotDayNorm === currentDayIndonesian;
                console.log(`Checking slot:`, slot);
                console.log(`Day match: ${slotDayNorm} === ${currentDayIndonesian} = ${dayMatch}`);

                if (!dayMatch) continue;

                // Support alternative keys
                const startTime = slot.start_time || slot.start || slot.startAt || slot.start_at || slot.mulai || slot.jam_mulai;
                const endTime = slot.end_time || slot.end || slot.endAt || slot.end_at || slot.selesai || slot.jam_selesai;
                const startMinutes = timeToMinutes(startTime);
                const endMinutes = timeToMinutes(endTime);
                if (startMinutes === null || endMinutes === null) {
                    console.warn('Skipping slot with missing time range:', slot);
                    continue;
                }

                const nowMinutes = timeToMinutes(currentTime);
                console.log(`Checking time: now=${currentTime}(${nowMinutes}) between ${startTime}(${startMinutes}) - ${endTime}(${endMinutes})`);
                if (nowMinutes !== null && nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
                    console.log(`✅ ACCESS GRANTED! Time ${currentTime} is within ${startTime}-${endTime}`);
                    hasAccess = true;
                    accessInfo.push({
                        class_id: cls.class_id,
                        class_name: cls.class_name,
                        course_name: cls.course_name,
                        course_code: cls.course_code,
                        schedule_day: slotDayNorm,
                        start_time: startTime,
                        end_time: endTime
                    });
                } else {
                    console.log(`❌ Time ${currentTime} is NOT within ${startTime}-${endTime}`);
                }
            }
        }

        console.log(`=== FINAL RESULT ===`);
        console.log(`Has access: ${hasAccess}`);
        console.log(`Access info:`, accessInfo);

        if (hasAccess) {
            return res.status(200).json({
                success: true,
                data: {
                    allowed: true,
                    classes: accessInfo,
                    reason: 'Has active class schedule now'
                }
            });
        } else {
            return res.status(200).json({
                success: true,
                data: {
                    allowed: false,
                    classes: [],
                    reason: classes.length > 0 ? 'No active class schedule now' : 'No scheduled classes today'
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

/**
 * Get attendance data by class ID for detailed view
 */
export const getClassAttendanceData = async (req, res) => {
    try {
        const { classId } = req.params;

        if (!classId) {
            return res.status(400).json({
                success: false,
                message: "Class ID is required"
            });
        }

        // Get attendance data with sessions and student details
        const attendanceData = await db.query(`
            SELECT 
                sa.id as attendance_id,
                sa.session_id,
                sa.student_id,
                sa.check_in_time,
                sa.status,
                sa.attendance_method,
                sa.confidence_score,
                sa.notes,
                sa.created_at,
                
                ases.session_date,
                ases.session_number,
                ases.topic as session_topic,
                ases.start_time,
                ases.end_time,
                ases.status as session_status,
                ases.session_type,
                
                u.fullname as student_name,
                u.student_id as student_number,
                
                frl.confidence_score as face_confidence,
                frl.recognition_status,
                frl.processing_time
                
            FROM student_attendances sa
            JOIN attendance_sessions ases ON sa.session_id = ases.id
            JOIN users u ON sa.student_id = u.user_id
            LEFT JOIN face_recognition_logs frl ON ases.id = frl.session_id AND sa.student_id = frl.recognized_user_id
            WHERE ases.class_id = ?
            ORDER BY ases.session_date DESC, ases.session_number DESC, sa.check_in_time DESC
        `, {
            replacements: [classId],
            type: db.QueryTypes.SELECT
        });

        // Get attendance statistics
        const attendanceStats = await db.query(`
            SELECT 
                COUNT(DISTINCT ases.id) as total_sessions,
                COUNT(DISTINCT CASE WHEN sa.status = 'present' THEN sa.id END) as total_present,
                COUNT(DISTINCT CASE WHEN sa.status = 'late' THEN sa.id END) as total_late,
                COUNT(DISTINCT CASE WHEN sa.status = 'absent' THEN sa.id END) as total_absent,
                COUNT(DISTINCT sa.student_id) as total_students_recorded
            FROM attendance_sessions ases
            LEFT JOIN student_attendances sa ON ases.id = sa.session_id
            WHERE ases.class_id = ?
        `, {
            replacements: [classId],
            type: db.QueryTypes.SELECT
        });

        // Get class information (manual join since associations are removed)
        const classInfoQuery = await db.query(`
            SELECT 
                cc.id,
                cc.class_name,
                cc.academic_year,
                cc.semester_period,
                c.course_name,
                c.course_code
            FROM course_classes cc
            JOIN courses c ON cc.course_id = c.id
            WHERE cc.id = ?
        `, {
            replacements: [classId],
            type: db.QueryTypes.SELECT
        });

        const classInfo = classInfoQuery[0];

        if (!classInfo) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Data absensi berhasil diambil",
            data: {
                attendance_records: attendanceData,
                statistics: attendanceStats[0] || {
                    total_sessions: 0,
                    total_present: 0,
                    total_late: 0,
                    total_absent: 0,
                    total_students_recorded: 0
                },
                class_info: {
                    id: classInfo.id,
                    class_name: classInfo.class_name,
                    course_name: classInfo.course_name,
                    course_code: classInfo.course_code,
                    academic_year: classInfo.academic_year,
                    semester_period: classInfo.semester_period
                }
            }
        });

    } catch (error) {
        console.error("Error getting class attendance data:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data absensi",
            error: error.message
        });
    }
};
