import {
    Courses,
    CourseClasses
} from "../../models/index.js";

/**
 * Create course class for demo/testing without authentication
 */
export const createCourseClassDemo = async (req, res) => {
    try {
        console.log('Demo endpoint - Creating course class without authentication');
        
        const {
            course_id,
            class_name,
            lecturer_name,
            academic_year,
            semester_period,
            max_students,
            schedule
        } = req.body;

        // Validation
        if (!course_id || !class_name || !academic_year || !semester_period) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib harus diisi"
            });
        }

        // For demo, we'll skip course existence check since we're using static data
        // But still validate the basic course_id format
        if (!Number.isInteger(Number(course_id))) {
            return res.status(400).json({
                success: false,
                message: "Course ID harus berupa angka"
            });
        }

        // Normalize schedule
        let normalizedSchedule = schedule;
        if (!Array.isArray(normalizedSchedule) || normalizedSchedule.length === 0) {
            normalizedSchedule = [];
        }

        const courseClass = await CourseClasses.create({
            course_id: Number(course_id),
            lecturer_name: lecturer_name || null,
            class_name,
            academic_year,
            semester_period,
            max_students: max_students || 40,
            schedule: normalizedSchedule,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: "Kelas berhasil dibuat (Demo Mode)",
            data: courseClass
        });
    } catch (error) {
        console.error('Create course class demo error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat kelas: " + error.message
        });
    }
};

/**
 * Delete course class for demo/testing without authentication
 */
export const deleteCourseClassDemo = async (req, res) => {
    try {
        console.log('Demo endpoint - Deleting course class without authentication');
        console.log('Class ID to delete:', req.params.id);

        const classId = req.params.id;

        if (!classId) {
            return res.status(400).json({
                success: false,
                message: "Class ID is required"
            });
        }

        // Find the class
        const courseClass = await CourseClasses.findByPk(classId);

        if (!courseClass) {
            return res.status(404).json({
                success: false,
                message: "Kelas tidak ditemukan"
            });
        }

        // Delete the class
        await courseClass.destroy();

        console.log('Course class deleted successfully:', classId);

        res.status(200).json({
            success: true,
            message: "Kelas berhasil dihapus (Demo Mode)"
        });

    } catch (error) {
        console.error('Error deleting course class (demo):', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus kelas",
            error: error.message
        });
    }
};

/**
 * Test session authentication endpoint
 */
export const testAuth = async (req, res) => {
    try {
        console.log('=== TEST AUTH ENDPOINT ===');
        console.log('Session exists:', !!req.session);
        console.log('Session user_id:', req.session?.user_id);
        console.log('Session role:', req.session?.role);
        console.log('Session data:', req.session);
        console.log('Headers:', req.headers);
        console.log('Cookies:', req.headers.cookie);
        console.log('========================');

        res.status(200).json({
            success: true,
            sessionExists: !!req.session,
            sessionUserId: req.session?.user_id,
            sessionRole: req.session?.role,
            hasCredentials: !!req.headers.cookie
        });
    } catch (error) {
        console.error('Test auth error:', error);
        res.status(500).json({
            success: false,
            message: "Error testing auth"
        });
    }
};

export default createCourseClassDemo;