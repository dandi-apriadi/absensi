import {
    Courses,
    CourseClasses,
    Users,
    StudentEnrollments,
    AttendanceSessions,
    StudentAttendances,
    db
} from "../../models/index.js";
import { Op } from "sequelize";

/**
 * Get all classes with room access information
 */
export const getClassesWithRoomAccess = async (req, res) => {
    try {
        const { filter = 'all', search = '' } = req.query;
        
        // Get all classes with course information
        const classes = await CourseClasses.findAll({
            order: [["created_at", "DESC"]]
        });

        // Enrich with course info and access statistics
        const classesWithAccess = await Promise.all(
            classes.map(async (cls) => {
                // Get course information
                const course = await Courses.findByPk(cls.course_id);
                
                // Get today's attendance sessions for this class
                const today = new Date().toISOString().split('T')[0];
                const todaySessions = await AttendanceSessions.findAll({
                    where: {
                        class_id: cls.id,
                        session_date: today
                    }
                });

                // Get today's access count (attendance records)
                let todayAccessCount = 0;
                let lastAccess = null;

                if (todaySessions.length > 0) {
                    const sessionIds = todaySessions.map(s => s.id);
                    const attendances = await StudentAttendances.findAll({
                        where: {
                            session_id: { [Op.in]: sessionIds },
                            status: { [Op.in]: ['present', 'late'] }
                        },
                        order: [['check_in_time', 'DESC']]
                    });

                    todayAccessCount = attendances.length;
                    if (attendances.length > 0) {
                        const latestAttendance = attendances[0];
                        if (latestAttendance.check_in_time) {
                            const checkInTime = new Date(latestAttendance.check_in_time);
                            lastAccess = checkInTime.toLocaleTimeString('id-ID', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            });
                        }
                    }
                }

                // Get lecturer name from lecturer_name field
                const lecturerName = cls.lecturer_name || 'Tidak diketahui';

                // Parse schedule
                let schedule = [];
                try {
                    if (cls.schedule && typeof cls.schedule === 'string') {
                        schedule = JSON.parse(cls.schedule);
                    } else if (Array.isArray(cls.schedule)) {
                        schedule = cls.schedule;
                    }
                } catch (e) {
                    console.error('Error parsing schedule:', e);
                    schedule = [];
                }

                // Determine if class is active (has schedule and is not disabled)
                const active = cls.status === 'active' && schedule.length > 0;

                return {
                    id: cls.id,
                    course_code: course?.course_code || 'N/A',
                    course_name: course?.course_name || 'Mata Kuliah Tidak Diketahui',
                    class_name: cls.class_name,
                    schedule: schedule,
                    lecturer: lecturerName,
                    active: active,
                    todayAccessCount: todayAccessCount,
                    lastAccess: lastAccess,
                    academic_year: cls.academic_year,
                    semester_period: cls.semester_period,
                    max_students: cls.max_students,
                    status: cls.status
                };
            })
        );

        // Apply filters
        let filteredClasses = classesWithAccess;

        // Filter by active status
        if (filter === 'active') {
            filteredClasses = filteredClasses.filter(c => c.active);
        } else if (filter === 'inactive') {
            filteredClasses = filteredClasses.filter(c => !c.active);
        }

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            filteredClasses = filteredClasses.filter(c => 
                (c.course_name + c.course_code + c.class_name + c.lecturer)
                    .toLowerCase()
                    .includes(searchLower)
            );
        }

        res.status(200).json({
            success: true,
            data: {
                classes: filteredClasses,
                totalClasses: classesWithAccess.length,
                activeClasses: classesWithAccess.filter(c => c.active).length,
                totalAccess: filteredClasses.reduce((sum, c) => sum + c.todayAccessCount, 0)
            }
        });

    } catch (error) {
        console.error('Get classes with room access error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data akses ruangan"
        });
    }
};

/**
 * Get door system status
 */
export const getDoorStatus = async (req, res) => {
    try {
        // For now, return mock status. In real implementation, this would
        // connect to actual door hardware or IoT system
        const doorStatus = {
            status: "locked", // locked | unlocked
            health: "online", // online | degraded | offline
            lastUpdate: new Date().toISOString(),
            systemInfo: {
                model: "Smart Door System v1.0",
                location: "Ruang Kelas Utama",
                connectivity: "WiFi",
                batteryLevel: 85
            }
        };

        res.status(200).json({
            success: true,
            data: doorStatus
        });

    } catch (error) {
        console.error('Get door status error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil status pintu"
        });
    }
};

