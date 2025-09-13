import {
    Courses,
    CourseClasses,
    Users,
    StudentEnrollments,
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
    const { page = 1, limit = 10, search, semester, program_study, status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (search) {
            whereClause[Op.or] = [
        { course_name: { [Op.like]: `%${search}%` } },
        { course_code: { [Op.like]: `%${search}%` } }
            ];
        }

    if (semester) whereClause.semester = semester;
    if (program_study) whereClause.program_study = program_study;
    if (status) whereClause.status = status;

    const courses = await Courses.findAndCountAll({
        where: whereClause,
        order: [["course_name", "ASC"]],
        limit: parseInt(limit),
        offset: offset
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
        // Debug: Log session and user information
        console.log('Create Course - Session data:', {
            sessionExists: !!req.session,
            sessionUserId: req.session?.user_id,
            sessionRole: req.session?.role,
            middlewareUserId: req.user_id,
            middlewareRole: req.role
        });
        
        // Allow super-admin and admin roles to create courses
        // Use role from middleware (req.role) or fallback to session
        const userRole = req.role || req.session?.role;
        const allowedRoles = ['super-admin', 'admin'];
        
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Akses ditolak. Role '${userRole}' tidak diizinkan untuk membuat mata kuliah. Hanya super admin yang dapat membuat mata kuliah.`
            });
        }

        const {
            course_code,
            course_name,
            description,
            credits,
            semester,
            program_study,
            prerequisites
        } = req.body;

        // Validation
        if (!course_code || !course_name || !credits || !semester || !program_study) {
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
        }

        const course = await Courses.create({
            course_code,
            course_name,
            description,
            credits,
            semester,
            program_study,
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
    const activeClasses = await CourseClasses.count({ where: { course_id: id, status: 'active' } });

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
            order: [["class_name", "ASC"]],
            limit: parseInt(limit),
            offset: offset
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
        // Debug: Log session and user information
        console.log('Session data:', {
            sessionExists: !!req.session,
            sessionUserId: req.session?.user_id,
            sessionRole: req.session?.role,
            middlewareUserId: req.user_id,
            middlewareRole: req.role
        });
        
        // Allow super-admin, admin, and lecturer roles to create classes
        // Use role from middleware (req.role) or fallback to session
        const userRole = req.role || req.session?.role;
        const allowedRoles = ['super-admin', 'admin', 'lecturer'];
        
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Akses ditolak. Role '${userRole}' tidak diizinkan untuk membuat kelas. Hanya admin atau dosen yang dapat membuat kelas.`
            });
        }

        const {
            course_id,
            class_name,
            lecturer_name, // Changed from lecturer_id to lecturer_name
            academic_year,
            semester_period,
            max_students,
            schedule // [{ day, start_time, end_time }]
        } = req.body;

        // Validation
        if (!course_id || !class_name || !academic_year || !semester_period) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib harus diisi"
            });
        }

        // Course must exist
        const course = await Courses.findByPk(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Mata kuliah tidak ditemukan"
            });
        }

        // Normalize schedule
        let normalizedSchedule = schedule;
        if (!Array.isArray(normalizedSchedule) || normalizedSchedule.length === 0) {
            normalizedSchedule = [];
        }

        const courseClass = await CourseClasses.create({
            course_id,
            lecturer_name: lecturer_name || null, // Changed to store lecturer_name instead of lecturer_id
            class_name,
            academic_year,
            semester_period,
            max_students: max_students || 40,
            schedule: normalizedSchedule,
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
 * Update course class (Super Admin or Lecturer)
 */
export const updateCourseClass = async (req, res) => {
    try {
        // Allow super-admin, admin, and lecturer roles to update classes
        const userRole = req.role || req.session?.role;
        const allowedRoles = ['super-admin', 'admin', 'lecturer'];
        
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Akses ditolak. Role '${userRole}' tidak diizinkan untuk mengubah kelas.`
            });
        }

        const { id } = req.params;
        const {
            class_name,
            lecturer_name,
            academic_year,
            semester_period,
            max_students,
            status,
            schedule
        } = req.body;

        // Find the class
        const courseClass = await CourseClasses.findByPk(id);
        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        // Update the class
        const updateData = {};
        if (class_name !== undefined) updateData.class_name = class_name;
        if (lecturer_name !== undefined) updateData.lecturer_name = lecturer_name;
        if (academic_year !== undefined) updateData.academic_year = academic_year;
        if (semester_period !== undefined) updateData.semester_period = semester_period;
        if (max_students !== undefined) updateData.max_students = max_students;
        if (status !== undefined) updateData.status = status;
        if (schedule !== undefined) updateData.schedule = schedule;

        await courseClass.update(updateData);

        res.status(200).json({
            success: true,
            message: "Kelas berhasil diperbarui",
            data: courseClass
        });
    } catch (error) {
        console.error('Update course class error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui kelas"
        });
    }
};

/**
 * Delete course class (Super Admin only)
 */
export const deleteCourseClass = async (req, res) => {
    try {
        // Debug session and user info
        console.log('=== DELETE CLASS DEBUG ===');
        console.log('Session exists:', !!req.session);
        console.log('Session user_id:', req.session?.user_id);
        console.log('Session role:', req.session?.role);
        console.log('Middleware user_id:', req.user_id);
        console.log('Middleware role:', req.role);
        console.log('Request headers:', req.headers);
        console.log('=========================');

        // Only super-admin can delete classes
        const userRole = req.role || req.session?.role;
        
        if (userRole !== 'super-admin') {
            console.log('Access denied for role:', userRole);
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat menghapus kelas."
            });
        }

        const { id } = req.params;

        // Find the class
        const courseClass = await CourseClasses.findByPk(id);
        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        // Check if there are enrolled students
        const enrollmentCount = await StudentEnrollments.count({
            where: { 
                class_id: id,
                status: 'enrolled' 
            }
        });

        if (enrollmentCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Tidak dapat menghapus kelas yang masih memiliki ${enrollmentCount} mahasiswa terdaftar. Hapus semua mahasiswa terlebih dahulu.`
            });
        }

        // Delete the class
        await courseClass.destroy();

        res.status(200).json({
            success: true,
            message: "Kelas berhasil dihapus"
        });
    } catch (error) {
        console.error('Delete course class error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus kelas"
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

        let whereClause = { class_id };
        if (status) {
            whereClause.status = status;
        }

        const enrollments = await StudentEnrollments.findAndCountAll({
            where: whereClause,
            order: [["enrollment_date", "ASC"]],
            limit: parseInt(limit),
            offset: offset
        });

        // Enrich with student basic info (manual join)
        const rows = await Promise.all(enrollments.rows.map(async (e) => {
            const student = await Users.findByPk(e.student_id);
            return {
                ...e.toJSON(),
                student: student ? {
                    id: student.id,
                    user_id: student.user_id,
                    full_name: student.full_name,
                    email: student.email,
                    program_study: student.program_study,
                    semester: student.semester
                } : null
            };
        }));

        res.status(200).json({
            success: true,
            data: {
                enrollments: rows,
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
    }

    // Check if student exists
    const student = await Users.findOne({ where: { id: student_id, role: 'student' } });
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
            where: { class_id, student_id }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "Mahasiswa sudah terdaftar di kelas ini"
            });
        }

        // Check class capacity
    const currentEnrollments = await StudentEnrollments.count({ where: { class_id, status: { [Op.in]: ['enrolled', 'active'] } } });

        if (currentEnrollments >= courseClass.max_students) {
            return res.status(400).json({
                success: false,
                message: "Kelas sudah penuh"
            });
        }

        const enrollment = await StudentEnrollments.create({
            class_id,
            student_id,
            enrollment_date: new Date(),
            status: 'enrolled'
        });

        res.status(201).json({
            success: true,
            message: "Mahasiswa berhasil didaftarkan ke kelas",
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

/**
 * Delete enrollment (Super Admin or Lecturer)
 */
export const deleteEnrollment = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin atau dosen yang dapat menghapus pendaftaran"
            });
        }

        const { id } = req.params;

        const enrollment = await StudentEnrollments.findByPk(id);
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Data pendaftaran tidak ditemukan"
            });
        }

        await enrollment.destroy();

        res.status(200).json({
            success: true,
            message: "Mahasiswa berhasil dihapus dari kelas"
        });
    } catch (error) {
        console.error('Delete enrollment error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus pendaftaran mahasiswa"
        });
    }
};

