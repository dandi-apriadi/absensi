import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import { Users } from "./userManagementModel.js";
import { Rooms } from "./courseManagementModel.js";

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
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    sender_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: true,
        onDelete: 'SET NULL'
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
// 2. DOOR ACCESS LOGS TABLE - Log Akses Pintu
// ===============================================
const DoorAccessLogs = db.define('door_access_logs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'rooms',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: true,
        onDelete: 'SET NULL'
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
        references: {
            model: 'attendance_sessions',
            key: 'id'
        },
        allowNull: true,
        comment: 'Related attendance session if applicable'
    }
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['room_id', 'accessed_at']
        },
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
// 3. ROOM ACCESS PERMISSIONS TABLE - Izin Akses Ruangan
// ===============================================
const RoomAccessPermissions = db.define('room_access_permissions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'rooms',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    permission_type: {
        type: DataTypes.ENUM('full_access', 'scheduled_access', 'limited_access'),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    time_restrictions: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of time slots when access is allowed'
    },
    granted_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            fields: ['user_id', 'room_id']
        },
        {
            fields: ['is_active']
        },
        {
            fields: ['permission_type']
        }
    ]
});

// ===============================================
// 4. SYSTEM LOGS TABLE - Log Sistem & Jejak Audit
// ===============================================
const SystemLogs = db.define('system_logs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: true,
        onDelete: 'SET NULL'
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

// ===============================================
// 5. SYSTEM SETTINGS TABLE - Pengaturan & Konfigurasi
// ===============================================
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
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: true,
        onDelete: 'SET NULL'
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

// ===============================================
// RELATIONSHIPS - RELASI ANTAR TABEL
// ===============================================

// User has many Notifications as recipient (1:many)
Users.hasMany(Notifications, {
    foreignKey: 'recipient_id',
    as: 'receivedNotifications',
    onDelete: 'CASCADE'
});
Notifications.belongsTo(Users, {
    foreignKey: 'recipient_id',
    as: 'recipient',
    onDelete: 'CASCADE'
});

// User has many Notifications as sender (1:many)
Users.hasMany(Notifications, {
    foreignKey: 'sender_id',
    as: 'sentNotifications',
    onDelete: 'SET NULL'
});
Notifications.belongsTo(Users, {
    foreignKey: 'sender_id',
    as: 'sender',
    onDelete: 'SET NULL'
});

// Room has many DoorAccessLogs (1:many)
Rooms.hasMany(DoorAccessLogs, {
    foreignKey: 'room_id',
    as: 'accessLogs',
    onDelete: 'CASCADE'
});
DoorAccessLogs.belongsTo(Rooms, {
    foreignKey: 'room_id',
    as: 'room',
    onDelete: 'CASCADE'
});

// User has many DoorAccessLogs (1:many)
Users.hasMany(DoorAccessLogs, {
    foreignKey: 'user_id',
    as: 'accessLogs',
    onDelete: 'SET NULL'
});
DoorAccessLogs.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'SET NULL'
});

// User has many RoomAccessPermissions (1:many)
Users.hasMany(RoomAccessPermissions, {
    foreignKey: 'user_id',
    as: 'roomPermissions',
    onDelete: 'CASCADE'
});
RoomAccessPermissions.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
});

// Room has many RoomAccessPermissions (1:many)
Rooms.hasMany(RoomAccessPermissions, {
    foreignKey: 'room_id',
    as: 'accessPermissions',
    onDelete: 'CASCADE'
});
RoomAccessPermissions.belongsTo(Rooms, {
    foreignKey: 'room_id',
    as: 'room',
    onDelete: 'CASCADE'
});

// User granted permissions (1:many)
Users.hasMany(RoomAccessPermissions, {
    foreignKey: 'granted_by',
    as: 'grantedPermissions',
    onDelete: 'SET NULL'
});
RoomAccessPermissions.belongsTo(Users, {
    foreignKey: 'granted_by',
    as: 'grantor',
    onDelete: 'SET NULL'
});

// User has many SystemLogs (1:many)
Users.hasMany(SystemLogs, {
    foreignKey: 'user_id',
    as: 'systemLogs',
    onDelete: 'SET NULL'
});
SystemLogs.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'SET NULL'
});

// User updated SystemSettings (1:many)
Users.hasMany(SystemSettings, {
    foreignKey: 'updated_by',
    as: 'updatedSettings',
    onDelete: 'SET NULL'
});
SystemSettings.belongsTo(Users, {
    foreignKey: 'updated_by',
    as: 'updater',
    onDelete: 'SET NULL'
});

export {
    Notifications,
    DoorAccessLogs,
    RoomAccessPermissions,
    SystemLogs,
    SystemSettings
};
