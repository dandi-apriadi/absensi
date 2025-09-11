import express from 'express';
import {
    getSystemLogs,
    createSystemLog,
    getSystemSettings,
    updateSystemSetting,
    getDoorAccessLogs
} from '../../controllers/shared/systemController.js';

const router = express.Router();

// ===============================================
// SYSTEM MANAGEMENT ROUTES
// ===============================================

// System Logs
router.get('/logs', getSystemLogs);
router.post('/logs', createSystemLog);

// System Settings
router.get('/settings', getSystemSettings);
router.put('/settings/:category/:key', updateSystemSetting);

// Door Access Logs
router.get('/door-access-logs', getDoorAccessLogs);

// Room Access Permissions - REMOVED (Single room system)
// All users access the main room based on their role and schedule

export default router;
