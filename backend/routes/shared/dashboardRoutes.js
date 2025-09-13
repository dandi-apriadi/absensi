import express from 'express';
import {
    getSuperAdminDashboard,
    getLecturerDashboard,
    getStudentDashboard
} from '../../controllers/shared/dashboardController.js';

import dashboardController from '../../controllers/administrator/dashboardController.js';

const router = express.Router();

// ===============================================
// DASHBOARD ROUTES
// ===============================================

// Super Admin Dashboard (legacy)
router.get('/super-admin', getSuperAdminDashboard);

// Lecturer Dashboard
router.get('/lecturer', getLecturerDashboard);

// Student Dashboard
router.get('/student', getStudentDashboard);

// ===============================================
// NEW DASHBOARD API ENDPOINTS
// ===============================================

// Dashboard statistics
router.get('/statistics', dashboardController.getStatistics);

// Recent activities
router.get('/activities', dashboardController.getRecentActivities);

// System alerts/notifications
router.get('/alerts', dashboardController.getAlerts);

// System status
router.get('/system-status', dashboardController.getSystemStatus);

// Attendance chart data
router.get('/attendance-chart', dashboardController.getAttendanceChart);

// Legacy dashboard endpoint
router.get('/', dashboardController.getDashboard);

export default router;
