import {
    AttendanceSessions,
    StudentAttendances,
    CourseClasses,
    Users,
    Courses,
    Rooms,
    StudentEnrollments,
    db
} from "../../models/index.js";
import { Op } from "sequelize";

// ===============================================
// REPORT CONTROLLERS
// ===============================================

/**
 * Get attendance report for a class
 */
export const getClassAttendanceReport = async (req, res) => {
    try {
        const { class_id } = req.params;
        const { start_date, end_date, format = 'json' } = req.query;

        // Check access permissions
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin atau dosen yang dapat mengakses laporan"
            });
        }

        // For lecturers, check if they own the class
        if (req.session.role === 'lecturer') {
            const lecturer = await Lecturers.findOne({ where: { user_id: req.session.userId } });
            if (!lecturer) {
                return res.status(403).json({
                    success: false,
                    message: "Data dosen tidak ditemukan"
                });
            }

            const courseClass = await CourseClasses.findOne({
                where: { id: class_id },
                include: [{
                    model: Courses,
                    as: 'course',
                    where: { lecturer_id: lecturer.id }
                }]
            });

            if (!courseClass) {
                return res.status(403).json({
                    success: false,
                    message: "Anda tidak memiliki akses ke kelas ini"
                });
            }
        }

        // Get class information
        const courseClass = await CourseClasses.findOne({
            where: { id: class_id },
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
                },
                {
                    model: Rooms,
                    as: 'room',
                    attributes: ['room_name', 'building']
                }
            ]
        });

        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        // Get attendance sessions within date range
        let sessionWhereClause = { course_class_id: class_id };
        if (start_date && end_date) {
            sessionWhereClause.session_date = {
                [Op.between]: [start_date, end_date]
            };
        } else if (start_date) {
            sessionWhereClause.session_date = {
                [Op.gte]: start_date
            };
        } else if (end_date) {
            sessionWhereClause.session_date = {
                [Op.lte]: end_date
            };
        }

        const sessions = await AttendanceSessions.findAll({
            where: sessionWhereClause,
            order: [['session_date', 'ASC']],
            attributes: ['id', 'session_name', 'session_date', 'start_time', 'end_time']
        });

        // Get all enrolled students
        const enrolledStudents = await StudentEnrollments.findAll({
            where: {
                course_class_id: class_id,
                status: { [Op.in]: ['enrolled', 'active'] }
            },
            include: [
                {
                    model: Students,
                    as: 'student',
                    include: [
                        {
                            model: Users,
                            as: 'user',
                            attributes: ['full_name', 'user_id', 'email']
                        }
                    ]
                }
            ],
            order: [['student', 'user', 'full_name', 'ASC']]
        });

        // Get attendance records for these sessions
        const sessionIds = sessions.map(s => s.id);
        const attendanceRecords = await StudentAttendances.findAll({
            where: { session_id: { [Op.in]: sessionIds } },
            include: [
                {
                    model: Students,
                    as: 'student',
                    include: [
                        {
                            model: Users,
                            as: 'user',
                            attributes: ['full_name', 'user_id']
                        }
                    ]
                }
            ]
        });

        // Create attendance matrix
        const attendanceMatrix = {};
        enrolledStudents.forEach(enrollment => {
            const studentId = enrollment.student.id;
            const studentData = {
                student_id: studentId,
                user_id: enrollment.student.user.user_id,
                full_name: enrollment.student.user.full_name,
                email: enrollment.student.user.email,
                sessions: {}
            };

            sessions.forEach(session => {
                studentData.sessions[session.id] = {
                    session_name: session.session_name,
                    session_date: session.session_date,
                    status: 'absent', // default
                    check_in_time: null
                };
            });

            attendanceMatrix[studentId] = studentData;
        });

        // Fill in actual attendance data
        attendanceRecords.forEach(record => {
            if (attendanceMatrix[record.student_id]) {
                attendanceMatrix[record.student_id].sessions[record.session_id] = {
                    ...attendanceMatrix[record.student_id].sessions[record.session_id],
                    status: record.status,
                    check_in_time: record.check_in_time
                };
            }
        });

        // Calculate statistics
        const totalSessions = sessions.length;
        const totalStudents = enrolledStudents.length;
        const statistics = {
            total_sessions: totalSessions,
            total_students: totalStudents,
            attendance_summary: {
                present: 0,
                late: 0,
                absent: 0,
                excused: 0
            }
        };

        // Count attendance by status
        Object.values(attendanceMatrix).forEach(student => {
            Object.values(student.sessions).forEach(session => {
                statistics.attendance_summary[session.status] =
                    (statistics.attendance_summary[session.status] || 0) + 1;
            });
        });

        // Calculate attendance rate
        const totalRecords = totalSessions * totalStudents;
        const presentRecords = statistics.attendance_summary.present + statistics.attendance_summary.late;
        statistics.attendance_rate = totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(2) : 0;

        const reportData = {
            class_info: {
                class_name: courseClass.class_name,
                course_name: courseClass.course.course_name,
                course_code: courseClass.course.course_code,
                lecturer_name: courseClass.course.lecturer.user.full_name,
                room: courseClass.room ? `${courseClass.room.room_name} (${courseClass.room.building})` : null,
                semester: courseClass.semester,
                academic_year: courseClass.academic_year
            },
            date_range: {
                start_date,
                end_date
            },
            sessions,
            attendance_matrix: Object.values(attendanceMatrix),
            statistics,
            generated_at: new Date(),
            generated_by: req.session.userId
        };

        res.status(200).json({
            success: true,
            data: reportData
        });
    } catch (error) {
        console.error('Get class attendance report error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat laporan kehadiran kelas"
        });
    }
};

