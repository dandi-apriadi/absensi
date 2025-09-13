import express from 'express';
import { verifyUser } from '../../middleware/AuthUser.js';
import {
    getClassesWithRoomAccess,
    getDoorStatus,
    revokeClassAccess,
    grantClassAccess,
    getClassAccessDetail
} from '../../controllers/shared/roomAccessController.js';

const router = express.Router();

// Room Access Routes
router.get('/classes', verifyUser, getClassesWithRoomAccess); // Get all classes with room access info
router.get('/door/status', verifyUser, getDoorStatus); // Get door system status
router.get('/classes/:classId/detail', verifyUser, getClassAccessDetail); // Get detailed access info for a class
router.patch('/classes/:classId/revoke', verifyUser, revokeClassAccess); // Revoke access for a class
router.patch('/classes/:classId/grant', verifyUser, grantClassAccess); // Grant access for a class

export default router;