import {
    DoorAccessLogs,
    Users
} from "../../models/index.js";
import { Op } from "sequelize";
import logger from "../../utils/logger.js";

// ===============================================
// SYSTEM MANAGEMENT CONTROLLERS
// ===============================================

/**
 * Get system logs from file system (Super Admin only)
 */
export const getSystemLogs = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat melihat log sistem"
            });
        }

        const { page = 1, limit = 20, level, type = 'app', date } = req.query;
        const offset = (page - 1) * limit;

        // Get logs from file system
        let logEntries = [];
        
        if (date) {
            // Get logs for specific date
            const logFile = logger.getLogFiles(new Date(date), new Date(date), type);
            if (logFile.length > 0) {
                logEntries = logger.readLogFile(logFile[0], { level });
            }
        } else {
            // Get logs for last 7 days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            
            const logFiles = logger.getLogFiles(startDate, endDate, type);
            for (const file of logFiles) {
                const entries = logger.readLogFile(file, { level });
                logEntries = [...logEntries, ...entries];
            }
        }

        // Sort by timestamp (newest first)
        logEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Apply pagination
        const total = logEntries.length;
        const paginatedLogs = logEntries.slice(offset, offset + parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                logs: paginatedLogs,
                pagination: {
                    total: total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            },
            message: "Log sistem berhasil diambil dari file system"
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
 * Create system log entry (using file-based logging)
 */
export const createSystemLog = async (req, res) => {
    try {
        const { level = 'info', action, details, type = 'system' } = req.body;
        const userId = req.session.userId || null;

        // Validation
        if (!action) {
            return res.status(400).json({
                success: false,
                message: "Action harus diisi"
            });
        }

        // Create log entry using file-based logger
        const logData = {
            user_id: userId,
            action,
            details: details || null,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('User-Agent')
        };

        // Use appropriate logging method based on level
        switch (level.toLowerCase()) {
            case 'error':
                logger.error(`System Action: ${action}`, logData, type);
                break;
            case 'warn':
                logger.warn(`System Action: ${action}`, logData, type);
                break;
            case 'debug':
                logger.debug(`System Action: ${action}`, logData, type);
                break;
            default:
                logger.info(`System Action: ${action}`, logData, type);
        }

        res.status(201).json({
            success: true,
            message: "Log sistem berhasil dibuat",
            data: {
                level,
                action,
                details,
                timestamp: new Date().toISOString(),
                logged_to_file: true
            }
        });
    } catch (error) {
        console.error('Create system log error:', error);
        logger.error('Failed to create system log', { 
            error: error.message,
            action: req.body.action 
        });
        res.status(500).json({
            success: false,
            message: "Gagal membuat log sistem"
        });
    }
};

/**
 * Get system settings from static configuration (Admin only)
 */
export const getSystemSettings = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin' && req.session.role !== 'lecturer') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang dapat melihat pengaturan sistem"
            });
        }

        // Import system configuration
        const { SYSTEM_CONFIG } = await import('../../config/systemSettings.js');
        
        const { category } = req.query;
        
        let settingsData = {};
        
        if (category) {
            // Return specific category
            if (SYSTEM_CONFIG[category.toUpperCase()]) {
                settingsData[category.toUpperCase()] = SYSTEM_CONFIG[category.toUpperCase()];
            } else {
                return res.status(404).json({
                    success: false,
                    message: `Kategori '${category}' tidak ditemukan`
                });
            }
        } else {
            // Return all settings
            settingsData = SYSTEM_CONFIG;
        }

        res.status(200).json({
            success: true,
            data: {
                settings: settingsData,
                source: 'static_configuration',
                environment: process.env.NODE_ENV || 'development'
            },
            message: "Pengaturan sistem berhasil diambil dari konfigurasi static"
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
 * Note: Settings are now managed via environment variables
 */
export const updateSystemSetting = async (req, res) => {
    try {
        if (req.session.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya super admin yang dapat mengubah pengaturan sistem"
            });
        }

        const { category, key } = req.params;
        const { value, description } = req.body;

        // Since settings are now environment-based, we can't update them directly
        // This endpoint now serves as an information endpoint
        
        logger.system('setting_update_attempted', {
            user_id: req.session.userId,
            category,
            key,
            attempted_value: value,
            ip_address: req.ip || req.connection.remoteAddress,
            note: 'Settings are now managed via environment variables'
        });

        res.status(200).json({
            success: false,
            message: "Pengaturan sistem sekarang dikelola melalui environment variables. Silakan update file .env dan restart aplikasi.",
            data: {
                category,
                key,
                attempted_value: value,
                current_management: "environment_variables",
                config_file: "backend/config/systemSettings.js",
                env_file: ".env"
            }
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

        const { page = 1, limit = 20, status, start_date, end_date } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

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

        const { user_id } = req.query;
        let whereClause = {};

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

// ===============================================
// ROOM ACCESS FUNCTIONS REMOVED
// ===============================================
// Since we only have 1 room, room access permission system is no longer needed.
// All users can access the main room based on their role and schedule.
// Door access is controlled by face recognition and user validation.
