import {
    SystemLogs,
    SystemSettings,
    DoorAccessLogs,
    RoomAccessPermissions,
    Users,
    Rooms
} from "../../models/index.js";
import { Op } from "sequelize";

// ===============================================
// SYSTEM MANAGEMENT CONTROLLERS
// ===============================================

/**
 * Get system logs (Super Admin only)
 */
export const getSystemLogs = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat melihat log sistem"
            });
        }

        const { page = 1, limit = 20, level, action, start_date, end_date } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (level) {
            whereClause.level = level;
        }

        if (action) {
            whereClause.action = { [Op.iLike]: `%${action}%` };
        }

        if (start_date && end_date) {
            whereClause.created_at = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        } else if (start_date) {
            whereClause.created_at = {
                [Op.gte]: new Date(start_date)
            };
        } else if (end_date) {
            whereClause.created_at = {
                [Op.lte]: new Date(end_date)
            };
        }

        const logs = await SystemLogs.findAndCountAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: offset,
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['full_name', 'role', 'user_id'],
                    required: false
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                logs: logs.rows,
                pagination: {
                    total: logs.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(logs.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get system logs error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil log sistem"
        });
    }
};

/**
 * Create system log entry
 */
export const createSystemLog = async (req, res) => {
    try {
        const { level, action, details, ip_address } = req.body;
        const userId = req.session.userId || null;

        // Validation
        if (!level || !action) {
            return res.status(400).json({
                success: false,
                message: "Level dan action harus diisi"
            });
        }

        const log = await SystemLogs.create({
            user_id: userId,
            level,
            action,
            details: details || null,
            ip_address: ip_address || req.ip || req.connection.remoteAddress
        });

        res.status(201).json({
            success: true,
            message: "Log sistem berhasil dibuat",
            data: log
        });
    } catch (error) {
        console.error('Create system log error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat log sistem"
        });
    }
};

/**
 * Get system settings (Admin only)
 */
export const getSystemSettings = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang dapat melihat pengaturan sistem"
            });
        }

        const { category } = req.query;
        let whereClause = {};

        if (category) {
            whereClause.category = category;
        }

        const settings = await SystemSettings.findAll({
            where: whereClause,
            order: [['category', 'ASC'], ['setting_key', 'ASC']]
        });

        // Group settings by category
        const groupedSettings = settings.reduce((acc, setting) => {
            if (!acc[setting.category]) {
                acc[setting.category] = [];
            }
            acc[setting.category].push(setting);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                settings: groupedSettings,
                total: settings.length
            }
        });
    } catch (error) {
        console.error('Get system settings error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil pengaturan sistem"
        });
    }
};

/**
 * Update system setting (Super Admin only)
 */
export const updateSystemSetting = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat mengubah pengaturan sistem"
            });
        }

        const { id } = req.params;
        const { setting_value, description } = req.body;

        const setting = await SystemSettings.findByPk(id);
        if (!setting) {
            return res.status(404).json({
                success: false,
                message: "Pengaturan tidak ditemukan"
            });
        }

        await setting.update({
            setting_value,
            description: description || setting.description,
            updated_at: new Date()
        });

        // Log the change
        await SystemLogs.create({
            user_id: req.session.userId,
            level: 'info',
            action: 'update_system_setting',
            details: `Updated setting: ${setting.setting_key} = ${setting_value}`,
            ip_address: req.ip || req.connection.remoteAddress
        });

        res.status(200).json({
            success: true,
            message: "Pengaturan sistem berhasil diperbarui",
            data: setting
        });
    } catch (error) {
        console.error('Update system setting error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui pengaturan sistem"
        });
    }
};

/**
 * Get door access logs (Admin only)
 */
export const getDoorAccessLogs = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang dapat melihat log akses pintu"
            });
        }

        const { page = 1, limit = 20, room_id, status, start_date, end_date } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (room_id) {
            whereClause.room_id = room_id;
        }

        if (status) {
            whereClause.access_status = status;
        }

        if (start_date && end_date) {
            whereClause.access_time = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }

        const logs = await DoorAccessLogs.findAndCountAll({
            where: whereClause,
            order: [['access_time', 'DESC']],
            limit: parseInt(limit),
            offset: offset,
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['full_name', 'role', 'user_id'],
                    required: false
                },
                {
                    model: Rooms,
                    as: 'room',
                    attributes: ['room_name', 'room_type', 'building'],
                    required: false
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                logs: logs.rows,
                pagination: {
                    total: logs.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(logs.count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get door access logs error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil log akses pintu"
        });
    }
};

