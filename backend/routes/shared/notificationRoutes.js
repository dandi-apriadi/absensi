import express from 'express';
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    broadcastNotification,
    getUnreadCount
} from '../../controllers/shared/notificationController.js';

const router = express.Router();

// ===============================================
// NOTIFICATION ROUTES
// ===============================================

// Get user notifications
router.get('/', getUserNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Send notification (Admin/Lecturer only)
router.post('/send', sendNotification);

// Broadcast notification (Admin/Lecturer only)
router.post('/broadcast', broadcastNotification);

export default router;
