/**
 * SYSTEM CONFIGURATION
 * Menggantikan SystemSettings table dengan environment variables dan static config
 */

// ===============================================
// SYSTEM CONFIGURATION CONSTANTS
// ===============================================
export const SYSTEM_CONFIG = {
    
    // ===============================================
    // FACE RECOGNITION SETTINGS
    // ===============================================
    FACE_RECOGNITION: {
        MAX_DATASETS_PER_USER: parseInt(process.env.MAX_FACE_DATASETS) || 5,
        MIN_CONFIDENCE_SCORE: parseFloat(process.env.MIN_CONFIDENCE_SCORE) || 0.8,
        IMAGE_QUALITY_THRESHOLD: parseFloat(process.env.IMAGE_QUALITY_THRESHOLD) || 0.7,
        SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png'],
        MAX_IMAGE_SIZE_MB: parseInt(process.env.MAX_IMAGE_SIZE_MB) || 5,
        IMAGE_RESOLUTION: {
            MIN_WIDTH: 300,
            MIN_HEIGHT: 300,
            MAX_WIDTH: 1920,
            MAX_HEIGHT: 1920
        }
    },
    
    // ===============================================
    // ATTENDANCE SETTINGS
    // ===============================================
    ATTENDANCE: {
        LATE_THRESHOLD_MINUTES: parseInt(process.env.LATE_THRESHOLD_MINUTES) || 15,
        QR_CODE_EXPIRE_MINUTES: parseInt(process.env.QR_CODE_EXPIRE_MINUTES) || 5,
        AUTO_CLOSE_ATTENDANCE_HOURS: parseInt(process.env.AUTO_CLOSE_ATTENDANCE_HOURS) || 2,
        MIN_ATTENDANCE_PERCENTAGE: parseInt(process.env.MIN_ATTENDANCE_PERCENTAGE) || 75,
        EARLY_CHECKIN_MINUTES: parseInt(process.env.EARLY_CHECKIN_MINUTES) || 30,
        METHODS: {
            FACE_RECOGNITION: 'face_recognition',
            QR_CODE: 'qr_code',
            MANUAL: 'manual'
        }
    },
    
    // ===============================================
    // DOOR ACCESS SETTINGS
    // ===============================================
    DOOR_ACCESS: {
        MAX_FAILED_ATTEMPTS: parseInt(process.env.MAX_FAILED_ATTEMPTS) || 3,
        LOCKOUT_DURATION_MINUTES: parseInt(process.env.LOCKOUT_DURATION_MINUTES) || 30,
        ACCESS_LOG_RETENTION_DAYS: parseInt(process.env.ACCESS_LOG_RETENTION_DAYS) || 90,
        EMERGENCY_ACCESS_CODE: process.env.EMERGENCY_ACCESS_CODE || 'EMERGENCY123',
        ADMIN_OVERRIDE_ENABLED: process.env.ADMIN_OVERRIDE_ENABLED === 'true'
    },
    
    // ===============================================
    // NOTIFICATION SETTINGS
    // ===============================================
    NOTIFICATIONS: {
        REMINDER_BEFORE_CLASS_MINUTES: parseInt(process.env.REMINDER_BEFORE_CLASS_MINUTES) || 15,
        LOW_ATTENDANCE_THRESHOLD: parseInt(process.env.LOW_ATTENDANCE_THRESHOLD) || 75,
        BATCH_SIZE: parseInt(process.env.NOTIFICATION_BATCH_SIZE) || 100,
        RETRY_ATTEMPTS: parseInt(process.env.NOTIFICATION_RETRY_ATTEMPTS) || 3,
        TYPES: {
            ATTENDANCE_REMINDER: 'attendance_reminder',
            SESSION_CANCELLED: 'session_cancelled',
            LOW_ATTENDANCE: 'low_attendance',
            FACE_DATASET_UPDATE: 'face_dataset_update',
            SYSTEM_ALERT: 'system_alert',
            GENERAL: 'general'
        }
    },
    
    // ===============================================
    // SECURITY SETTINGS
    // ===============================================
    SECURITY: {
        PASSWORD_MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
        PASSWORD_REQUIRE_UPPERCASE: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
        PASSWORD_REQUIRE_NUMBERS: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
        PASSWORD_REQUIRE_SYMBOLS: process.env.PASSWORD_REQUIRE_SYMBOLS === 'true',
        SESSION_TIMEOUT_MINUTES: parseInt(process.env.SESSION_TIMEOUT_MINUTES) || 60,
        MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
        LOCKOUT_DURATION_MINUTES: parseInt(process.env.LOCKOUT_DURATION_MINUTES) || 15
    },
    
    // ===============================================
    // FILE UPLOAD SETTINGS
    // ===============================================
    UPLOAD: {
        MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB) || 10,
        ALLOWED_EXTENSIONS: (process.env.ALLOWED_EXTENSIONS || 'jpg,jpeg,png,pdf').split(','),
        UPLOAD_PATH: process.env.UPLOAD_PATH || './public/uploads',
        PROFILE_PICTURE_PATH: process.env.PROFILE_PICTURE_PATH || './public/images/profiles',
        FACE_DATASET_PATH: process.env.FACE_DATASET_PATH || './public/uploads/faces'
    },
    
    // ===============================================
    // DATABASE SETTINGS
    // ===============================================
    DATABASE: {
        BACKUP_RETENTION_DAYS: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
        LOG_RETENTION_DAYS: parseInt(process.env.LOG_RETENTION_DAYS) || 90,
        MAX_CONNECTIONS: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
        CONNECTION_TIMEOUT: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 60000
    },
    
    // ===============================================
    // APPLICATION SETTINGS
    // ===============================================
    APPLICATION: {
        NAME: process.env.APP_NAME || 'Sistem Absensi',
        VERSION: process.env.APP_VERSION || '1.0.0',
        ENVIRONMENT: process.env.NODE_ENV || 'development',
        PORT: parseInt(process.env.PORT) || 3000,
        BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
        API_PREFIX: process.env.API_PREFIX || '/api',
        TIMEZONE: process.env.TIMEZONE || 'Asia/Jakarta'
    }
};

