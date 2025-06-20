// ===============================================
// UTILITY FUNCTIONS FOR COMMON TASKS
// ===============================================

/**
 * Format date to Indonesian locale
 * @param {Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
    };

    return new Intl.DateTimeFormat('id-ID', { ...defaultOptions, ...options }).format(new Date(date));
};

/**
 * Format time to Indonesian locale
 * @param {Date|string} time - Time to format
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(new Date(time));
};

/**
 * Format date and time together
 * @param {Date|string} datetime - DateTime to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (datetime) => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(new Date(datetime));
};

/**
 * Get day name in Indonesian
 * @param {Date|string} date - Date to get day name from
 * @returns {string} Day name in Indonesian
 */
export const getDayName = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date(date).getDay()];
};

/**
 * Get month name in Indonesian
 * @param {Date|string} date - Date to get month name from
 * @returns {string} Month name in Indonesian
 */
export const getMonthName = (date) => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[new Date(date).getMonth()];
};

/**
 * Calculate age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} Age in years
 */
export const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

/**
 * Generate random string
 * @param {number} length - Length of random string
 * @param {string} chars - Characters to use
 * @returns {string} Random string
 */
export const generateRandomString = (length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Generate unique ID with prefix
 * @param {string} prefix - Prefix for the ID
 * @param {number} length - Length of random part
 * @returns {string} Unique ID
 */
export const generateUniqueId = (prefix = '', length = 8) => {
    const timestamp = Date.now().toString(36);
    const random = generateRandomString(length, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    return `${prefix}${timestamp}${random}`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indonesian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate NIM (Student ID) format
 * @param {string} nim - NIM to validate
 * @returns {boolean} True if valid NIM
 */
export const isValidNIM = (nim) => {
    // Assuming NIM format: 8-12 digits
    const nimRegex = /^[0-9]{8,12}$/;
    return nimRegex.test(nim);
};

/**
 * Validate NIP (Employee ID) format
 * @param {string} nip - NIP to validate
 * @returns {boolean} True if valid NIP
 */
export const isValidNIP = (nip) => {
    // Assuming NIP format: 18 digits (Indonesian government standard)
    const nipRegex = /^[0-9]{18}$/;
    return nipRegex.test(nip);
};

/**
 * Sanitize string for database storage
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/\s+/g, ' ');
};

/**
 * Calculate attendance percentage
 * @param {number} present - Number of present sessions
 * @param {number} total - Total number of sessions
 * @returns {number} Attendance percentage
 */
export const calculateAttendancePercentage = (present, total) => {
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
};

/**
 * Get attendance status color
 * @param {string} status - Attendance status
 * @returns {string} Color class or hex code
 */
export const getAttendanceStatusColor = (status) => {
    const colors = {
        'present': '#10B981', // green
        'late': '#F59E0B',    // yellow
        'absent': '#EF4444',  // red
        'excused': '#6B7280'  // gray
    };
    return colors[status] || '#6B7280';
};

/**
 * Get attendance status label in Indonesian
 * @param {string} status - Attendance status
 * @returns {string} Status label in Indonesian
 */
export const getAttendanceStatusLabel = (status) => {
    const labels = {
        'present': 'Hadir',
        'late': 'Terlambat',
        'absent': 'Tidak Hadir',
        'excused': 'Izin'
    };
    return labels[status] || 'Tidak Diketahui';
};

/**
 * Get user role label in Indonesian
 * @param {string} role - User role
 * @returns {string} Role label in Indonesian
 */
export const getUserRoleLabel = (role) => {
    const labels = {
        'super-admin': 'Super Admin',
        'lecturer': 'Dosen',
        'student': 'Mahasiswa'
    };
    return labels[role] || role;
};

/**
 * Parse query string parameters for pagination
 * @param {Object} query - Express query object
 * @returns {Object} Parsed pagination parameters
 */
export const parsePaginationParams = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const offset = (page - 1) * limit;

    return { page, limit, offset };
};

/**
 * Create pagination metadata
 * @param {number} total - Total number of records
 * @param {number} page - Current page
 * @param {number} limit - Records per page
 * @returns {Object} Pagination metadata
 */
export const createPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
    };
};

/**
 * Sleep function for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after specified time
 */
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
};

/**
 * Remove sensitive data from user object
 * @param {Object} user - User object
 * @returns {Object} User object without sensitive data
 */
export const sanitizeUserData = (user) => {
    const sanitized = deepClone(user);
    delete sanitized.password;
    delete sanitized.refresh_token;
    delete sanitized.reset_token;
    return sanitized;
};

/**
 * Convert file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