/**
 * Revoke room access for a specific class
 */
export const revokeClassAccess = async (req, res) => {
    try {
        const { classId } = req.params;
        
        // Authorization check
        if (req.session.role !== 'super-admin' && req.session.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang dapat mencabut akses ruangan"
            });
        }

        // Check if class exists
        const courseClass = await CourseClasses.findByPk(classId);
        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        // Update class status to inactive
        await courseClass.update({ status: 'inactive' });

        // End any ongoing attendance sessions for this class
        const today = new Date().toISOString().split('T')[0];
        await AttendanceSessions.update(
            { status: 'ended' },
            {
                where: {
                    class_id: classId,
                    session_date: today,
                    status: { [Op.in]: ['scheduled', 'ongoing'] }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "Akses ruangan berhasil dicabut untuk kelas ini"
        });

    } catch (error) {
        console.error('Revoke class access error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mencabut akses ruangan"
        });
    }
};

/**
 * Grant room access for a specific class
 */
export const grantClassAccess = async (req, res) => {
    try {
        const { classId } = req.params;
        
        // Authorization check
        if (req.session.role !== 'super-admin' && req.session.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang dapat memberikan akses ruangan"
            });
        }

        // Check if class exists
        const courseClass = await CourseClasses.findByPk(classId);
        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        // Update class status to active
        await courseClass.update({ status: 'active' });

        res.status(200).json({
            success: true,
            message: "Akses ruangan berhasil diberikan untuk kelas ini"
        });

    } catch (error) {
        console.error('Grant class access error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memberikan akses ruangan"
        });
    }
};

/**
 * Get detailed room access information for a specific class
 */
export const getClassAccessDetail = async (req, res) => {
    try {
        const { classId } = req.params;

        // Get class information
        const courseClass = await CourseClasses.findByPk(classId);
        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        // Get course information
        const course = await Courses.findByPk(courseClass.course_id);

        // Get enrolled students count
        const enrolledCount = await StudentEnrollments.count({
            where: { 
                class_id: classId,
                status: { [Op.in]: ['enrolled', 'active'] }
            }
        });

        // Get recent access logs (attendance records from last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const recentSessions = await AttendanceSessions.findAll({
            where: {
                class_id: classId,
                session_date: {
                    [Op.gte]: weekAgo.toISOString().split('T')[0]
                }
            },
            order: [['session_date', 'DESC'], ['created_at', 'DESC']]
        });

        const accessLogs = [];
        for (const session of recentSessions) {
            const attendances = await StudentAttendances.findAll({
                where: {
                    session_id: session.id,
                    status: { [Op.in]: ['present', 'late'] }
                },
                order: [['check_in_time', 'ASC']]
            });

            for (const attendance of attendances) {
                const student = await Users.findByPk(attendance.student_id);
                accessLogs.push({
                    date: session.session_date,
                    time: attendance.check_in_time,
                    studentName: student?.full_name || 'Unknown',
                    studentId: student?.user_id || 'Unknown',
                    status: attendance.status,
                    sessionName: session.session_name
                });
            }
        }

        // Parse schedule
        let schedule = [];
        try {
            if (courseClass.schedule && typeof courseClass.schedule === 'string') {
                schedule = JSON.parse(courseClass.schedule);
            } else if (Array.isArray(courseClass.schedule)) {
                schedule = courseClass.schedule;
            }
        } catch (e) {
            console.error('Error parsing schedule:', e);
            schedule = [];
        }

        const classDetail = {
            id: courseClass.id,
            course_code: course?.course_code || 'N/A',
            course_name: course?.course_name || 'Mata Kuliah Tidak Diketahui',
            class_name: courseClass.class_name,
            lecturer: courseClass.lecturer_name || 'Tidak diketahui',
            schedule: schedule,
            academic_year: courseClass.academic_year,
            semester_period: courseClass.semester_period,
            max_students: courseClass.max_students,
            enrolled_students: enrolledCount,
            status: courseClass.status,
            active: courseClass.status === 'active' && schedule.length > 0,
            accessLogs: accessLogs.slice(0, 50) // Limit to 50 recent logs
        };

        res.status(200).json({
            success: true,
            data: classDetail
        });

    } catch (error) {
        console.error('Get class access detail error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil detail akses kelas"
        });
    }
};