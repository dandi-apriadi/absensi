import express from 'express';
import {
    createAttendanceSession,
    getAttendanceSessions,
    startAttendanceSession,
    endAttendanceSession,
    recordAttendance,
    recordAttendanceByFace,
    getSessionAttendances,
    getAttendanceStatistics,
    updateAttendanceStatus
} from '../../controllers/shared/attendanceController.js';

const router = express.Router();

// ===============================================
// ATTENDANCE MANAGEMENT ROUTES
// ===============================================

// Attendance Sessions
router.post('/sessions', createAttendanceSession);
router.get('/sessions/class/:course_class_id', getAttendanceSessions);
router.patch('/sessions/:id/start', startAttendanceSession);
router.patch('/sessions/:id/end', endAttendanceSession);

// Attendance Records
router.post('/record', recordAttendance);
router.post('/record/face', recordAttendanceByFace);
router.get('/session/:session_id', getSessionAttendances);
router.patch('/records/:id', updateAttendanceStatus);

// Statistics
router.get('/statistics/class/:course_class_id', getAttendanceStatistics);

export default router;