/**
 * Get student attendance report
 */
export const getStudentAttendanceReport = async (req, res) => {
    try {
        const { student_id } = req.params;
        const { start_date, end_date, course_id } = req.query;

        // Check access permissions
        if (req.session.role === 'student') {
            // Students can only access their own report
            const student = await Students.findOne({ where: { user_id: req.session.userId } });
            if (!student || student.id.toString() !== student_id) {
                return res.status(403).json({
                    success: false,
                    message: "Anda hanya dapat mengakses laporan kehadiran sendiri"
                });
            }
        } else if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak"
            });
        }

        // Get student information
        const student = await Students.findOne({
            where: { id: student_id },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['full_name', 'user_id', 'email']
                }
            ]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Mahasiswa tidak ditemukan"
            });
        }

        // Get student enrollments
        let enrollmentWhereClause = { student_id };
        if (course_id) {
            // Get specific course classes
            const courseClasses = await CourseClasses.findAll({
                where: { course_id },
                attributes: ['id']
            });
            const classIds = courseClasses.map(c => c.id);
            enrollmentWhereClause.course_class_id = { [Op.in]: classIds };
        }

        const enrollments = await StudentEnrollments.findAll({
            where: enrollmentWhereClause,
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

        // Get attendance sessions for enrolled classes
        const classIds = enrollments.map(e => e.course_class_id);
        let sessionWhereClause = { course_class_id: { [Op.in]: classIds } };

        if (start_date && end_date) {
            sessionWhereClause.session_date = {
                [Op.between]: [start_date, end_date]
            };
        } else if (start_date) {
            sessionWhereClause.session_date = {
                [Op.gte]: start_date
            };
        } else if (end_date) {
            sessionWhereClause.session_date = {
                [Op.lte]: end_date
            };
        }

        const sessions = await AttendanceSessions.findAll({
            where: sessionWhereClause,
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
            order: [['session_date', 'DESC']]
        });

        // Get student's attendance records
        const sessionIds = sessions.map(s => s.id);
        const attendanceRecords = await StudentAttendances.findAll({
            where: {
                session_id: { [Op.in]: sessionIds },
                student_id
            }
        });

        // Create attendance summary by course
        const courseAttendance = {};
        sessions.forEach(session => {
            const courseId = session.courseClass.course_id;
            const courseName = session.courseClass.course.course_name;
            const courseCode = session.courseClass.course.course_code;

            if (!courseAttendance[courseId]) {
                courseAttendance[courseId] = {
                    course_id: courseId,
                    course_name: courseName,
                    course_code: courseCode,
                    total_sessions: 0,
                    attended_sessions: 0,
                    sessions: []
                };
            }

            const attendanceRecord = attendanceRecords.find(r => r.session_id === session.id);
            const status = attendanceRecord ? attendanceRecord.status : 'absent';
            const checkInTime = attendanceRecord ? attendanceRecord.check_in_time : null;

            courseAttendance[courseId].total_sessions++;
            if (status === 'present' || status === 'late') {
                courseAttendance[courseId].attended_sessions++;
            }

            courseAttendance[courseId].sessions.push({
                session_id: session.id,
                session_name: session.session_name,
                session_date: session.session_date,
                start_time: session.start_time,
                end_time: session.end_time,
                status,
                check_in_time: checkInTime
            });
        });

        // Calculate attendance rates
        Object.values(courseAttendance).forEach(course => {
            course.attendance_rate = course.total_sessions > 0
                ? ((course.attended_sessions / course.total_sessions) * 100).toFixed(2)
                : 0;
        });

        // Overall statistics
        const totalSessions = sessions.length;
        const attendedSessions = attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length;
        const overallAttendanceRate = totalSessions > 0
            ? ((attendedSessions / totalSessions) * 100).toFixed(2)
            : 0;

        const reportData = {
            student_info: {
                student_id: student.id,
                user_id: student.user.user_id,
                full_name: student.user.full_name,
                email: student.user.email,
                program_study: student.program_study,
                semester: student.semester
            },
            date_range: {
                start_date,
                end_date
            },
            overall_statistics: {
                total_sessions: totalSessions,
                attended_sessions: attendedSessions,
                attendance_rate: overallAttendanceRate
            },
            course_attendance: Object.values(courseAttendance),
            generated_at: new Date(),
            generated_by: req.session.userId
        };

        res.status(200).json({
            success: true,
            data: reportData
        });
    } catch (error) {
        console.error('Get student attendance report error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat laporan kehadiran mahasiswa"
        });
    }
};

