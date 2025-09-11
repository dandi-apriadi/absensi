import {
    Courses,
    CourseClasses,
    Users,
    StudentEnrollments,
    AttendanceSessions,
    db
} from "../../models/index.js";
import { Op } from "sequelize";

// ===============================================
// COURSE MANAGEMENT CONTROLLERS
// ===============================================

/**
 * Get all courses (with filters)
 */
export const getCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, semester, lecturer_id } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { course_name: { [Op.iLike]: `%${search}%` } },
                { course_code: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (semester) {
            whereClause.semester = semester;
        }

        if (lecturer_id) {
            whereClause.lecturer_id = lecturer_id;
        }

        const courses = await Courses.findAndCountAll({
            where: whereClause,
            order: [['course_name', 'ASC']],
            limit: parseInt(limit),
            offset: offset, include: [
                {
                    model: Users,
                    as: 'lecturer',
                    where: { role: 'lecturer' },
                    attributes: ['id', 'user_id', 'full_name', 'email', 'department', 'position']
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                courses: courses.rows,
                pagination: {
                    total: courses.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(courses.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data mata kuliah"
        });
    }
};

/**
 * Create new course (Super Admin only)
 */
export const createCourse = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat membuat mata kuliah"
            });
        }

        const {
            course_code,
            course_name,
            description,
            credits,
            semester,
            academic_year,
            lecturer_id,
            department,
            prerequisites
        } = req.body;

        // Validation
        if (!course_code || !course_name || !credits || !semester || !academic_year || !lecturer_id) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib harus diisi"
            });
        }

        // Check if course code already exists
        const existingCourse = await Courses.findOne({
            where: { course_code }
        });

        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "Kode mata kuliah sudah ada"
            });
        }        // Check if lecturer exists
        const lecturer = await Users.findOne({
            where: {
                id: lecturer_id,
                role: 'lecturer'
            }
        });
        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Dosen tidak ditemukan"
            });
        }

        const course = await Courses.create({
            course_code,
            course_name,
            description,
            credits,
            semester,
            academic_year,
            lecturer_id,
            department,
            prerequisites: prerequisites || null,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: "Mata kuliah berhasil dibuat",
            data: course
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat mata kuliah"
        });
    }
};

/**
 * Update course (Super Admin only)
 */
export const updateCourse = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat mengubah mata kuliah"
            });
        }

        const { id } = req.params;
        const updateData = req.body;

        const course = await Courses.findByPk(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Mata kuliah tidak ditemukan"
            });
        }        // If updating lecturer_id, check if lecturer exists
        if (updateData.lecturer_id && updateData.lecturer_id !== course.lecturer_id) {
            const lecturer = await Users.findOne({
                where: {
                    id: updateData.lecturer_id,
                    role: 'lecturer'
                }
            });
            if (!lecturer) {
                return res.status(404).json({
                    success: false,
                    message: "Dosen tidak ditemukan"
                });
            }
        }

        await course.update(updateData);

        res.status(200).json({
            success: true,
            message: "Mata kuliah berhasil diperbarui",
            data: course
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui mata kuliah"
        });
    }
};

/**
 * Delete course (Super Admin only)
 */
export const deleteCourse = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat menghapus mata kuliah"
            });
        }

        const { id } = req.params;

        const course = await Courses.findByPk(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Mata kuliah tidak ditemukan"
            });
        }

        // Check if there are active classes for this course
        const activeClasses = await CourseClasses.count({
            where: {
                course_id: id,
                status: 'active'
            }
        });

        if (activeClasses > 0) {
            return res.status(400).json({
                success: false,
                message: "Tidak dapat menghapus mata kuliah yang memiliki kelas aktif"
            });
        }

        await course.destroy();

        res.status(200).json({
            success: true,
            message: "Mata kuliah berhasil dihapus"
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus mata kuliah"
        });
    }
};

/**
 * Get course classes
 */