// ===============================================
// PERMISSION CONSTANTS
// ===============================================
export const PERMISSIONS = {
    
    // User Management
    USER_CREATE: 'user:create',
    USER_READ: 'user:read',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
    
    // Course Management
    COURSE_CREATE: 'course:create',
    COURSE_READ: 'course:read',
    COURSE_UPDATE: 'course:update',
    COURSE_DELETE: 'course:delete',
    
    // Schedule Management
    SCHEDULE_CREATE: 'schedule:create',
    SCHEDULE_READ: 'schedule:read',
    SCHEDULE_UPDATE: 'schedule:update',
    SCHEDULE_DELETE: 'schedule:delete',
    
    // Attendance Management
    ATTENDANCE_CREATE: 'attendance:create',
    ATTENDANCE_READ: 'attendance:read',
    ATTENDANCE_UPDATE: 'attendance:update',
    ATTENDANCE_DELETE: 'attendance:delete',
    ATTENDANCE_OVERRIDE: 'attendance:override',
    
    // Face Dataset Management
    FACE_DATASET_CREATE: 'face_dataset:create',
    FACE_DATASET_READ: 'face_dataset:read',
    FACE_DATASET_UPDATE: 'face_dataset:update',
    FACE_DATASET_DELETE: 'face_dataset:delete',
    FACE_DATASET_APPROVE: 'face_dataset:approve',
    
    // Door Access
    DOOR_ACCESS_READ: 'door_access:read',
    DOOR_ACCESS_OVERRIDE: 'door_access:override',
    DOOR_ACCESS_EMERGENCY: 'door_access:emergency',
    
    // System Administration
    SYSTEM_ADMIN: 'system:admin',
    SYSTEM_LOGS: 'system:logs',
    SYSTEM_BACKUP: 'system:backup'
};

// ===============================================
// ROLE-BASED PERMISSIONS
// ===============================================
export const ROLE_PERMISSIONS = {
    
    student: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.COURSE_READ,
        PERMISSIONS.SCHEDULE_READ,
        PERMISSIONS.ATTENDANCE_READ,
        PERMISSIONS.FACE_DATASET_CREATE,
        PERMISSIONS.FACE_DATASET_READ
    ],
    
    lecturer: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.COURSE_READ,
        PERMISSIONS.SCHEDULE_READ,
        PERMISSIONS.SCHEDULE_UPDATE,
        PERMISSIONS.ATTENDANCE_CREATE,
        PERMISSIONS.ATTENDANCE_READ,
        PERMISSIONS.ATTENDANCE_UPDATE,
        PERMISSIONS.ATTENDANCE_OVERRIDE,
        PERMISSIONS.FACE_DATASET_READ,
        PERMISSIONS.FACE_DATASET_APPROVE,
        PERMISSIONS.DOOR_ACCESS_READ
    ],
    
    admin: [
        // All permissions
        ...Object.values(PERMISSIONS)
    ]
};

// ===============================================
// HELPER FUNCTIONS
// ===============================================

/**
 * Check if user has specific permission
 * @param {string} userRole - User role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (userRole, permission) => {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
};

/**
 * Check if user can access room
 * @param {Object} user - User object
 * @param {Object} room - Room object
 * @param {Object} schedule - Schedule object (optional)
 * @returns {boolean}
 */
export const canAccessRoom = (user, room, schedule = null) => {
    // Admin can access all rooms
    if (user.role === 'admin') return true;
    
    // If room doesn't have door access system, allow access
    if (!room.has_door_access) return true;
    
    // Lecturer can access room if they have schedule there
    if (user.role === 'lecturer' && schedule && schedule.lecturer_id === user.id) {
        return true;
    }
    
    // Student can access room if they're enrolled in a class there
    // This check should be done with enrollment data in actual implementation
    
    return false;
};

/**
 * Get configuration value with fallback
 * @param {string} path - Configuration path (e.g., 'FACE_RECOGNITION.MAX_DATASETS_PER_USER')
 * @param {any} fallback - Fallback value
 * @returns {any}
 */
export const getConfig = (path, fallback = null) => {
    const keys = path.split('.');
    let value = SYSTEM_CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return fallback;
        }
    }
    
    return value;
};

/**
 * Validate environment configuration
 * @returns {Object} Validation result
 */
export const validateConfig = () => {
    const errors = [];
    const warnings = [];
    
    // Check critical environment variables
    const requiredVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'NODE_ENV'
    ];
    
    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            errors.push(`Missing required environment variable: ${varName}`);
        }
    }
    
    // Check numeric values
    if (isNaN(SYSTEM_CONFIG.ATTENDANCE.LATE_THRESHOLD_MINUTES)) {
        warnings.push('LATE_THRESHOLD_MINUTES is not a valid number, using default');
    }
    
    if (isNaN(SYSTEM_CONFIG.FACE_RECOGNITION.MIN_CONFIDENCE_SCORE)) {
        warnings.push('MIN_CONFIDENCE_SCORE is not a valid number, using default');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

// ===============================================
// EXPORTS
// ===============================================
export default {
    SYSTEM_CONFIG,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    hasPermission,
    canAccessRoom,
    getConfig,
    validateConfig
};
