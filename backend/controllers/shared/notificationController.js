import {
    Notifications,
    Users,
    getUserWithRoleDetails
} from "../../models/index.js";

// ===============================================
// NOTIFICATION CONTROLLERS
// ===============================================

/**
 * Get all notifications for user
 */
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { page = 1, limit = 10, status } = req.query;

        const offset = (page - 1) * limit;

        const whereClause = { user_id: userId };
        if (status) {
            whereClause.status = status;
        }

        const notifications = await Notifications.findAndCountAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: offset,
            include: [
                {
                    model: Users,
                    as: 'sender',
                    attributes: ['full_name', 'role'],
                    required: false
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                notifications: notifications.rows,
                pagination: {
                    total: notifications.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(notifications.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil notifikasi"
        });
    }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        const notification = await Notifications.findOne({
            where: {
                id: id,
                user_id: userId
            }
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notifikasi tidak ditemukan"
            });
        }

        await notification.update({ status: 'read' });

        res.status(200).json({
            success: true,
            message: "Notifikasi berhasil ditandai sebagai dibaca"
        });
    } catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal menandai notifikasi sebagai dibaca"
        });
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.session.userId;

        await Notifications.update(
            { status: 'read' },
            {
                where: {
                    user_id: userId,
                    status: 'unread'
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "Semua notifikasi berhasil ditandai sebagai dibaca"
        });
    } catch (error) {
        console.error('Mark all notifications as read error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal menandai semua notifikasi sebagai dibaca"
        });
    }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        const notification = await Notifications.findOne({
            where: {
                id: id,
                user_id: userId
            }
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notifikasi tidak ditemukan"
            });
        }

        await notification.destroy();

        res.status(200).json({
            success: true,
            message: "Notifikasi berhasil dihapus"
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus notifikasi"
        });
    }
};

/**
 * Send notification (Admin only)
 */
export const sendNotification = async (req, res) => {
    try {
        const { user_id, title, message, type, priority } = req.body;
        const senderId = req.session.userId;
        const senderRole = req.session.role;

        // Check if user has permission to send notifications
        if (senderRole !== 'super-admin' && senderRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses untuk mengirim notifikasi"
            });
        }

        // Validation
        if (!user_id || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "User ID, judul, dan pesan harus diisi"
            });
        }

        // Check if target user exists
        const targetUser = await Users.findByPk(user_id);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        const notification = await Notifications.create({
            user_id,
            sender_id: senderId,
            title,
            message,
            type: type || 'info',
            priority: priority || 'normal',
            status: 'unread'
        });

        res.status(201).json({
            success: true,
            message: "Notifikasi berhasil dikirim",
            data: notification
        });
    } catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengirim notifikasi"
        });
    }
};

/**
 * Broadcast notification to multiple users (Admin only)
 */
export const broadcastNotification = async (req, res) => {
    try {
        const { user_ids, title, message, type, priority } = req.body;
        const senderId = req.session.userId;
        const senderRole = req.session.role;

        // Check if user has permission to broadcast notifications
        if (senderRole !== 'super-admin' && senderRole !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses untuk broadcast notifikasi"
            });
        }

        // Validation
        if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0 || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "User IDs (array), judul, dan pesan harus diisi"
            });
        }

        // Check if all target users exist
        const targetUsers = await Users.findAll({
            where: { id: user_ids },
            attributes: ['id']
        });

        if (targetUsers.length !== user_ids.length) {
            return res.status(404).json({
                success: false,
                message: "Beberapa user tidak ditemukan"
            });
        }

        // Create notifications for all users
        const notifications = user_ids.map(user_id => ({
            user_id,
            sender_id: senderId,
            title,
            message,
            type: type || 'info',
            priority: priority || 'normal',
            status: 'unread'
        }));

        const createdNotifications = await Notifications.bulkCreate(notifications);

        res.status(201).json({
            success: true,
            message: `Notifikasi berhasil dikirim ke ${createdNotifications.length} user`,
            data: {
                sent_count: createdNotifications.length,
                notifications: createdNotifications
            }
        });
    } catch (error) {
        console.error('Broadcast notification error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal broadcast notifikasi"
        });
    }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.session.userId;

        const count = await Notifications.count({
            where: {
                user_id: userId,
                status: 'unread'
            }
        });

        res.status(200).json({
            success: true,
            data: { unread_count: count }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil jumlah notifikasi yang belum dibaca"
        });
    }
};
