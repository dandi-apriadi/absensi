import React, { useState } from "react";
import {
    MdChevronLeft,
    MdChevronRight,
    MdCalendarToday,
    MdTrendingUp,
    MdAccessTime,
    MdCheckCircle,
    MdCancel,
    MdWarning,
    MdInfo,
    MdInsights,
    MdDateRange,
    MdLocalFireDepartment,
    MdSchool,
    MdTimeline,
    MdAnalytics,
    MdStars,
    MdClose,
    MdVisibility,
    MdCompare,
    MdAutoGraph
} from "react-icons/md";

const AttendanceCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [viewMode, setViewMode] = useState('month'); // month, analytics, subjects
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [selectedDayDetails, setSelectedDayDetails] = useState(null);

    // Comprehensive dummy attendance data with time details
    const attendanceData = {
        // Juni 2025 (current month)
        '2025-06-02': { status: 'present', checkIn: '07:45', checkOut: '16:30', subject: 'Matematika' },
        '2025-06-03': { status: 'present', checkIn: '07:50', checkOut: '16:25', subject: 'Fisika' },
        '2025-06-04': { status: 'late', checkIn: '08:15', checkOut: '16:30', subject: 'Kimia' },
        '2025-06-05': { status: 'present', checkIn: '07:40', checkOut: '16:35', subject: 'Biologi' },
        '2025-06-06': { status: 'present', checkIn: '07:45', checkOut: '16:20', subject: 'Bahasa Indonesia' },
        '2025-06-09': { status: 'present', checkIn: '07:55', checkOut: '16:30', subject: 'Sejarah' },
        '2025-06-10': { status: 'present', checkIn: '07:48', checkOut: '16:28', subject: 'Geografi' },
        '2025-06-11': { status: 'present', checkIn: '07:52', checkOut: '16:32', subject: 'PKN' },
        '2025-06-12': { status: 'absent', checkIn: null, checkOut: null, subject: 'Ekonomi', reason: 'Sakit' },
        '2025-06-13': { status: 'present', checkIn: '07:58', checkOut: '16:25', subject: 'Sosiologi' },
        '2025-06-16': { status: 'present', checkIn: '07:46', checkOut: '16:30', subject: 'Bahasa Inggris' },
        '2025-06-17': { status: 'present', checkIn: '07:45', checkOut: null, subject: 'Matematika' }, // Today
        '2025-06-18': { status: 'late', checkIn: '08:10', checkOut: '16:30', subject: 'Fisika' },
        '2025-06-19': { status: 'present', checkIn: '07:50', checkOut: '16:25', subject: 'Kimia' },
        '2025-06-20': { status: 'present', checkIn: '07:45', checkOut: '16:30', subject: 'Biologi' },
        '2025-06-23': { status: 'present', checkIn: '07:55', checkOut: '16:35', subject: 'Bahasa Indonesia' },
        '2025-06-24': { status: 'absent', checkIn: null, checkOut: null, subject: 'Sejarah', reason: 'Izin' },
        '2025-06-25': { status: 'present', checkIn: '07:48', checkOut: '16:28', subject: 'Geografi' },
        '2025-06-26': { status: 'late', checkIn: '08:05', checkOut: '16:30', subject: 'PKN' },
        '2025-06-27': { status: 'present', checkIn: '07:50', checkOut: '16:30', subject: 'Ekonomi' },
        '2025-06-30': { status: 'present', checkIn: '07:45', checkOut: '16:25', subject: 'Sosiologi' },

        // Mei 2025
        '2025-05-01': { status: 'present', checkIn: '07:50', checkOut: '16:30', subject: 'Matematika' },
        '2025-05-02': { status: 'present', checkIn: '07:45', checkOut: '16:25', subject: 'Fisika' },
        '2025-05-05': { status: 'present', checkIn: '07:55', checkOut: '16:35', subject: 'Kimia' },
        '2025-05-06': { status: 'late', checkIn: '08:12', checkOut: '16:30', subject: 'Biologi' },
        '2025-05-07': { status: 'present', checkIn: '07:48', checkOut: '16:28', subject: 'Bahasa Indonesia' },
        '2025-05-08': { status: 'present', checkIn: '07:52', checkOut: '16:32', subject: 'Sejarah' },
        '2025-05-09': { status: 'present', checkIn: '07:46', checkOut: '16:30', subject: 'Geografi' },
        '2025-05-12': { status: 'present', checkIn: '07:58', checkOut: '16:25', subject: 'PKN' },
        '2025-05-13': { status: 'absent', checkIn: null, checkOut: null, subject: 'Ekonomi', reason: 'Sakit' },
        '2025-05-14': { status: 'present', checkIn: '07:45', checkOut: '16:30', subject: 'Sosiologi' },
        '2025-05-15': { status: 'present', checkIn: '07:50', checkOut: '16:25', subject: 'Bahasa Inggris' },
        '2025-05-16': { status: 'present', checkIn: '07:55', checkOut: '16:35', subject: 'Matematika' },
        '2025-05-19': { status: 'present', checkIn: '07:48', checkOut: '16:28', subject: 'Fisika' },
        '2025-05-20': { status: 'late', checkIn: '08:08', checkOut: '16:30', subject: 'Kimia' },
        '2025-05-21': { status: 'present', checkIn: '07:52', checkOut: '16:32', subject: 'Biologi' },
        '2025-05-22': { status: 'present', checkIn: '07:46', checkOut: '16:30', subject: 'Bahasa Indonesia' },
        '2025-05-23': { status: 'present', checkIn: '07:58', checkOut: '16:25', subject: 'Sejarah' },
        '2025-05-26': { status: 'present', checkIn: '07:45', checkOut: '16:30', subject: 'Geografi' },
        '2025-05-27': { status: 'present', checkIn: '07:50', checkOut: '16:25', subject: 'PKN' },
        '2025-05-28': { status: 'absent', checkIn: null, checkOut: null, subject: 'Ekonomi', reason: 'Izin' },
        '2025-05-29': { status: 'present', checkIn: '07:55', checkOut: '16:35', subject: 'Sosiologi' },
        '2025-05-30': { status: 'present', checkIn: '07:48', checkOut: '16:28', subject: 'Bahasa Inggris' },

        // April 2025
        '2025-04-01': { status: 'present', checkIn: '07:52', checkOut: '16:32', subject: 'Matematika' },
        '2025-04-02': { status: 'present', checkIn: '07:46', checkOut: '16:30', subject: 'Fisika' },
        '2025-04-03': { status: 'late', checkIn: '08:15', checkOut: '16:30', subject: 'Kimia' },
        '2025-04-04': { status: 'present', checkIn: '07:58', checkOut: '16:25', subject: 'Biologi' },
        '2025-04-07': { status: 'present', checkIn: '07:45', checkOut: '16:30', subject: 'Bahasa Indonesia' },
        '2025-04-08': { status: 'present', checkIn: '07:50', checkOut: '16:25', subject: 'Sejarah' },
        '2025-04-09': { status: 'present', checkIn: '07:55', checkOut: '16:35', subject: 'Geografi' },
        '2025-04-10': { status: 'absent', checkIn: null, checkOut: null, subject: 'PKN', reason: 'Sakit' },
        '2025-04-11': { status: 'present', checkIn: '07:48', checkOut: '16:28', subject: 'Ekonomi' },
        '2025-04-14': { status: 'present', checkIn: '07:52', checkOut: '16:32', subject: 'Sosiologi' },
        '2025-04-15': { status: 'present', checkIn: '07:46', checkOut: '16:30', subject: 'Bahasa Inggris' },
        '2025-04-16': { status: 'late', checkIn: '08:10', checkOut: '16:30', subject: 'Matematika' },
        '2025-04-17': { status: 'present', checkIn: '07:58', checkOut: '16:25', subject: 'Fisika' },
        '2025-04-18': { status: 'present', checkIn: '07:45', checkOut: '16:30', subject: 'Kimia' },
        '2025-04-21': { status: 'present', checkIn: '07:50', checkOut: '16:25', subject: 'Biologi' },
        '2025-04-22': { status: 'present', checkIn: '07:55', checkOut: '16:35', subject: 'Bahasa Indonesia' },
        '2025-04-23': { status: 'present', checkIn: '07:48', checkOut: '16:28', subject: 'Sejarah' },
        '2025-04-24': { status: 'absent', checkIn: null, checkOut: null, subject: 'Geografi', reason: 'Izin' },
        '2025-04-25': { status: 'present', checkIn: '07:52', checkOut: '16:32', subject: 'PKN' },
        '2025-04-28': { status: 'present', checkIn: '07:46', checkOut: '16:30', subject: 'Ekonomi' },
        '2025-04-29': { status: 'present', checkIn: '07:58', checkOut: '16:25', subject: 'Sosiologi' },
        '2025-04-30': { status: 'late', checkIn: '08:07', checkOut: '16:30', subject: 'Bahasa Inggris' },
    };

    // Utility functions
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    }; const getAttendanceStatus = (day) => {
        if (!day) return null;
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return attendanceData[dateStr];
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'present': return 'Hadir';
            case 'absent': return 'Tidak Hadir';
            case 'late': return 'Terlambat';
            default: return 'Tidak ada kelas';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <MdCheckCircle className="h-4 w-4 text-green-600" />;
            case 'absent': return <MdCancel className="h-4 w-4 text-red-600" />;
            case 'late': return <MdWarning className="h-4 w-4 text-amber-600" />;
            default: return <MdInfo className="h-4 w-4 text-gray-400" />;
        }
    };    // Calculate monthly statistics
    const getMonthlyStats = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        let present = 0, absent = 0, late = 0, total = 0;
        let totalMinutesLate = 0;
        let onTimeCount = 0;

        Object.entries(attendanceData).forEach(([date, data]) => {
            const [dateYear, dateMonth] = date.split('-').map(Number);
            if (dateYear === year && dateMonth === month) {
                total++;
                switch (data.status) {
                    case 'present':
                        present++;
                        if (data.checkIn && data.checkIn <= '08:00') onTimeCount++;
                        break;
                    case 'absent': absent++; break;
                    case 'late':
                        late++;
                        if (data.checkIn) {
                            const [hour, minute] = data.checkIn.split(':').map(Number);
                            const lateMinutes = (hour - 8) * 60 + minute;
                            if (lateMinutes > 0) totalMinutesLate += lateMinutes;
                        }
                        break;
                }
            }
        });

        const avgLateMinutes = late > 0 ? Math.round(totalMinutesLate / late) : 0;
        const onTimePercentage = total > 0 ? Math.round((onTimeCount / total) * 100) : 0;

        return { present, absent, late, total, avgLateMinutes, onTimePercentage };
    };    // Get recent attendance for quick view
    const getRecentAttendance = () => {
        const recent = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const data = attendanceData[dateStr];

            if (data) {
                recent.push({
                    date: date.getDate(),
                    day: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date.getDay()],
                    ...data
                });
            }
        }

        return recent;
    };

    // Get attendance streak
    const getAttendanceStreak = () => {
        const today = new Date();
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;

        // Check backwards from today
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const data = attendanceData[dateStr];

            if (data && (data.status === 'present' || data.status === 'late')) {
                if (i === 0) currentStreak = 1;
                else if (currentStreak > 0) currentStreak++;
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else if (data) {
                tempStreak = 0;
                if (i === 0) currentStreak = 0;
            }
        }

        return { current: currentStreak, best: bestStreak };
    };

    // Get subject-wise performance
    const getSubjectPerformance = () => {
        const subjects = {};

        Object.entries(attendanceData).forEach(([date, data]) => {
            const [year, month] = date.split('-').map(Number);
            if (year === currentDate.getFullYear() && month === currentDate.getMonth() + 1) {
                if (!subjects[data.subject]) {
                    subjects[data.subject] = { present: 0, absent: 0, late: 0, total: 0 };
                }
                subjects[data.subject].total++;
                subjects[data.subject][data.status]++;
            }
        });

        return Object.entries(subjects).map(([subject, stats]) => ({
            subject,
            ...stats,
            percentage: Math.round((stats.present / stats.total) * 100)
        })).sort((a, b) => b.percentage - a.percentage);
    };

    // Get monthly comparison
    const getMonthlyComparison = () => {
        const months = [];
        const today = new Date();

        for (let i = 2; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            let present = 0, total = 0;

            Object.entries(attendanceData).forEach(([dateStr, data]) => {
                const [dateYear, dateMonth] = dateStr.split('-').map(Number);
                if (dateYear === year && dateMonth === month) {
                    total++;
                    if (data.status === 'present') present++;
                }
            });

            months.push({
                name: monthNames[date.getMonth()],
                percentage: total > 0 ? Math.round((present / total) * 100) : 0,
                present,
                total
            });
        }

        return months;
    };

    // Handle day click
    const handleDayClick = (day) => {
        if (!day) return;
        const status = getAttendanceStatus(day);
        if (status) {
            setSelectedDayDetails({
                day,
                ...status,
                date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            });
        }
    };

    // Constants (moved up to avoid hoisting issues)
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    // Data processing
    const stats = getMonthlyStats();
    const attendancePercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
    const streakData = getAttendanceStreak();
    const subjectPerformance = getSubjectPerformance();
    const monthlyComparison = getMonthlyComparison();
    const recentAttendance = getRecentAttendance();

    // Navigation function
    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    }; return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Enhanced Header with View Toggle */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 px-6 py-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <MdCalendarToday className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Kalender Kehadiran</h3>
                            <p className="text-blue-100 flex items-center mt-1">
                                <MdDateRange className="h-4 w-4 mr-1" />
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* View Mode Toggle */}
                        <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
                            <button
                                onClick={() => setViewMode('month')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'month'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                <MdCalendarToday className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('analytics')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'analytics'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                <MdAnalytics className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('subjects')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'subjects'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-white hover:bg-white/20'
                                    }`}
                            >
                                <MdSchool className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            onClick={() => navigateMonth(-1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            title="Bulan Sebelumnya"
                        >
                            <MdChevronLeft className="h-6 w-6 text-white" />
                        </button>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            title="Bulan Selanjutnya"
                        >
                            <MdChevronRight className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Enhanced Quick Stats in Header */}
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-6 gap-3">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs font-medium">Kehadiran</p>
                                <p className="text-white text-lg font-bold">{attendancePercentage}%</p>
                            </div>
                            <MdTrendingUp className="h-5 w-5 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs font-medium">Total Hari</p>
                                <p className="text-white text-lg font-bold">{stats.total}</p>
                            </div>
                            <MdCalendarToday className="h-5 w-5 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs font-medium">Tepat Waktu</p>
                                <p className="text-white text-lg font-bold">{stats.onTimePercentage}%</p>
                            </div>
                            <MdAccessTime className="h-5 w-5 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs font-medium">Rata² Telat</p>
                                <p className="text-white text-lg font-bold">{stats.avgLateMinutes}m</p>
                            </div>
                            <MdWarning className="h-5 w-5 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs font-medium">Streak Saat Ini</p>
                                <p className="text-white text-lg font-bold">{streakData.current}</p>
                            </div>
                            <MdLocalFireDepartment className="h-5 w-5 text-orange-300" />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs font-medium">Best Streak</p>
                                <p className="text-white text-lg font-bold">{streakData.best}</p>
                            </div>
                            <MdStars className="h-5 w-5 text-yellow-300" />
                        </div>
                    </div>
                </div>
            </div>            <div className="p-6">
                {viewMode === 'month' && (
                    <>
                        {/* Enhanced Statistics */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                    <MdInsights className="h-5 w-5 mr-2 text-blue-600" />
                                    Detail Statistik Kehadiran
                                </h4>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-green-700">{stats.present}</p>
                                            <p className="text-sm text-green-600 font-medium">Hari Hadir</p>
                                        </div>
                                        <MdCheckCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-200 rounded-full opacity-20"></div>
                                </div>

                                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-amber-700">{stats.late}</p>
                                            <p className="text-sm text-amber-600 font-medium">Hari Terlambat</p>
                                        </div>
                                        <MdWarning className="h-8 w-8 text-amber-500" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-200 rounded-full opacity-20"></div>
                                </div>

                                <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
                                            <p className="text-sm text-red-600 font-medium">Hari Tidak Hadir</p>
                                        </div>
                                        <MdCancel className="h-8 w-8 text-red-500" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-200 rounded-full opacity-20"></div>
                                </div>

                                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                                            <p className="text-sm text-blue-600 font-medium">Total Hari Sekolah</p>
                                        </div>
                                        <MdCalendarToday className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-200 rounded-full opacity-20"></div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700">Progress Kehadiran Bulanan</span>
                                    <span className={`text-lg font-bold px-3 py-1 rounded-full ${attendancePercentage >= 90 ? 'bg-green-100 text-green-700' :
                                        attendancePercentage >= 75 ? 'bg-blue-100 text-blue-700' :
                                            attendancePercentage >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {attendancePercentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-1000 ${attendancePercentage >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                            attendancePercentage >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                                                attendancePercentage >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                                                    'bg-gradient-to-r from-red-500 to-pink-400'
                                            }`}
                                        style={{ width: `${attendancePercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Summary */}
                        {recentAttendance.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                                    <MdTimeline className="h-5 w-5 mr-2 text-blue-600" />
                                    Kehadiran 7 Hari Terakhir
                                </h4>
                                <div className="grid grid-cols-7 gap-2">
                                    {recentAttendance.map((item, index) => (
                                        <div key={index} className="text-center">
                                            <p className="text-xs text-gray-500 mb-1">{item.day}</p>
                                            <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-white font-bold ${item.status === 'present' ? 'bg-green-500' :
                                                item.status === 'late' ? 'bg-amber-500' : 'bg-red-500'
                                                }`}>
                                                {item.date}
                                            </div>
                                            <p className="text-xs mt-1 font-medium">{item.checkIn || '--:--'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Clean Calendar Grid */}
                        <div className="space-y-2">
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                                {dayNames.map((day) => (
                                    <div key={day} className="bg-gray-100 px-2 py-3 text-center">
                                        <span className="text-xs font-bold text-gray-600">{day}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                                {getCalendarDays().map((day, index) => {
                                    const status = getAttendanceStatus(day);
                                    const isToday = day &&
                                        currentDate.getFullYear() === new Date().getFullYear() &&
                                        currentDate.getMonth() === new Date().getMonth() &&
                                        day === new Date().getDate();

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleDayClick(day)}
                                            className={`
                                                relative h-12 flex items-center justify-center text-sm font-medium
                                                transition-all duration-200
                                                ${day ? 'cursor-pointer' : ''}
                                                ${!day ? 'bg-gray-50' :
                                                    status?.status === 'present' ? 'bg-green-500 text-white hover:bg-green-600' :
                                                        status?.status === 'late' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                                                            status?.status === 'absent' ? 'bg-red-500 text-white hover:bg-red-600' :
                                                                'bg-white text-gray-700 hover:bg-gray-50'
                                                }
                                                ${isToday ? 'ring-2 ring-blue-400 ring-inset' : ''}
                                            `}
                                            title={day && status ? `${day} - ${getStatusText(status.status)}` : day ? `${day} - Tidak ada kelas` : ''}
                                        >
                                            {day && (
                                                <>
                                                    <span className="relative z-10">{day}</span>
                                                    {isToday && (
                                                        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Clean Legend */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                    <span className="text-xs font-medium text-gray-600">Hadir</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                                    <span className="text-xs font-medium text-gray-600">Terlambat</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span className="text-xs font-medium text-gray-600">Tidak Hadir</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                                    <span className="text-xs font-medium text-gray-600">Tidak ada kelas</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {viewMode === 'analytics' && (
                    <div className="space-y-6">
                        {/* Monthly Comparison */}
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                                <MdCompare className="h-5 w-5 mr-2 text-blue-600" />
                                Perbandingan 3 Bulan Terakhir
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {monthlyComparison.map((month, index) => (
                                    <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                                        <div className="text-center">
                                            <h5 className="text-lg font-bold text-blue-800 mb-2">{month.name}</h5>
                                            <div className="text-3xl font-bold text-blue-600 mb-2">{month.percentage}%</div>
                                            <p className="text-sm text-blue-600">{month.present} dari {month.total} hari</p>
                                            <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${month.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Insights */}
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                                <MdAutoGraph className="h-5 w-5 mr-2 text-blue-600" />
                                Insights & Rekomendasi
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                                    <MdTrendingUp className="h-8 w-8 text-green-600 mb-3" />
                                    <h5 className="font-bold text-green-800 mb-2">Performa Kehadiran</h5>
                                    <p className="text-sm text-green-700">
                                        {attendancePercentage >= 90
                                            ? "Sangat baik! Pertahankan konsistensi kehadiran Anda."
                                            : attendancePercentage >= 75
                                                ? "Cukup baik, masih bisa ditingkatkan lagi."
                                                : "Perlu perbaikan. Usahakan lebih konsisten hadir."
                                        }
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 border border-orange-200">
                                    <MdLocalFireDepartment className="h-8 w-8 text-orange-600 mb-3" />
                                    <h5 className="font-bold text-orange-800 mb-2">Streak Kehadiran</h5>
                                    <p className="text-sm text-orange-700">
                                        Streak terbaik: {streakData.best} hari.
                                        {streakData.current > 0
                                            ? ` Saat ini: ${streakData.current} hari berturut-turut!`
                                            : " Mari mulai streak baru!"
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'subjects' && (
                    <div>
                        <h4 className="text-lg font-bold text-gray-800 flex items-center mb-6">
                            <MdSchool className="h-5 w-5 mr-2 text-blue-600" />
                            Kehadiran Per Mata Pelajaran
                        </h4>
                        <div className="space-y-4">
                            {subjectPerformance.map((subject, index) => (
                                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-bold text-gray-800">{subject.subject}</h5>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${subject.percentage >= 90 ? 'bg-green-100 text-green-700' :
                                            subject.percentage >= 75 ? 'bg-blue-100 text-blue-700' :
                                                subject.percentage >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {subject.percentage}%
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 mb-3">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-green-600">{subject.present}</p>
                                            <p className="text-xs text-gray-500">Hadir</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-amber-600">{subject.late}</p>
                                            <p className="text-xs text-gray-500">Terlambat</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-red-600">{subject.absent}</p>
                                            <p className="text-xs text-gray-500">Tidak Hadir</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-600">{subject.total}</p>
                                            <p className="text-xs text-gray-500">Total</p>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${subject.percentage >= 90 ? 'bg-green-500' :
                                                subject.percentage >= 75 ? 'bg-blue-500' :
                                                    subject.percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${subject.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Day Details Modal */}
            {selectedDayDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">Detail Kehadiran</h3>
                            <button
                                onClick={() => setSelectedDayDetails(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <MdClose className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white mb-4 ${selectedDayDetails.status === 'present' ? 'bg-green-500' :
                                    selectedDayDetails.status === 'late' ? 'bg-amber-500' : 'bg-red-500'
                                    }`}>
                                    {getStatusIcon(selectedDayDetails.status)}
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">
                                    {getStatusText(selectedDayDetails.status)}
                                </h4>
                                <p className="text-gray-600">{selectedDayDetails.date}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Mata Pelajaran</span>
                                    <span className="font-bold text-gray-800">{selectedDayDetails.subject}</span>
                                </div>

                                {selectedDayDetails.checkIn && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Jam Masuk</span>
                                        <span className="font-bold text-gray-800">{selectedDayDetails.checkIn}</span>
                                    </div>
                                )}

                                {selectedDayDetails.checkOut && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Jam Keluar</span>
                                        <span className="font-bold text-gray-800">{selectedDayDetails.checkOut}</span>
                                    </div>
                                )}

                                {selectedDayDetails.reason && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Keterangan</span>
                                        <span className="font-bold text-gray-800">{selectedDayDetails.reason}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceCalendar;
