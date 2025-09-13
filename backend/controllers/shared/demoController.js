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

export default createCourseClassDemo;