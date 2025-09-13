import express from 'express';
import UserManagementRoute from './administrator/userManagementRoutes.js';
import AttendanceAdminRoute from './administrator/attendanceRoutes.js';
import SharedAuthRoute from './shared/authRoutes.js';
import NotificationRoute from './shared/notificationRoutes.js';
import SystemRoute from './shared/systemRoutes.js';
import AttendanceRoute from './shared/attendanceRoutes.js';
import CourseRoute from './shared/courseRoutes.js';
import ReportRoute from './shared/reportRoutes.js';
import DashboardRoute from './shared/dashboardRoutes.js';
import RoomAccessRoute from './shared/roomAccessRoutes.js';
import DemoRoute from './shared/demoRoutes.js';

const router = express.Router();

// Administrator routes
router.use('/api/admin', UserManagementRoute);
router.use('/api/attendance', AttendanceAdminRoute);

// Shared routes (all user roles)
router.use('/api/auth', SharedAuthRoute);
router.use('/api/dashboard', DashboardRoute);
router.use('/api/notifications', NotificationRoute);
router.use('/api/system', SystemRoute);
router.use('/api/attendance', AttendanceRoute);
router.use('/api/courses', CourseRoute);
router.use('/api/reports', ReportRoute);
router.use('/api/room-access', RoomAccessRoute);

// Demo routes (no authentication required)
router.use('/api', DemoRoute);

// Test auth route (debugging session data)
router.get('/api/test-auth', (req, res) => {
	res.json({
		hasSession: !!req.session,
		session: req.session ? {
			id: req.session.id,
			user_id: req.session.user_id,
			role: req.session.role,
			legacy_userId: req.session.userId,
			legacy_userRole: req.session.userRole
		} : null
	});
});

export default router;