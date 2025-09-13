import React, { useEffect, useState } from "react";
import { MdPeople, MdFace, MdAccessTime, MdMeetingRoom, MdRefresh, MdError } from "react-icons/md";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

// API Configuration
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true
});

// Safe imports with fallback
let StatisticsCard, AttendanceChart, RecentActivityTable, SystemStatusCard, AlertCard;

try {
    StatisticsCard = require("./components/StatisticsCard").default;
} catch {
    StatisticsCard = ({ title, value, icon, trend, color }) => (
        <div className="bg-white rounded-xl shadow-md p-5 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                    {trend && <p className="text-sm text-green-600">{trend}</p>}
                </div>
                <div className="text-blue-500">{icon}</div>
            </div>
        </div>
    );
}

try {
    AttendanceChart = require("./components/AttendanceChart").default;
} catch {
    AttendanceChart = ({ data }) => (
        <div className="h-full">
            {Array.isArray(data) && data.length > 0 ? (
                <div className="h-full flex flex-col">
                    <div className="flex-1 space-y-2">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="text-sm font-medium text-gray-700">{item.date}</div>
                                <div className="flex space-x-4 text-xs">
                                    <span className="text-green-600">Hadir: {item.hadir || 0}</span>
                                    <span className="text-yellow-600">Terlambat: {item.terlambat || 0}</span>
                                    <span className="text-red-600">Tidak Hadir: {item.tidak_hadir || 0}</span>
                                </div>
                                <div className="text-sm font-bold text-gray-800">Total: {item.total || 0}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">
                            Data absensi 7 hari terakhir dari database
                        </p>
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Memuat data chart...</p>
                </div>
            )}
        </div>
    );
}