/**
 * Get all classes with enrollment statistics
 */
export const getAllClassesWithStats = async (req, res) => {
    try {
        const { page = 1, limit = 100, status, program_study } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause for filtering
        let whereClause = {};
        if (status) {
            whereClause.status = status;
        }

        // Get all classes
        const classes = await CourseClasses.findAndCountAll({
            where: whereClause,
            order: [["created_at", "DESC"]],
            limit: parseInt(limit),
            offset: offset
        });

        // For each class, get the course info and enrollment count
        const classesWithStats = await Promise.all(
            classes.rows.map(async (cls) => {
                // Get course information
                const course = await Courses.findByPk(cls.course_id);
                
                // Skip if course doesn't match program study filter
                if (program_study && course?.program_study !== program_study) {
                    return null;
                }
                
                // Get enrollment count
                const enrollmentCount = await StudentEnrollments.count({
                    where: { 
                        class_id: cls.id,
                        status: 'enrolled'
                    }
                });
                
                return {
                    ...cls.toJSON(),
                    course: course?.toJSON() || null,
                    enrolled_count: enrollmentCount
                };
            })
        );

        // Filter out null entries (courses that didn't match program study filter)
        const filteredClasses = classesWithStats.filter(cls => cls !== null);

        res.status(200).json({
            success: true,
            data: {
                classes: filteredClasses,
                pagination: {
                    total: filteredClasses.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(filteredClasses.length / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all classes with stats error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data kelas dengan statistik"
        });
    }
};
