import express from 'express';
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseClasses,
    createCourseClass,
    getClassEnrollments,
    enrollStudent,
    updateEnrollmentStatus
} from '../../controllers/shared/courseController.js';

const router = express.Router();

// ===============================================
// COURSE MANAGEMENT ROUTES
// ===============================================

// Courses
router.get('/', getCourses);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

// Course Classes
router.get('/:course_id/classes', getCourseClasses);
router.post('/classes', createCourseClass);

// Enrollments
router.get('/classes/:class_id/enrollments', getClassEnrollments);
router.post('/enrollments', enrollStudent);
router.patch('/enrollments/:id/status', updateEnrollmentStatus);

export default router;
