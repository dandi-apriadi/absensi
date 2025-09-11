import express from 'express';
import UserManagementRoute from './administrator/userManagementRoutes.js';
import SharedAuthRoute from './shared/authRoutes.js';
import NotificationRoute from './shared/notificationRoutes.js';
import SystemRoute from './shared/systemRoutes.js';
import AttendanceRoute from './shared/attendanceRoutes.js';
import CourseRoute from './shared/courseRoutes.js';
import ReportRoute from './shared/reportRoutes.js';
import DashboardRoute from './shared/dashboardRoutes.js';

const router = express.Router();

// Administrator routes
router.use('/api/admin', UserManagementRoute);

// Shared routes (all user roles)
router.use('/api/auth', SharedAuthRoute);
router.use('/api/dashboard', DashboardRoute);
router.use('/api/notifications', NotificationRoute);
router.use('/api/system', SystemRoute);
router.use('/api/attendance', AttendanceRoute);
router.use('/api/courses', CourseRoute);
router.use('/api/reports', ReportRoute);

export default router;