/**
 * Get room access permissions (Admin only)
 */
export const getRoomAccessPermissions = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang dapat melihat izin akses ruangan"
            });
        }

        const { room_id, user_id } = req.query;
        let whereClause = {};

        if (room_id) {
            whereClause.room_id = room_id;
        }

        if (user_id) {
            whereClause.user_id = user_id;
        }

        const permissions = await RoomAccessPermissions.findAll({
            where: whereClause,
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['full_name', 'role', 'user_id']
                },
                {
                    model: Rooms,
                    as: 'room',
                    attributes: ['room_name', 'room_type', 'building']
                },
                {
                    model: Users,
                    as: 'grantedBy',
                    attributes: ['full_name', 'role'],
                    required: false
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                permissions,
                total: permissions.length
            }
        });
    } catch (error) {
        console.error('Get room access permissions error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil izin akses ruangan"
        });
    }
};

/**
 * Grant room access permission (Super Admin only)
 */
export const grantRoomAccess = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat memberikan izin akses ruangan"
            });
        }

        const { user_id, room_id, valid_from, valid_until, access_type } = req.body;
        const grantedBy = req.session.userId;

        // Validation
        if (!user_id || !room_id) {
            return res.status(400).json({
                success: false,
                message: "User ID dan Room ID harus diisi"
            });
        }

        // Check if user and room exist
        const [user, room] = await Promise.all([
            Users.findByPk(user_id),
            Rooms.findByPk(room_id)
        ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Ruangan tidak ditemukan"
            });
        }

        // Check if permission already exists
        const existingPermission = await RoomAccessPermissions.findOne({
            where: { user_id, room_id }
        });

        if (existingPermission) {
            return res.status(400).json({
                success: false,
                message: "Izin akses untuk user dan ruangan ini sudah ada"
            });
        }

        const permission = await RoomAccessPermissions.create({
            user_id,
            room_id,
            granted_by: grantedBy,
            valid_from: valid_from || new Date(),
            valid_until: valid_until || null,
            access_type: access_type || 'temporary'
        });

        // Log the action
        await SystemLogs.create({
            user_id: grantedBy,
            level: 'info',
            action: 'grant_room_access',
            details: `Granted ${access_type || 'temporary'} access to room ${room.room_name} for user ${user.full_name}`,
            ip_address: req.ip || req.connection.remoteAddress
        });

        res.status(201).json({
            success: true,
            message: "Izin akses ruangan berhasil diberikan",
            data: permission
        });
    } catch (error) {
        console.error('Grant room access error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal memberikan izin akses ruangan"
        });
    }
};

/**
 * Revoke room access permission (Super Admin only)
 */
export const revokeRoomAccess = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat mencabut izin akses ruangan"
            });
        }

        const { id } = req.params;
        const revokedBy = req.session.userId;

        const permission = await RoomAccessPermissions.findByPk(id, {
            include: [
                { model: Users, as: 'user', attributes: ['full_name'] },
                { model: Rooms, as: 'room', attributes: ['room_name'] }
            ]
        });

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Izin akses tidak ditemukan"
            });
        }

        await permission.destroy();

        // Log the action
        await SystemLogs.create({
            user_id: revokedBy,
            level: 'info',
            action: 'revoke_room_access',
            details: `Revoked room access to ${permission.room.room_name} for user ${permission.user.full_name}`,
            ip_address: req.ip || req.connection.remoteAddress
        });

        res.status(200).json({
            success: true,
            message: "Izin akses ruangan berhasil dicabut"
        });
    } catch (error) {
        console.error('Revoke room access error:', error);
        res.status(500).json({
            success: false,
            message: "Gagal mencabut izin akses ruangan"
        });
    }
};
