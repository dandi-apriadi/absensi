import express from 'express';
import { createCourseClassDemo, deleteCourseClassDemo, testAuth } from '../../controllers/shared/demoController.js';
import { checkUserRoomAccess } from '../../controllers/shared/attendanceController.js';
import { verifyUser } from '../../middleware/AuthUser.js';

const router = express.Router();

// Demo routes for testing without authentication
router.post('/demo/courses/classes', createCourseClassDemo);
router.delete('/demo/courses/classes/:id', deleteCourseClassDemo);

// Face recognition room access check (no auth required)
router.post('/attendance/check-access', checkUserRoomAccess);

// Test auth endpoint WITH authentication to check session
router.get('/test-auth', verifyUser, testAuth);

export default router;