export const getCourseClasses = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = { course_id };
        if (status) {
            whereClause.status = status;
        }

        const classes = await CourseClasses.findAndCountAll({
            where: whereClause,
            order: [['class_name', 'ASC']],
            limit: parseInt(limit),
            offset: offset,
            include: [
                {
                    model: Courses,
                    as: 'course',
                    attributes: ['course_name', 'course_code', 'credits']
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                classes: classes.rows,
                pagination: {
                    total: classes.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(classes.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get course classes error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kelas mata kuliah"
        });
    }
};

/**
 * Create course class (Super Admin or Lecturer)
 */
export const createCourseClass = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin atau dosen yang dapat membuat kelas"
            });
        }

        const {
            course_id,
            class_name,
            class_code,
            room_id,
            schedule_day,
            start_time,
            end_time,
            max_students,
            semester,
            academic_year
        } = req.body;

        const userId = req.session.userId;

        // Validation
        if (!course_id || !class_name || !schedule_day || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib harus diisi"
            });
        }        // Check if course exists and user has access (for lecturers)
        let whereClause = { id: course_id };
        if (req.session.role === 'lecturer') {
            // Get lecturer ID from user session
            const lecturer = await Users.findOne({
                where: {
                    id: userId,
                    role: 'lecturer'
                }
            });
            if (!lecturer) {
                return res.status(403).json({
                    success: false,
                    message: "Data dosen tidak ditemukan"
                });
            }
            whereClause.lecturer_id = lecturer.id;
        }

        const course = await Courses.findOne({ where: whereClause });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Mata kuliah tidak ditemukan atau Anda tidak memiliki akses"
            });
        }

        // Check if room exists (if specified)
        if (room_id) {
            const room = await Rooms.findByPk(room_id);
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: "Ruangan tidak ditemukan"
                });
            }
        }

        // Check for schedule conflicts
        const conflictingClass = await CourseClasses.findOne({
            where: {
                room_id,
                schedule_day,
                [Op.or]: [
                    {
                        start_time: {
                            [Op.between]: [start_time, end_time]
                        }
                    },
                    {
                        end_time: {
                            [Op.between]: [start_time, end_time]
                        }
                    },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: start_time } },
                            { end_time: { [Op.gte]: end_time } }
                        ]
                    }
                ]
            }
        });

        if (conflictingClass) {
            return res.status(400).json({
                success: false,
                message: "Jadwal bentrok dengan kelas lain di ruangan yang sama"
            });
        }

        const courseClass = await CourseClasses.create({
            course_id,
            class_name,
            class_code,
            room_id,
            schedule_day,
            start_time,
            end_time,
            max_students: max_students || 40,
            semester: semester || course.semester,
            academic_year: academic_year || course.academic_year,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: "Kelas berhasil dibuat",
            data: courseClass
        });
    } catch (error) {
        console.error('Create course class error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat kelas"
        });
    }
};

/**
 * Get class enrollments
 */
export const getClassEnrollments = async (req, res) => {
    try {
        const { class_id } = req.params;
        const { page = 1, limit = 50, status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = { course_class_id: class_id };
        if (status) {
            whereClause.status = status;
        }

        const enrollments = await StudentEnrollments.findAndCountAll({
            where: whereClause,
            order: [['enrolled_at', 'ASC']],
            limit: parseInt(limit),
            offset: offset, include: [
                {
                    model: Users,
                    as: 'student',
                    where: { role: 'student' },
                    attributes: ['id', 'user_id', 'full_name', 'email', 'program_study', 'semester']
                },
                {
                    model: CourseClasses,
                    as: 'courseClass',
                    attributes: ['class_name', 'class_code'],
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

        res.status(200).json({
            success: true,
            data: {
                enrollments: enrollments.rows,
                pagination: {
                    total: enrollments.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(enrollments.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get class enrollments error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data pendaftaran kelas"
        });
    }
};

/**
 * Enroll student to class (Super Admin or Student)
 */
export const enrollStudent = async (req, res) => {
    try {
        const { class_id, student_id } = req.body;
        const userRole = req.session.role;
        const userId = req.session.userId;

        // Validation
        if (!class_id || !student_id) {
            return res.status(400).json({
                success: false,
                message: "Class ID dan Student ID harus diisi"
            });
        }

        // Check if class exists
        const courseClass = await CourseClasses.findByPk(class_id);
        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
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

        // If student is enrolling themselves, check if they own the account
        if (userRole === 'student' && student.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Anda hanya dapat mendaftarkan diri sendiri"
            });
        }

        // Check if already enrolled
        const existingEnrollment = await StudentEnrollments.findOne({
            where: { course_class_id: class_id, student_id }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "Mahasiswa sudah terdaftar di kelas ini"
            });
        }

        // Check class capacity
        const currentEnrollments = await StudentEnrollments.count({
            where: {
                course_class_id: class_id,
                status: { [Op.in]: ['enrolled', 'active'] }
            }
        });

        if (currentEnrollments >= courseClass.max_students) {
            return res.status(400).json({
                success: false,
                message: "Kelas sudah penuh"
            });
        }

        const enrollment = await StudentEnrollments.create({
            course_class_id: class_id,
            student_id,
            enrolled_at: new Date(),
            status: userRole === 'super-admin' ? 'enrolled' : 'pending'
        });

        res.status(201).json({
            success: true,
            message: userRole === 'super-admin' ? "Mahasiswa berhasil didaftarkan ke kelas" : "Pendaftaran berhasil diajukan",
            data: enrollment
        });
    } catch (error) {
        console.error('Enroll student error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mendaftarkan mahasiswa ke kelas"
        });
    }
};

/**
 * Update enrollment status (Super Admin or Lecturer)
 */
export const updateEnrollmentStatus = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin atau dosen yang dapat mengubah status pendaftaran"
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        const enrollment = await StudentEnrollments.findByPk(id);
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Data pendaftaran tidak ditemukan"
            });
        }

        await enrollment.update({ status });

        res.status(200).json({
            success: true,
            message: "Status pendaftaran berhasil diperbarui",
            data: enrollment
        });
    } catch (error) {
        console.error('Update enrollment status error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui status pendaftaran"
        });
    }
};
