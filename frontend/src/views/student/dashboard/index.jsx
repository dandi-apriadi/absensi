import React, { useState } from "react";
import { MdTrendingUp, MdTrendingDown, MdBarChart, MdShowChart, MdCalendarToday, MdAccessTime, MdPeople, MdSchool } from "react-icons/md";

const AttendanceStats = ({ data = {} }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    // Enhanced dummy data with more realistic values
    const attendanceData = {
        attended: 42,
        totalClasses: 48,
        percentage: 87.5,
        absent: 4,
        late: 2,
        onTime: 40,
        ...data
    };

    // Extended weekly data with more details
    const weeklyData = [
        {
            day: 'Sen',
            attended: 4,
            total: 4,
            courses: ['Algoritma', 'Database', 'Web Dev', 'Mobile'],
            avgTime: '08:15',
            status: 'excellent'
        },
        {
            day: 'Sel',
            attended: 3,
            total: 4,
            courses: ['Jaringan', 'Software Eng', 'UI/UX'],
            avgTime: '09:30',
            status: 'good'
        },
        {
            day: 'Rab',
            attended: 4,
            total: 4,
            courses: ['Data Mining', 'AI', 'Machine Learning', 'Statistics'],
            avgTime: '08:00',
            status: 'excellent'
        },
        {
            day: 'Kam',
            attended: 2,
            total: 3,
            courses: ['Cloud Computing', 'DevOps'],
            avgTime: '10:45',
            status: 'warning'
        },
        {
            day: 'Jum',
            attended: 3,
            total: 3,
            courses: ['Cyber Security', 'Blockchain', 'IoT'],
            avgTime: '08:30',
            status: 'good'
        },
        {
            day: 'Sab',
            attended: 2,
            total: 2,
            courses: ['Seminar', 'Workshop'],
            avgTime: '09:00',
            status: 'excellent'
        }
    ];

    // Monthly comparison data
    const monthlyData = [
        { month: 'Jan', percentage: 82, classes: 45 },
        { month: 'Feb', percentage: 88, classes: 42 },
        { month: 'Mar', percentage: 85, classes: 48 },
        { month: 'Apr', percentage: 90, classes: 44 },
        { month: 'Mei', percentage: 87, classes: 46 },
        { month: 'Jun', percentage: 89, classes: 40 }
    ];

    // Course-wise attendance
    const courseAttendance = [
        { course: 'Algoritma & Pemrograman', attended: 12, total: 14, percentage: 86 },
        { course: 'Database Systems', attended: 10, total: 12, percentage: 83 },
        { course: 'Web Development', attended: 15, total: 16, percentage: 94 },
        { course: 'Mobile Development', attended: 8, total: 10, percentage: 80 },
        { course: 'Software Engineering', attended: 11, total: 12, percentage: 92 }
    ];    // Time-based analysis
    const timeAnalysis = {
        morning: { attended: 28, total: 32, percentage: 87.5 },
        afternoon: { attended: 14, total: 16, percentage: 87.5 }
    };

    return (<div className="w-full space-y-6 pb-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <MdBarChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Statistik Kehadiran</h1>
                        <p className="text-blue-100 text-base">Analisis kehadiran semester ini</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Period Selector */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-1">
                        {['week', 'month'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${selectedPeriod === period
                                    ? 'bg-white text-blue-600 shadow-lg'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                {period === 'week' ? 'Mingguan' : 'Bulanan'}
                            </button>
                        ))}
                    </div>

                    {/* Trend Indicator */}
                    <div className="bg-green-500 rounded-xl px-4 py-2 shadow-lg">
                        <div className="flex items-center text-white">
                            <MdTrendingUp className="h-4 w-4 mr-2" />
                            <span className="text-sm font-bold">+8.5%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Kehadiran</h2>
                <p className="text-gray-600">Ringkasan performa kehadiran Anda</p>
            </div>                {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Overall Stats Circle */}
                <div className="xl:col-span-1">
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
                        <div className="text-center">
                            {/* Enhanced Circular Progress */}
                            <div className="relative w-40 h-40 mx-auto mb-6">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    {/* Background Circle */}
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#e2e8f0"
                                        strokeWidth="3"
                                    />
                                    {/* Progress Circle */}
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={`${attendanceData.percentage}, 100`}
                                        className="transition-all duration-1000 ease-out drop-shadow-sm"
                                    />
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="50%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            {attendanceData.percentage}%
                                        </span>
                                        <p className="text-sm font-semibold text-gray-700 mt-1">Kehadiran Overall</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {attendanceData.attended} dari {attendanceData.totalClasses} kelas
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="bg-green-100 p-2 rounded-lg w-fit mx-auto mb-3">
                                        <MdSchool className="h-5 w-5 text-green-600" />
                                    </div>
                                    <p className="text-xl font-bold text-green-600 mb-1">{attendanceData.onTime}</p>
                                    <p className="text-sm text-gray-600 font-medium">Tepat Waktu</p>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="bg-amber-100 p-2 rounded-lg w-fit mx-auto mb-3">
                                        <MdAccessTime className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <p className="text-xl font-bold text-amber-600 mb-1">{attendanceData.late}</p>
                                    <p className="text-sm text-gray-600 font-medium">Terlambat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>{/* Weekly/Monthly Chart */}
                <div className="xl:col-span-2">
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-8 border border-purple-100 shadow-sm">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-md">
                                    <MdShowChart className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {selectedPeriod === 'week' ? 'Tren Mingguan' : 'Progress Bulanan'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Visualisasi performa kehadiran</p>
                                </div>
                            </div>
                            <div className="text-center lg:text-right">
                                <p className="text-sm text-gray-600 mb-2">Rata-rata Kehadiran</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {selectedPeriod === 'week'
                                        ? Math.round(weeklyData.reduce((acc, day) => acc + (day.attended / day.total), 0) / weeklyData.length * 100)
                                        : Math.round(monthlyData.reduce((acc, month) => acc + month.percentage, 0) / monthlyData.length)
                                    }%
                                </p>
                                <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto lg:mx-0 mt-3"></div>
                            </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                            <div className="flex items-end justify-between h-60 mb-6">
                                {(selectedPeriod === 'week' ? weeklyData : monthlyData).map((item, index) => {
                                    const percentage = selectedPeriod === 'week'
                                        ? (item.attended / item.total) * 100
                                        : item.percentage;
                                    const label = selectedPeriod === 'week' ? item.day : item.month;

                                    return (
                                        <div key={index} className="flex flex-col items-center group">
                                            <div
                                                className="relative bg-gray-200 rounded-t-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                                                style={{
                                                    height: '200px',
                                                    width: selectedPeriod === 'week' ? '36px' : '32px'
                                                }}
                                            >
                                                <div
                                                    className={`absolute bottom-0 w-full rounded-t-2xl transition-all duration-1000 ease-out ${percentage >= 90 ? 'bg-gradient-to-t from-green-500 via-emerald-400 to-green-300' :
                                                        percentage >= 75 ? 'bg-gradient-to-t from-blue-500 via-cyan-400 to-blue-300' :
                                                            percentage >= 60 ? 'bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-300' :
                                                                'bg-gradient-to-t from-red-500 via-pink-400 to-red-300'
                                                        }`}
                                                    style={{ height: `${Math.max(percentage, 10)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 mt-4">{label}</span>
                                            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm mt-2">
                                                {Math.round(percentage)}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>            {/* Analytics Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course-wise Attendance */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-md">
                        <MdPeople className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Kehadiran per Mata Kuliah</h3>
                        <p className="text-sm text-gray-600 mt-1">Analisis detail setiap mata kuliah</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {courseAttendance.map((course, index) => (
                        <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-bold text-gray-900 text-base flex-1 leading-tight">
                                    {course.course}
                                </h4>
                                <span className="text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm ml-4 whitespace-nowrap">
                                    {course.attended}/{course.total}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                                <div
                                    className={`h-4 rounded-full transition-all duration-1000 ease-out ${course.percentage >= 90 ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-400' :
                                        course.percentage >= 80 ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400' :
                                            course.percentage >= 70 ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400' :
                                                'bg-gradient-to-r from-red-500 via-pink-400 to-red-400'
                                        }`}
                                    style={{ width: `${course.percentage}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-lg font-bold ${course.percentage >= 80 ? 'text-green-600' :
                                    course.percentage >= 70 ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                    {course.percentage}%
                                </span>
                                <span className={`text-sm px-4 py-2 rounded-full font-bold shadow-sm ${course.percentage >= 90 ? 'bg-green-100 text-green-800' :
                                    course.percentage >= 80 ? 'bg-blue-100 text-blue-800' :
                                        course.percentage >= 70 ? 'bg-amber-100 text-amber-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {course.percentage >= 90 ? 'Excellent' :
                                        course.percentage >= 80 ? 'Good' :
                                            course.percentage >= 70 ? 'Fair' : 'Poor'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>                {/* Time Analysis & Smart Insights */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-2xl shadow-md">
                        <MdCalendarToday className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Analisis Waktu & Insights</h3>
                        <p className="text-sm text-gray-600 mt-1">Pola kehadiran dan rekomendasi</p>
                    </div>
                </div>

                {/* Time-based Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-md">
                                <MdAccessTime className="h-7 w-7 text-white" />
                            </div>
                            <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                                {timeAnalysis.morning.percentage}%
                            </p>
                            <p className="text-base font-bold text-gray-700 mb-2">Sesi Pagi</p>
                            <p className="text-sm text-gray-500 bg-white px-3 py-2 rounded-full shadow-sm">
                                {timeAnalysis.morning.attended}/{timeAnalysis.morning.total} kelas
                            </p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-md">
                                <MdAccessTime className="h-7 w-7 text-white" />
                            </div>
                            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                                {timeAnalysis.afternoon.percentage}%
                            </p>
                            <p className="text-base font-bold text-gray-700 mb-2">Sesi Siang</p>
                            <p className="text-sm text-gray-500 bg-white px-3 py-2 rounded-full shadow-sm">
                                {timeAnalysis.afternoon.attended}/{timeAnalysis.afternoon.total} kelas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Smart Insights */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="text-2xl">💡</span>
                        <h4 className="text-lg font-bold text-gray-900">Smart Insights</h4>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start space-x-4">
                            <div className="bg-green-500 rounded-full p-3 flex-shrink-0 shadow-md">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-base font-bold text-green-800 mb-2">🎯 Target Tercapai!</p>
                                <p className="text-sm text-green-700">Kehadiran {attendanceData.percentage}% melampaui target 85%. Pertahankan konsistensi ini!</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-500 rounded-full p-3 flex-shrink-0 shadow-md">
                                <MdTrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-base font-bold text-blue-800 mb-2">📈 Tren Positif</p>
                                <p className="text-sm text-blue-700">Kehadiran meningkat 8.5% dalam sebulan terakhir. Momentum yang bagus!</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border-l-4 border-amber-500 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start space-x-4">
                            <div className="bg-amber-500 rounded-full p-3 flex-shrink-0 shadow-md">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-base font-bold text-amber-800 mb-2">⚠️ Area Perhatian</p>
                                <p className="text-sm text-amber-700">Kehadiran hari Kamis perlu ditingkatkan (67%). Fokuskan perhatian di hari ini.</p>
                            </div>
                        </div>
                    </div>                    </div>                </div>
        </div>
    </div>
    );
};

export default AttendanceStats;
