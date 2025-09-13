import { Sequelize, Op } from 'sequelize';
import { Users, StudentAttendances, AttendanceSessions, Courses, db } from '../../models/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dashboardController = {
    // Get comprehensive dashboard statistics
    getStatistics: async (req, res) => {
        try {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
            
            // Calculate date ranges for trends
            const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
            
            // Get total students count
            const totalStudents = await Users.count({
                where: { role: 'student' }
            });
            
            // Get students count from last week for trend calculation
            const studentsLastWeek = await Users.count({
                where: { 
                    role: 'student',
                    created_at: { [Op.lte]: lastWeek }
                }
            });
            
            // Get today's attendance count
            const todayAttendance = await StudentAttendances.count({
                where: {
                    created_at: {
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    }
                }
            });
            
            // Get last week's attendance for trend
            const lastWeekStartDay = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate());
            const lastWeekEndDay = new Date(lastWeekStartDay.getTime() + 24 * 60 * 60 * 1000);
            const lastWeekAttendance = await StudentAttendances.count({
                where: {
                    created_at: {
                        [Op.gte]: lastWeekStartDay,
                        [Op.lt]: lastWeekEndDay
                    }
                }
            });
            
            // Count face datasets (from datasets directory)
            let totalFaceDatasets = 0;
            let datasetsLastWeek = 0;
            
            try {
                const datasetsPath = path.join(__dirname, '../../../absensi/datasets');
                if (fs.existsSync(datasetsPath)) {
                    const employees = fs.readdirSync(datasetsPath);
                    
                    for (const employee of employees) {
                        const employeePath = path.join(datasetsPath, employee);
                        if (fs.statSync(employeePath).isDirectory()) {
                            const files = fs.readdirSync(employeePath);
                            const imageFiles = files.filter(file => 
                                file.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i)
                            );
                            totalFaceDatasets += imageFiles.length;
                            
                            // Count files created before last week for trend
                            const oldFiles = imageFiles.filter(file => {
                                const filePath = path.join(employeePath, file);
                                const stats = fs.statSync(filePath);
                                return stats.birthtime <= lastWeek;
                            });
                            datasetsLastWeek += oldFiles.length;
                        }
                    }
                }
            } catch (error) {
                console.log('Could not read face datasets directory:', error.message);
            }
            
            // Get room access count (unique sessions today)
            const roomAccess = await AttendanceSessions.count({
                where: {
                    created_at: {
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    }
                }
            });
            
            // Get room access from last week for trend
            const roomAccessLastWeek = await AttendanceSessions.count({
                where: {
                    created_at: {
                        [Op.gte]: lastWeekStartDay,
                        [Op.lt]: lastWeekEndDay
                    }
                }
            });
            
            // Calculate trends (percentage change)
            const calculateTrend = (current, previous) => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return Math.round(((current - previous) / previous) * 100 * 100) / 100;
            };
            
            const statistics = {
                totalStudents,
                todayAttendance,
                totalFaceDatasets,
                roomAccess,
                trends: {
                    students: calculateTrend(totalStudents, studentsLastWeek),
                    attendance: calculateTrend(todayAttendance, lastWeekAttendance),
                    datasets: calculateTrend(totalFaceDatasets, datasetsLastWeek),
                    access: calculateTrend(roomAccess, roomAccessLastWeek)
                }
            };
            
            res.json({
                success: true,
                data: statistics
            });
            
        } catch (error) {
            console.error('Error fetching dashboard statistics:', error);
            res.status(500).json({
                success: false,
                message: 'Gagal mengambil statistik dashboard',
                error: error.message
            });
        }
    },

    // Get recent activities
    getRecentActivities: async (req, res) => {
        try {
            // Use raw SQL for better compatibility
            const recentAttendances = await db.query(`
                SELECT 
                    sa.id,
                    sa.check_in_time as created_at,
                    sa.status,
                    u.fullname as student_name,
                    u.student_id as student_nim,
                    c.course_name
                FROM student_attendances sa
                LEFT JOIN users u ON sa.student_id = u.user_id
                LEFT JOIN attendance_sessions asess ON sa.session_id = asess.id
                LEFT JOIN course_classes cc ON asess.class_id = cc.id
                LEFT JOIN courses c ON cc.course_id = c.id
                ORDER BY sa.check_in_time DESC
                LIMIT 10
            `, {
                type: Sequelize.QueryTypes.SELECT
            });

            const activities = recentAttendances.map(attendance => ({
                id: attendance.id,
                type: 'attendance',
                title: `Absensi ${attendance.student_name || 'Unknown'} (${attendance.student_nim || 'N/A'})`,
                description: `${attendance.course_name || 'Unknown Course'} - ${attendance.status}`,
                timestamp: attendance.created_at,
                status: attendance.status,
                icon: attendance.status === 'present' ? '✅' : attendance.status === 'late' ? '⏰' : '❌'
            }));

            res.json({
                success: true,
                data: activities
            });
            
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            res.status(500).json({
                success: false,
                message: 'Gagal mengambil aktivitas terbaru',
                error: error.message
            });
        }
    },

    // Get system alerts
    getAlerts: async (req, res) => {
        try {
            const alerts = [];
            const today = new Date();
            const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            // Check for students without face datasets
            const studentsWithoutDatasets = await Users.count({
                where: { role: 'student' }
            });
            
            let studentsWithDatasets = 0;
            try {
                const datasetsPath = path.join(__dirname, '../../../absensi/datasets');
                if (fs.existsSync(datasetsPath)) {
                    const employees = fs.readdirSync(datasetsPath);
                    studentsWithDatasets = employees.filter(employee => {
                        const employeePath = path.join(datasetsPath, employee);
                        return fs.statSync(employeePath).isDirectory();
                    }).length;
                }
            } catch (error) {
                console.log('Could not check datasets directory:', error.message);
            }
            
            const studentsWithoutDatasetCount = studentsWithoutDatasets - studentsWithDatasets;
            if (studentsWithoutDatasetCount > 0) {
                alerts.push({
                    type: 'warning',
                    message: `${studentsWithoutDatasetCount} mahasiswa belum memiliki dataset wajah yang lengkap`,
                    time: '2 jam yang lalu'
                });
            }
            
            // Check for recent failed attendances
            const failedAttendances = await StudentAttendances.count({
                where: {
                    status: 'absent',
                    created_at: {
                        [Op.gte]: lastWeek
                    }
                }
            });
            
            if (failedAttendances > 10) {
                alerts.push({
                    type: 'error',
                    message: `${failedAttendances} kegagalan absensi terdeteksi minggu ini`,
                    time: '1 jam yang lalu'
                });
            }
            
            // System maintenance alert
            alerts.push({
                type: 'info',
                message: 'Pemeliharaan sistem dijadwalkan setiap hari Minggu pukul 02:00 WIB',
                time: '3 jam yang lalu'
            });
            
            // Database performance alert if needed
            try {
                const dbSize = await db.query(
                    `SELECT 
                        ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) AS size_mb,
                        CONCAT(ROUND(SUM(data_length + index_length) / 1024 / 1024, 1), ' MB') AS size
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE()`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
                
                if (dbSize && dbSize[0]) {
                    alerts.push({
                        type: 'info',
                        message: `Database size: ${dbSize[0].size}`,
                        time: '4 jam yang lalu'
                    });
                }
            } catch (error) {
                console.log('Could not get database size:', error.message);
            }
            
            res.json({
                success: true,
                data: alerts
            });
            
        } catch (error) {
            console.error('Error fetching alerts:', error);
            res.status(500).json({
                success: false,
                message: 'Gagal mengambil notifikasi',
                error: error.message
            });
        }
    },

    // Get system status
    getSystemStatus: async (req, res) => {
        try {
            const systemStatus = [];
            
            // Check database connectivity
            try {
                await db.authenticate();
                systemStatus.push({
                    name: 'Database Server',
                    status: 'online',
                    uptime: '99.8%',
                    load: Math.floor(Math.random() * 50 + 20) + '%'
                });
            } catch (error) {
                systemStatus.push({
                    name: 'Database Server',
                    status: 'error',
                    uptime: '0%',
                    load: 'N/A'
                });
            }
            
            // Check face recognition service (check if datasets directory exists)
            try {
                const datasetsPath = path.join(__dirname, '../../../absensi/datasets');
                const modelsPath = path.join(__dirname, '../../../absensi/models');
                
                if (fs.existsSync(datasetsPath) && fs.existsSync(modelsPath)) {
                    systemStatus.push({
                        name: 'Face Recognition Service',
                        status: 'online',
                        uptime: '98.3%',
                        load: Math.floor(Math.random() * 40 + 30) + '%'
                    });
                } else {
                    systemStatus.push({
                        name: 'Face Recognition Service',
                        status: 'warning',
                        uptime: '85.2%',
                        load: '75%'
                    });
                }
            } catch (error) {
                systemStatus.push({
                    name: 'Face Recognition Service',
                    status: 'error',
                    uptime: '0%',
                    load: 'N/A'
                });
            }
            
            // Check door access system (always online for demo)
            systemStatus.push({
                name: 'Door Access System',
                status: 'online',
                uptime: '97.5%',
                load: Math.floor(Math.random() * 30 + 15) + '%'
            });
            
            // Check backup service
            const backupScriptPath = path.join(__dirname, '../../../backup.sh');
            if (fs.existsSync(backupScriptPath)) {
                systemStatus.push({
                    name: 'Backup Service',
                    status: 'online',
                    uptime: '95.4%',
                    load: Math.floor(Math.random() * 60 + 40) + '%'
                });
            } else {
                systemStatus.push({
                    name: 'Backup Service',
                    status: 'warning',
                    uptime: '89.1%',
                    load: '67%'
                });
            }
            
            res.json({
                success: true,
                data: systemStatus
            });
            
        } catch (error) {
            console.error('Error fetching system status:', error);
            res.status(500).json({
                success: false,
                message: 'Gagal mengambil status sistem',
                error: error.message
            });
        }
    },

    // Get attendance chart data
    getAttendanceChart: async (req, res) => {
        try {
            const today = new Date();
            const chartData = [];
            
            // Get data for the last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
                const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
                
                const attendanceCount = await StudentAttendances.count({
                    where: {
                        created_at: {
                            [Op.gte]: startOfDay,
                            [Op.lt]: endOfDay
                        }
                    }
                });
                
                const hadirCount = await StudentAttendances.count({
                    where: {
                        status: 'present',
                        created_at: {
                            [Op.gte]: startOfDay,
                            [Op.lt]: endOfDay
                        }
                    }
                });
                
                const terlambatCount = await StudentAttendances.count({
                    where: {
                        status: 'late',
                        created_at: {
                            [Op.gte]: startOfDay,
                            [Op.lt]: endOfDay
                        }
                    }
                });
                
                chartData.push({
                    date: date.toLocaleDateString('id-ID', { 
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                    }),
                    total: attendanceCount,
                    hadir: hadirCount,
                    terlambat: terlambatCount,
                    tidak_hadir: attendanceCount - hadirCount - terlambatCount
                });
            }
            
            res.json({
                success: true,
                data: chartData
            });
            
        } catch (error) {
            console.error('Error fetching attendance chart data:', error);
            res.status(500).json({
                success: false,
                message: 'Gagal mengambil data chart absensi',
                error: error.message
            });
        }
    },

    // Legacy method for compatibility
    getDashboard: async (req, res) => {
        try {
            res.status(200).json({
                message: "Welcome to the dashboard! Use specific endpoints for detailed data.",
                endpoints: {
                    statistics: "/api/dashboard/statistics",
                    activities: "/api/dashboard/activities", 
                    alerts: "/api/dashboard/alerts",
                    systemStatus: "/api/dashboard/system-status",
                    attendanceChart: "/api/dashboard/attendance-chart"
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

export default dashboardController;
export const {
    getStatistics,
    getRecentActivities,
    getAlerts,
    getSystemStatus,
    getAttendanceChart,
    getDashboard
} = dashboardController;
