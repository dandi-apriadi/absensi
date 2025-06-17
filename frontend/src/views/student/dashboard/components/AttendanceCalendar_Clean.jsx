import React, { useState } from "react";
import { MdChevronLeft, MdChevronRight, MdCalendarToday, MdTrendingUp } from "react-icons/md";

const AttendanceCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Comprehensive dummy attendance data covering multiple months
    const attendanceData = {
        // Juni 2025 (current month)
        '2025-06-02': 'present',
        '2025-06-03': 'present',
        '2025-06-04': 'late',
        '2025-06-05': 'present',
        '2025-06-06': 'present',
        '2025-06-09': 'present',
        '2025-06-10': 'present',
        '2025-06-11': 'present',
        '2025-06-12': 'absent',
        '2025-06-13': 'present',
        '2025-06-16': 'present',
        '2025-06-17': 'present', // Today
        '2025-06-18': 'late',
        '2025-06-19': 'present',
        '2025-06-20': 'present',
        '2025-06-23': 'present',
        '2025-06-24': 'absent',
        '2025-06-25': 'present',
        '2025-06-26': 'late',
        '2025-06-27': 'present',
        '2025-06-30': 'present',

        // Mei 2025
        '2025-05-01': 'present',
        '2025-05-02': 'present',
        '2025-05-05': 'present',
        '2025-05-06': 'late',
        '2025-05-07': 'present',
        '2025-05-08': 'present',
        '2025-05-09': 'present',
        '2025-05-12': 'present',
        '2025-05-13': 'absent',
        '2025-05-14': 'present',
        '2025-05-15': 'present',
        '2025-05-16': 'present',
        '2025-05-19': 'present',
        '2025-05-20': 'late',
        '2025-05-21': 'present',
        '2025-05-22': 'present',
        '2025-05-23': 'present',
        '2025-05-26': 'present',
        '2025-05-27': 'present',
        '2025-05-28': 'absent',
        '2025-05-29': 'present',
        '2025-05-30': 'present',

        // April 2025
        '2025-04-01': 'present',
        '2025-04-02': 'present',
        '2025-04-03': 'late',
        '2025-04-04': 'present',
        '2025-04-07': 'present',
        '2025-04-08': 'present',
        '2025-04-09': 'present',
        '2025-04-10': 'absent',
        '2025-04-11': 'present',
        '2025-04-14': 'present',
        '2025-04-15': 'present',
        '2025-04-16': 'late',
        '2025-04-17': 'present',
        '2025-04-18': 'present',
        '2025-04-21': 'present',
        '2025-04-22': 'present',
        '2025-04-23': 'present',
        '2025-04-24': 'absent',
        '2025-04-25': 'present',
        '2025-04-28': 'present',
        '2025-04-29': 'present',
        '2025-04-30': 'late',
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
    };

    const getAttendanceStatus = (day) => {
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

    // Calculate monthly statistics
    const getMonthlyStats = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        let present = 0, absent = 0, late = 0, total = 0;

        Object.entries(attendanceData).forEach(([date, status]) => {
            const [dateYear, dateMonth] = date.split('-').map(Number);
            if (dateYear === year && dateMonth === month) {
                total++;
                switch (status) {
                    case 'present': present++; break;
                    case 'absent': absent++; break;
                    case 'late': late++; break;
                }
            }
        });

        return { present, absent, late, total };
    };

    // Data processing
    const stats = getMonthlyStats();
    const attendancePercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

    // Constants
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    // Navigation function
    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
            {/* Clean Header */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <MdCalendarToday className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Kalender Kehadiran</h3>
                            <p className="text-sm text-gray-600">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                            title="Bulan Sebelumnya"
                        >
                            <MdChevronLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                            title="Bulan Selanjutnya"
                        >
                            <MdChevronRight className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Clean Statistics Row */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                            <MdTrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                            Statistik Kehadiran
                        </h4>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full ${attendancePercentage >= 90 ? 'bg-green-100 text-green-700' :
                                attendancePercentage >= 75 ? 'bg-blue-100 text-blue-700' :
                                    attendancePercentage >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {attendancePercentage}%
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="text-lg font-bold text-blue-600">{stats.total}</div>
                            <div className="text-xs text-blue-500 font-medium">Total</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="text-lg font-bold text-green-600">{stats.present}</div>
                            <div className="text-xs text-green-500 font-medium">Hadir</div>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="text-lg font-bold text-amber-600">{stats.late}</div>
                            <div className="text-xs text-amber-500 font-medium">Terlambat</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="text-lg font-bold text-red-600">{stats.absent}</div>
                            <div className="text-xs text-red-500 font-medium">Tidak Hadir</div>
                        </div>
                    </div>
                </div>

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
                                    className={`
                                        relative h-12 flex items-center justify-center text-sm font-medium
                                        transition-all duration-200
                                        ${day ? 'cursor-pointer' : ''}
                                        ${!day ? 'bg-gray-50' :
                                            status === 'present' ? 'bg-green-500 text-white hover:bg-green-600' :
                                                status === 'late' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                                                    status === 'absent' ? 'bg-red-500 text-white hover:bg-red-600' :
                                                        'bg-white text-gray-700 hover:bg-gray-50'
                                        }
                                        ${isToday ? 'ring-2 ring-blue-400 ring-inset' : ''}
                                    `}
                                    title={day && status ? `${day} - ${getStatusText(status)}` : day ? `${day} - Tidak ada kelas` : ''}
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
            </div>
        </div>
    );
};

export default AttendanceCalendar;