/**
 * Get lecturer attendance summary
 */
export const getLecturerAttendanceSummary = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin atau dosen yang dapat mengakses ringkasan"
            });
        }

        const { lecturer_id } = req.params;
        const { start_date, end_date } = req.query;

        // For lecturers, check if they access their own summary
        if (req.session.role === 'lecturer') {
            const lecturer = await Lecturers.findOne({ where: { user_id: req.session.userId } });
            if (!lecturer || lecturer.id.toString() !== lecturer_id) {
                return res.status(403).json({
                    success: false,
                    message: "Anda hanya dapat mengakses ringkasan sendiri"
                });
            }
        }

        // Get lecturer information
        const lecturer = await Lecturers.findOne({
            where: { id: lecturer_id },
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['full_name', 'user_id', 'email']
                }
            ]
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Dosen tidak ditemukan"
            });
        }

        // Get courses taught by this lecturer
        const courses = await Courses.findAll({
            where: { lecturer_id },
            include: [
                {
                    model: CourseClasses,
                    as: 'classes',
                    where: { status: 'active' },
                    required: false
                }
            ]
        });

        // Get all class IDs
        const classIds = [];
        courses.forEach(course => {
            course.classes.forEach(cls => {
                classIds.push(cls.id);
            });
        });

        // Get attendance sessions within date range
        let sessionWhereClause = { course_class_id: { [Op.in]: classIds } };
        if (start_date && end_date) {
            sessionWhereClause.session_date = {
                [Op.between]: [start_date, end_date]
            };
        }

        const sessions = await AttendanceSessions.findAll({
            where: sessionWhereClause,
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

        // Get attendance statistics for each class
        const classStatistics = [];
        for (const course of courses) {
            for (const courseClass of course.classes) {
                const classSessions = sessions.filter(s => s.course_class_id === courseClass.id);

                if (classSessions.length > 0) {
                    const sessionIds = classSessions.map(s => s.id);

                    // Get attendance counts
                    const attendanceCounts = await StudentAttendances.findAll({
                        where: { session_id: { [Op.in]: sessionIds } },
                        attributes: [
                            'status',
                            [db.fn('COUNT', db.col('id')), 'count']
                        ],
                        group: ['status'],
                        raw: true
                    });

                    // Get total enrolled students
                    const totalStudents = await StudentEnrollments.count({
                        where: {
                            course_class_id: courseClass.id,
                            status: { [Op.in]: ['enrolled', 'active'] }
                        }
                    });

                    const statistics = {
                        present: 0,
                        late: 0,
                        absent: 0,
                        excused: 0
                    };

                    attendanceCounts.forEach(count => {
                        statistics[count.status] = parseInt(count.count);
                    });

                    const totalRecords = classSessions.length * totalStudents;
                    const presentRecords = statistics.present + statistics.late;
                    const attendanceRate = totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(2) : 0;

                    classStatistics.push({
                        class_id: courseClass.id,
                        class_name: courseClass.class_name,
                        course_name: course.course_name,
                        course_code: course.course_code,
                        total_sessions: classSessions.length,
                        total_students: totalStudents,
                        attendance_rate: parseFloat(attendanceRate),
                        attendance_counts: statistics
                    });
                }
            }
        }

        const reportData = {
            lecturer_info: {
                lecturer_id: lecturer.id,
                user_id: lecturer.user.user_id,
                full_name: lecturer.user.full_name,
                email: lecturer.user.email,
                department: lecturer.department,
                specialization: lecturer.specialization
            },
            date_range: {
                start_date,
                end_date
            },
            summary: {
                total_courses: courses.length,
                total_classes: classIds.length,
                total_sessions: sessions.length
            },
            class_statistics: classStatistics,
            generated_at: new Date(),
            generated_by: req.session.userId
        };

        res.status(200).json({
            success: true,
            data: reportData
        });
    } catch (error) {
        console.error('Get lecturer attendance summary error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat ringkasan kehadiran dosen"
        });
    }
};
