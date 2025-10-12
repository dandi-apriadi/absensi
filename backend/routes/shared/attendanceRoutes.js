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
    updateAttendanceStatus,
    checkUserRoomAccess,
    getClassAttendanceData,
    recordAttendanceSmart,
    getTodayAttendances
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
// Smart record from edge device (face recognition): accepts user_id + class_id
router.post('/record/smart', recordAttendanceSmart);
router.get('/session/:session_id', getSessionAttendances);
router.patch('/records/:id', updateAttendanceStatus);

// Statistics
router.get('/statistics/class/:course_class_id', getAttendanceStatistics);

// Class attendance data (for detail view)
router.get('/class/:classId/attendance-data', getClassAttendanceData);

// Room Access Check (for face recognition system)
router.post('/check-access', checkUserRoomAccess);

// Today attendances (simple list for edge UI)
router.get('/today', getTodayAttendances);

export default router;
