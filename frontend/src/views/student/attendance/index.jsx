import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdTrendingUp, MdCalendarToday, MdFileDownload, MdVisibility } from "react-icons/md";
import AttendanceHistory from "./components/AttendanceHistory";
import AttendanceReport from "./components/AttendanceReport";

const MyAttendance = () => {
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const attendanceData = {
        totalClasses: 52,
        attended: 45,
        absent: 5,
        late: 2,
        percentage: 86.5,
        currentStreak: 8,
        monthlyData: [
            { month: 'Jan', percentage: 85 },
            { month: 'Feb', percentage: 88 },
            { month: 'Mar', percentage: 90 },
            { month: 'Apr', percentage: 82 },
            { month: 'May', percentage: 87 }
        ]
    };

    const recentAttendance = [
        { date: '2024-01-25', course: 'Pemrograman Web', status: 'present', time: '08:15' },
        { date: '2024-01-24', course: 'Database', status: 'present', time: '10:05' },
        { date: '2024-01-23', course: 'Mobile Dev', status: 'late', time: '13:10' },
        { date: '2024-01-22', course: 'Machine Learning', status: 'present', time: '08:30' },
        { date: '2024-01-21', course: 'Software Eng', status: 'absent', time: '-' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'present': return 'Hadir';
            case 'absent': return 'Tidak Hadir';
            case 'late': return 'Terlambat';
            default: return 'Unknown';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Kehadiran Saya
                </h1>
                <p className="text-gray-600">
                    Pantau riwayat dan statistik kehadiran Anda
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { id: 'overview', label: 'Ringkasan' },
                        { id: 'history', label: 'Riwayat' },
                        { id: 'report', label: 'Laporan' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Total Hadir</p>
                                        <p className="text-3xl font-bold">{attendanceData.attended}</p>
                                    </div>
                                    <MdTrendingUp className="h-8 w-8 opacity-80" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Persentase</p>
                                        <p className="text-3xl font-bold">{attendanceData.percentage}%</p>
                                    </div>
                                    <MdCalendarToday className="h-8 w-8 opacity-80" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Terlambat</p>
                                        <p className="text-3xl font-bold">{attendanceData.late}</p>
                                    </div>
                                    <MdCalendarToday className="h-8 w-8 opacity-80" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Streak Hari Ini</p>
                                        <p className="text-3xl font-bold">{attendanceData.currentStreak}</p>
                                    </div>
                                    <MdTrendingUp className="h-8 w-8 opacity-80" />
                                </div>
                            </div>
                        </div>

                        {/* Charts and Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Monthly Trend */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tren Bulanan</h3>
                                <div className="space-y-4">
                                    {attendanceData.monthlyData.map((month, index) => (
                                        <div key={index} className="flex items-center">
                                            <span className="w-12 text-sm font-medium text-gray-600">{month.month}</span>
                                            <div className="flex-1 mx-4">
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                                                        style={{ width: `${month.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-800">{month.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Attendance */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Kehadiran Terakhir</h3>
                                <div className="space-y-3">
                                    {recentAttendance.map((attendance, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">{attendance.course}</p>
                                                <p className="text-sm text-gray-600">{attendance.date} - {attendance.time}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}>
                                                {getStatusText(attendance.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && <AttendanceHistory />}
                {activeTab === 'report' && <AttendanceReport />}
            </div>
        </div>
    );
};

export default MyAttendance;
