import React, { useEffect } from "react";
import { MdPeople, MdFace, MdAccessTime, MdMeetingRoom } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

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
    AttendanceChart = () => (
        <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart will be loaded here</p>
        </div>
    );
}

try {
    RecentActivityTable = require("./components/RecentActivityTable").default;
} catch {
    RecentActivityTable = () => (
        <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-blue-500">📝</div>
                <div>
                    <p className="text-sm font-medium">Login berhasil - Admin Sistem</p>
                    <p className="text-xs text-gray-500">15 menit yang lalu</p>
                </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-green-500">👤</div>
                <div>
                    <p className="text-sm font-medium">Dataset wajah ditambahkan</p>
                    <p className="text-xs text-gray-500">32 menit yang lalu</p>
                </div>
            </div>
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

const dummyStats = [
    { title: "Total Mahasiswa", value: "1,257", icon: <MdPeople className="h-6 w-6" />, trend: "+2.5%", color: "blue" },
    { title: "Absensi Hari Ini", value: "438", icon: <MdAccessTime className="h-6 w-6" />, trend: "+12.3%", color: "green" },
    { title: "Dataset Wajah", value: "1,180", icon: <MdFace className="h-6 w-6" />, trend: "+5.7%", color: "purple" },
    { title: "Akses Ruangan", value: "24", icon: <MdMeetingRoom className="h-6 w-6" />, trend: "-3.2%", color: "red" }
];

const dummyAlerts = [
    { type: "warning", message: "5 mahasiswa belum memiliki dataset wajah yang lengkap", time: "13 menit yang lalu" },
    { type: "error", message: "Kegagalan otentikasi terdeteksi di Ruang 2.01", time: "32 menit yang lalu" },
    { type: "info", message: "Pembaruan sistem dijadwalkan pada 15 Mei 2025", time: "2 jam yang lalu" }
];

const dummySystemStatus = [
    { name: "Face Recognition Service", status: "online", uptime: "99.8%", load: "32%" },
    { name: "Database Server", status: "online", uptime: "100%", load: "45%" },
    { name: "Door Access System", status: "online", uptime: "98.3%", load: "21%" },
    { name: "Backup Service", status: "warning", uptime: "95.4%", load: "67%" }
];

const SuperAdminDashboard = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Selamat datang di Super Admin Dashboard</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dummyStats.map((stat, index) => (
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
                            <AttendanceChart />
                        </div>
                    </div>
                </div>

                {/* Alert Cards */}
                <div data-aos="fade-left">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifikasi Terbaru</h2>
                        <div className="space-y-4">
                            {dummyAlerts.map((alert, index) => (
                                <AlertCard key={index} type={alert.type} message={alert.message} time={alert.time} />
                            ))}
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 mt-2">
                                Lihat semua notifikasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2" data-aos="fade-up">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
                        <RecentActivityTable />
                    </div>
                </div>

                {/* System Status */}
                <div data-aos="fade-up" data-aos-delay="200">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Sistem</h2>
                        <div className="space-y-3">
                            {dummySystemStatus.map((system, index) => (
                                <SystemStatusCard
                                    key={index}
                                    name={system.name}
                                    status={system.status}
                                    uptime={system.uptime}
                                    load={system.load}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div data-aos="fade-up" data-aos-delay="300">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Akses Cepat</h2>
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
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
