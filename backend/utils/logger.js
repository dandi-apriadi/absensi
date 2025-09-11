/**
 * APPLICATION LOGGER
 * Menggantikan SystemLogs table dengan file-based logging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================================
// LOGGER CONFIGURATION
// ===============================================
const LOG_CONFIG = {
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_FILE_PATH: process.env.LOG_FILE_PATH || path.join(__dirname, '../logs'),
    MAX_FILE_SIZE: parseInt(process.env.MAX_LOG_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    MAX_FILES: parseInt(process.env.MAX_LOG_FILES) || 10,
    DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    TIMEZONE: process.env.TIMEZONE || 'Asia/Jakarta'
};

// Log levels
const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

/**
 * Ensure log directory exists
 */
const ensureLogDirectory = () => {
    if (!fs.existsSync(LOG_CONFIG.LOG_FILE_PATH)) {
        fs.mkdirSync(LOG_CONFIG.LOG_FILE_PATH, { recursive: true });
    }
};

/**
 * Format timestamp
 * @returns {string}
 */
const getTimestamp = () => {
    return new Date().toLocaleString('id-ID', {
        timeZone: LOG_CONFIG.TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

/**
 * Get log file path for specific type and date
 * @param {string} type - Log type (app, security, attendance, etc.)
 * @param {Date} date - Date object
 * @returns {string}
 */
const getLogFilePath = (type, date = new Date()) => {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(LOG_CONFIG.LOG_FILE_PATH, `${type}-${dateStr}.log`);
};

/**
 * Rotate log file if it exceeds max size
 * @param {string} filePath - Path to log file
 */
const rotateLogFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    const stats = fs.statSync(filePath);
    if (stats.size > LOG_CONFIG.MAX_FILE_SIZE) {
        const timestamp = Date.now();
        const rotatedPath = filePath.replace('.log', `-${timestamp}.log`);
        fs.renameSync(filePath, rotatedPath);
        
        // Clean up old rotated files
        cleanupOldLogs(path.dirname(filePath), path.basename(filePath, '.log'));
    }
};

/**
 * Clean up old log files
 * @param {string} logDir - Log directory
 * @param {string} baseFileName - Base file name
 */
const cleanupOldLogs = (logDir, baseFileName) => {
    try {
        const files = fs.readdirSync(logDir)
            .filter(file => file.startsWith(baseFileName) && file.includes('-'))
            .map(file => ({
                name: file,
                path: path.join(logDir, file),
                stats: fs.statSync(path.join(logDir, file))
            }))
            .sort((a, b) => b.stats.mtime - a.stats.mtime);
        
        // Keep only MAX_FILES number of rotated files
        if (files.length > LOG_CONFIG.MAX_FILES) {
            const filesToDelete = files.slice(LOG_CONFIG.MAX_FILES);
            filesToDelete.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }
    } catch (error) {
        console.error('Error cleaning up old logs:', error);
    }
};

/**
 * Write log entry to file
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 * @param {string} type - Log type/category
 */
const writeLog = (level, message, data = {}, type = 'app') => {
    const currentLevel = LOG_LEVELS[LOG_CONFIG.LOG_LEVEL] || LOG_LEVELS.info;
    const messageLevel = LOG_LEVELS[level] || LOG_LEVELS.info;
    
    // Skip if message level is higher than configured level
    if (messageLevel > currentLevel) return;
    
    try {
        ensureLogDirectory();
        
        const logFilePath = getLogFilePath(type);
        rotateLogFile(logFilePath);
        
        const logEntry = {
            timestamp: getTimestamp(),
            level: level.toUpperCase(),
            message,
            ...data
        };
        
        const logLine = JSON.stringify(logEntry) + '\n';
        
        fs.appendFileSync(logFilePath, logLine, 'utf8');
        
        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[${logEntry.timestamp}] ${logEntry.level}: ${message}`, data);
        }
        
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
};

// ===============================================
// LOGGER CLASS
// ===============================================
class Logger {
    
    /**
     * Log info message
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {string} type - Log type
     */
    info(message, data = {}, type = 'app') {
        writeLog('info', message, data, type);
    }
    
    /**
     * Log warning message
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {string} type - Log type
     */
    warn(message, data = {}, type = 'app') {
        writeLog('warn', message, data, type);
    }
    
    /**
     * Log error message
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {string} type - Log type
     */
    error(message, data = {}, type = 'app') {
        writeLog('error', message, data, type);
    }
    
    /**
     * Log debug message
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {string} type - Log type
     */
    debug(message, data = {}, type = 'app') {
        writeLog('debug', message, data, type);
    }
    
    // ===============================================
    // SPECIALIZED LOGGING METHODS
    // ===============================================
    
    /**
     * Log user activity
     * @param {string} action - Action performed
     * @param {Object} user - User object
     * @param {Object} data - Additional data
     */
    userActivity(action, user, data = {}) {
        this.info(`User Activity: ${action}`, {
            user_id: user.id,
            user_role: user.role,
            user_email: user.email,
            action,
            ...data
        }, 'user-activity');
    }
    
    /**
     * Log authentication events
     * @param {string} event - Auth event (login, logout, failed_login, etc.)
     * @param {Object} data - Event data
     */
    auth(event, data = {}) {
        const level = event.includes('failed') || event.includes('blocked') ? 'warn' : 'info';
        writeLog(level, `Auth Event: ${event}`, {
            event,
            ip_address: data.ip_address,
            user_agent: data.user_agent,
            ...data
        }, 'security');
    }
    
    /**
     * Log attendance events
     * @param {string} action - Attendance action
     * @param {Object} data - Attendance data
     */
    attendance(action, data = {}) {
        this.info(`Attendance: ${action}`, {
            action,
            session_id: data.session_id,
            student_id: data.student_id,
            method_used: data.method_used,
            attendance_status: data.attendance_status,
            confidence_score: data.confidence_score,
            ...data
        }, 'attendance');
    }
    
    /**
     * Log face recognition events
     * @param {string} action - Face recognition action
     * @param {Object} data - Recognition data
     */
    faceRecognition(action, data = {}) {
        this.info(`Face Recognition: ${action}`, {
            action,
            user_id: data.user_id,
            confidence_score: data.confidence_score,
            processing_time: data.processing_time,
            ...data
        }, 'face-recognition');
    }
    
    /**
     * Log door access events
     * @param {string} action - Door access action
     * @param {Object} data - Access data
     */
    doorAccess(action, data = {}) {
        const level = data.access_granted === false ? 'warn' : 'info';
        writeLog(level, `Door Access: ${action}`, {
            action,
            user_id: data.user_id,
            access_method: data.access_method,
            access_granted: data.access_granted,
            confidence_score: data.confidence_score,
            reason: data.reason,
            ...data
        }, 'door-access');
    }
    
    /**
     * Log system events
     * @param {string} event - System event
     * @param {Object} data - Event data
     */
    system(event, data = {}) {
        const level = event.includes('error') || event.includes('failed') ? 'error' : 'info';
        writeLog(level, `System: ${event}`, {
            event,
            ...data
        }, 'system');
    }
    
    /**
     * Log API requests
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {number} duration - Request duration in ms
     */
    apiRequest(req, res, duration) {
        const data = {
            method: req.method,
            url: req.originalUrl || req.url,
            status_code: res.statusCode,
            duration_ms: duration,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('User-Agent'),
            user_id: req.user?.id
        };
        
        const level = res.statusCode >= 400 ? 'warn' : 'info';
        writeLog(level, `API Request: ${req.method} ${req.originalUrl}`, data, 'api');
    }
    
    // ===============================================
    // LOG MANAGEMENT METHODS
    // ===============================================
    
    /**
     * Get log files for a specific date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {string} type - Log type
     * @returns {Array} Array of log file paths
     */
    getLogFiles(startDate, endDate, type = 'app') {
        const files = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const filePath = getLogFilePath(type, currentDate);
            if (fs.existsSync(filePath)) {
                files.push(filePath);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return files;
    }
    
    /**
     * Read log entries from file
     * @param {string} filePath - Log file path
     * @param {Object} filter - Filter criteria
     * @returns {Array} Array of log entries
     */
    readLogFile(filePath, filter = {}) {
        if (!fs.existsSync(filePath)) return [];
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.trim().split('\n').filter(line => line.trim());
            
            return lines
                .map(line => {
                    try {
                        return JSON.parse(line);
                    } catch {
                        return null;
                    }
                })
                .filter(entry => entry !== null)
                .filter(entry => {
                    // Apply filters
                    if (filter.level && entry.level !== filter.level.toUpperCase()) return false;
                    if (filter.user_id && entry.user_id !== filter.user_id) return false;
                    if (filter.action && !entry.action?.includes(filter.action)) return false;
                    return true;
                });
        } catch (error) {
            this.error('Error reading log file', { filePath, error: error.message });
            return [];
        }
    }
    
    /**
     * Clean up old logs
     * @param {number} daysToKeep - Number of days to keep logs
     */
    cleanup(daysToKeep = 30) {
        try {
            ensureLogDirectory();
            
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            
            const files = fs.readdirSync(LOG_CONFIG.LOG_FILE_PATH);
            
            files.forEach(file => {
                const filePath = path.join(LOG_CONFIG.LOG_FILE_PATH, file);
                const stats = fs.statSync(filePath);
                
                if (stats.mtime < cutoffDate) {
                    fs.unlinkSync(filePath);
                    this.info('Log file cleaned up', { file, age_days: daysToKeep });
                }
            });
        } catch (error) {
            this.error('Error during log cleanup', { error: error.message });
        }
    }
}

// ===============================================
// MIDDLEWARE FOR EXPRESS
// ===============================================
export const loggerMiddleware = (req, res, next) => {
    const startTime = Date.now();
    
    // Override res.end to capture response time
    const originalEnd = res.end;
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        logger.apiRequest(req, res, duration);
        originalEnd.apply(this, args);
    };
    
    next();
};

// ===============================================
// EXPORT LOGGER INSTANCE
// ===============================================
const logger = new Logger();
export default logger;
