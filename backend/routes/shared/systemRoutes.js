import express from 'express';
import {
    getSystemLogs,
    createSystemLog,
    getSystemSettings,
    updateSystemSetting,
    getDoorAccessLogs,
    getRoomAccessPermissions,
    grantRoomAccess,
    revokeRoomAccess
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
router.put('/settings/:id', updateSystemSetting);

// Door Access Logs
router.get('/door-access-logs', getDoorAccessLogs);

// Room Access Permissions
router.get('/room-access-permissions', getRoomAccessPermissions);
router.post('/room-access-permissions', grantRoomAccess);
router.delete('/room-access-permissions/:id', revokeRoomAccess);

export default router;