try {
    RecentActivityTable = require("./components/RecentActivityTable").default;
} catch {
    RecentActivityTable = ({ data }) => (
        <div className="space-y-3">
            {Array.isArray(data) && data.length > 0 ? (
                data.slice(0, 5).map((activity, index) => (
                    <div key={activity.id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{activity.icon || '📝'}</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.description}</p>
                            <p className="text-xs text-gray-400">
                                {activity.timestamp ? 
                                    new Date(activity.timestamp).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 
                                    'Waktu tidak diketahui'
                                }
                            </p>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded-full ${
                            activity.status === 'present' ? 'bg-green-100 text-green-800' :
                            activity.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {activity.status}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-4 text-center text-gray-500">
                    Tidak ada aktivitas terbaru
                </div>
            )}
        </div>
    );
}

try {
    SystemStatusCard = require("./components/SystemStatusCard").default;
} catch {
    SystemStatusCard = ({ name, status, uptime, load }) => (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
                <p className="text-sm font-medium text-gray-800">{name}</p>
                <p className="text-xs text-gray-500">Uptime: {uptime}</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${status === 'online' ? 'bg-green-100 text-green-800' :
                        status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                    }`}>
                    {status}
                </span>
                <span className="text-xs text-gray-500">{load}</span>
            </div>
        </div>
    );
}

try {
    AlertCard = require("./components/AlertCard").default;
} catch {
    AlertCard = ({ type, message, time }) => (
        <div className={`p-3 rounded-lg border-l-4 ${type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                type === 'error' ? 'bg-red-50 border-red-400' :
                    'bg-blue-50 border-blue-400'
            }`}>
            <p className="text-sm font-medium text-gray-800">{message}</p>
            <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
    );
}

const SuperAdminDashboard = () => {
    // State management for real data
    const [statistics, setStatistics] = useState({
        totalStudents: 0,
        todayAttendance: 0,
        totalFaceDatasets: 0,
        roomAccess: 0,
        trends: {
            students: 0,
            attendance: 0,
            datasets: 0,
            access: 0
        }
    });
    
    const [recentActivities, setRecentActivities] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [systemStatus, setSystemStatus] = useState([]);
    const [attendanceChart, setAttendanceChart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
        
        // Load initial dashboard data
        loadDashboardData();
        
        // Set up auto-refresh every 5 minutes
        const refreshInterval = setInterval(loadDashboardData, 5 * 60 * 1000);
        
        return () => clearInterval(refreshInterval);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Load all dashboard data concurrently
            await Promise.all([
                fetchStatistics(),
                fetchRecentActivities(),
                fetchAlerts(),
                fetchSystemStatus(),
                fetchAttendanceChart()
            ]);
            
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setError('Gagal memuat data dashboard: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/api/dashboard/statistics');
            if (response.data.success) {
                setStatistics(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    };

    const fetchRecentActivities = async () => {
        try {
            const response = await api.get('/api/dashboard/activities');
            if (response.data.success) {
                setRecentActivities(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    };

    const fetchAlerts = async () => {
        try {
            const response = await api.get('/api/dashboard/alerts');
            if (response.data.success) {
                setAlerts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
            throw error;
        }
    };

    const fetchSystemStatus = async () => {
        try {
            const response = await api.get('/api/dashboard/system-status');
            if (response.data.success) {
                setSystemStatus(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching system status:', error);
            throw error;
        }
    };

    const fetchAttendanceChart = async () => {
        try {
            const response = await api.get('/api/dashboard/attendance-chart');
            if (response.data.success) {
                setAttendanceChart(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching attendance chart:', error);
            throw error;
        }
    };

    const handleRefresh = () => {
        loadDashboardData();
    };

    const formatTrend = (value) => {
        if (value > 0) return `+${value}%`;
        if (value < 0) return `${value}%`;
        return '0%';
    };

    const getTrendColor = (value) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    // Prepare statistics for display
    const statsData = [
        { 
            title: "Total Mahasiswa", 
            value: statistics.totalStudents?.toLocaleString() || "0", 
            icon: <MdPeople className="h-6 w-6" />, 
            trend: formatTrend(statistics.trends?.students || 0), 
            color: "blue" 
        },
        { 
            title: "Absensi Hari Ini", 
            value: statistics.todayAttendance?.toLocaleString() || "0", 
            icon: <MdAccessTime className="h-6 w-6" />, 
            trend: formatTrend(statistics.trends?.attendance || 0), 
            color: "green" 
        },
        { 
            title: "Dataset Wajah", 
            value: statistics.totalFaceDatasets?.toLocaleString() || "0", 
            icon: <MdFace className="h-6 w-6" />, 
            trend: formatTrend(statistics.trends?.datasets || 0), 
            color: "purple" 
        },
        { 
            title: "Akses Ruangan", 
            value: statistics.roomAccess?.toLocaleString() || "0", 
            icon: <MdMeetingRoom className="h-6 w-6" />, 
            trend: formatTrend(statistics.trends?.access || 0), 
            color: "red" 
        }
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-600">Selamat datang di Super Admin Dashboard</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-xs text-green-600 font-medium">
                                Data real-time dari database MySQL
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-500">
                            Terakhir diperbarui: {lastRefresh.toLocaleTimeString('id-ID')}
                        </p>
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <MdRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" data-aos="fade-in">
                    <div className="flex items-center space-x-2">
                        <MdError className="h-5 w-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && !error && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg" data-aos="fade-in">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <p className="text-blue-800">Memuat data dashboard...</p>
                    </div>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                    <div key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
                        <StatisticsCard
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            trend={stat.trend}
                            color={stat.color}
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Attendance Chart */}
                <div className="lg:col-span-2" data-aos="fade-right">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistik Absensi Mingguan</h2>
                        <div className="h-80">
                            {attendanceChart.length > 0 ? (
                                <AttendanceChart data={attendanceChart} />
                            ) : (
                                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">
                                        {loading ? 'Memuat data chart...' : 'Tidak ada data chart'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alert Cards */}
                <div data-aos="fade-left">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifikasi Terbaru</h2>
                        <div className="space-y-4">
                            {Array.isArray(alerts) && alerts.length > 0 ? (
                                <>
                                    {alerts.slice(0, 3).map((alert, index) => (
                                        <AlertCard 
                                            key={index} 
                                            type={alert.type} 
                                            message={alert.message} 
                                            time={alert.time} 
                                        />
                                    ))}
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 mt-2">
                                        Lihat semua notifikasi ({alerts.length})
                                    </button>
                                </>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    {loading ? 'Memuat notifikasi...' : 'Tidak ada notifikasi'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2" data-aos="fade-up">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
                        {Array.isArray(recentActivities) && recentActivities.length > 0 ? (
                            <RecentActivityTable data={recentActivities} />
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                {loading ? 'Memuat aktivitas...' : 'Tidak ada aktivitas terbaru'}
                            </div>
                        )}
                    </div>
                </div>

                {/* System Status */}
                <div data-aos="fade-up" data-aos-delay="200">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Sistem</h2>
                        <div className="space-y-3">
                            {Array.isArray(systemStatus) && systemStatus.length > 0 ? (
                                systemStatus.map((system, index) => (
                                    <SystemStatusCard
                                        key={index}
                                        name={system.name}
                                        status={system.status}
                                        uptime={system.uptime}
                                        load={system.load}
                                    />
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    {loading ? 'Memuat status sistem...' : 'Data status sistem tidak tersedia'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div data-aos="fade-up" data-aos-delay="300">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Akses Cepat</h2>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="text-xs text-blue-600">Semua data dari backend database</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Tambah Mahasiswa', 'Upload Dataset', 'Laporan Absensi', 'Pengaturan Sistem'].map((item, index) => (
                            <button
                                key={index}
                                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 p-4 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center"
                            >
                                <span className="text-sm font-medium text-gray-800">{item}</span>
                            </button>
                        ))}
                    </div>
                    
                    {/* Data Summary */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                        <h3 className="font-semibold text-gray-800 mb-2">Ringkasan Data Real-time</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Total Mahasiswa</p>
                                <p className="font-bold text-blue-600">{statistics.totalStudents}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Absensi Hari Ini</p>
                                <p className="font-bold text-green-600">{statistics.todayAttendance}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Dataset Wajah</p>
                                <p className="font-bold text-purple-600">{statistics.totalFaceDatasets}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Aktivitas Terbaru</p>
                                <p className="font-bold text-orange-600">{recentActivities.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
