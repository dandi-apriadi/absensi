import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// ===============================================
// 1. NOTIFICATIONS TABLE - Sistem Notifikasi
// ===============================================
const Notifications = db.define('notifications', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    recipient_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Reference to users table user_id field (manual relationship)'
    },
    sender_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Reference to users table user_id field - sender (manual relationship)'
    },
    type: {
        type: DataTypes.ENUM(
            'attendance_reminder',
            'session_cancelled',
            'session_rescheduled',
            'low_attendance_warning',
            'face_dataset_approved',
            'face_dataset_rejected',
            'system_maintenance',
            'security_alert',
            'grade_updated',
            'general_announcement'
        ),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional data related to notification'
    },
    priority: {
        type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal'
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    delivery_method: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of delivery methods: email, push, sms'
    },
    scheduled_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'For scheduled notifications'
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            fields: ['recipient_id', 'is_read']
        },
        {
            fields: ['type', 'created_at']
        },
        {
            fields: ['priority']
        },
        {
            fields: ['expires_at']
        }
    ]
});

// ===============================================
// 2. DOOR ACCESS LOGS TABLE - Log Akses Pintu (Simplified - 1 Room Only)
// ===============================================
const DoorAccessLogs = db.define('door_access_logs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Reference to users table user_id field (manual relationship)'
    },
    access_type: {
        type: DataTypes.ENUM('face_recognition', 'keycard', 'manual_override', 'emergency'),
        allowNull: false
    },
    access_status: {
        type: DataTypes.ENUM('granted', 'denied', 'forced'),
        allowNull: false
    },
    confidence_score: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: true
    },
    reason: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Reason for denial or override'
    },
    accessed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    session_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to attendance_sessions table if applicable (manual relationship)'
    }
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['access_status']
        },
        {
            fields: ['accessed_at']
        }
    ]
});

// ===============================================
// 4. SYSTEM LOGS TABLE - Log Sistem & Jejak Audit
// ===============================================
// REMOVED: SystemLogs table dihapus untuk simplifikasi
// Diganti dengan file-based logging system (backend/utils/logger.js)
/*
const SystemLogs = db.define('system_logs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to users table (manual relationship)'
    },
    action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Action performed: login, logout, create_user, etc.'
    },
    table_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Table affected by the action'
    },
    record_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of affected record'
    },
    old_values: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous values before update'
    },
    new_values: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'New values after update'
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    session_id: {
        type: DataTypes.STRING(128),
        allowNull: true
    },
    severity: {
        type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
        defaultValue: 'info'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            fields: ['user_id', 'created_at']
        },
        {
            fields: ['action', 'table_name']
        },
        {
            fields: ['severity']
        },
        {
            fields: ['created_at']
        }
    ]
});
*/

// ===============================================
// 5. SYSTEM SETTINGS TABLE - Pengaturan & Konfigurasi
// ===============================================
// REMOVED: SystemSettings table dihapus untuk simplifikasi
// Diganti dengan environment variables dan static config (backend/config/systemSettings.js)
/*
const SystemSettings = db.define('system_settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    setting_key: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    setting_value: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    setting_type: {
        type: DataTypes.ENUM('string', 'integer', 'boolean', 'json'),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'attendance, security, notification, etc.'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Can be accessed by non-admin users'
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to users table - who updated the setting (manual relationship)'
    }
}, {
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['setting_key']
        },
        {
            fields: ['category']
        },
        {
            fields: ['is_public']
        }
    ]
});
*/

// ===============================================
// RELATIONSHIPS REMOVED TO PREVENT TABLESPACE ISSUES
// ===============================================
// All model relationships have been removed to prevent foreign key constraint issues
// and tablespace conflicts during database initialization.
// 
// Foreign key fields still exist in the tables as regular INTEGER fields
// but without Sequelize associations to avoid automatic constraint creation.
//
// Manual joins can still be performed in queries when needed:
// 
// Example manual joins:
// const notification = await Notifications.findByPk(notificationId);
// const recipient = await Users.findByPk(notification.recipient_id);
// const sender = await Users.findByPk(notification.sender_id);

export {
    Notifications,
    DoorAccessLogs
};
