import express from 'express';
import {
    getClassAttendanceReport,
    getStudentAttendanceReport,
    getLecturerAttendanceSummary
} from '../../controllers/shared/reportController.js';

const router = express.Router();

// ===============================================
// REPORT ROUTES
// ===============================================

// Class attendance report
router.get('/attendance/class/:class_id', getClassAttendanceReport);

// Student attendance report
router.get('/attendance/student/:student_id', getStudentAttendanceReport);

// Lecturer attendance summary
router.get('/attendance/lecturer/:lecturer_id', getLecturerAttendanceSummary);

export default router;
