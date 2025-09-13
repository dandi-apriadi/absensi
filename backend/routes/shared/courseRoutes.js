import express from 'express';
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseClasses,
    createCourseClass,
    updateCourseClass,
    deleteCourseClass,
    getClassEnrollments,
    enrollStudent,
    updateEnrollmentStatus,
    deleteEnrollment,
    getAllClassesWithStats,
    checkClassScheduleConflicts
} from '../../controllers/shared/courseController.js';
import { verifyUser } from '../../middleware/AuthUser.js';
import createCourseClassDemo from '../../controllers/shared/demoController.js';

const router = express.Router();

// ===============================================
// COURSE MANAGEMENT ROUTES
// ===============================================

// Courses
router.get('/', getCourses);
router.post('/', verifyUser, createCourse);
router.put('/:id', verifyUser, updateCourse);
router.delete('/:id', verifyUser, deleteCourse);

// Course Classes
router.get('/classes/all-with-stats', getAllClassesWithStats); // New endpoint for all classes with stats
router.get('/:course_id/classes', getCourseClasses);
router.post('/classes', verifyUser, createCourseClass);
router.put('/classes/:id', verifyUser, updateCourseClass); // Update class
router.delete('/classes/:id', verifyUser, deleteCourseClass); // Delete class
router.post('/classes/check-conflicts', verifyUser, checkClassScheduleConflicts); // Check schedule conflicts
router.post('/classes/demo', createCourseClassDemo); // Demo endpoint without auth for testing

// Enrollments
router.get('/classes/:class_id/enrollments', verifyUser, getClassEnrollments);
router.post('/enrollments', verifyUser, enrollStudent);
router.patch('/enrollments/:id/status', verifyUser, updateEnrollmentStatus);
router.delete('/enrollments/:id', verifyUser, deleteEnrollment);

export default router;
