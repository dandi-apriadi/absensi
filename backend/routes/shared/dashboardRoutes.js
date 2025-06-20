import express from 'express';
import {
    getSuperAdminDashboard,
    getLecturerDashboard,
    getStudentDashboard
} from '../../controllers/shared/dashboardController.js';

const router = express.Router();

// ===============================================
// DASHBOARD ROUTES
// ===============================================

// Super Admin Dashboard
router.get('/super-admin', getSuperAdminDashboard);

// Lecturer Dashboard
router.get('/lecturer', getLecturerDashboard);

// Student Dashboard
router.get('/student', getStudentDashboard);

export default router;
