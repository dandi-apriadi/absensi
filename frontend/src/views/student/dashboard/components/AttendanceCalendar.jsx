import React, { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const AttendanceCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const attendanceData = {
        '2024-01-15': 'present',
        '2024-01-16': 'absent',
        '2024-01-17': 'present',
        '2024-01-18': 'late',
        '2024-01-19': 'present',
        '2024-01-22': 'present',
        '2024-01-23': 'present',
        '2024-01-24': 'absent',
        '2024-01-25': 'present',
        '2024-01-26': 'late',
    };

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-500';
            case 'absent': return 'bg-red-500';
            case 'late': return 'bg-yellow-500';
            default: return 'bg-gray-100';
        }
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Kalender Kehadiran</h3>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MdChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <span className="text-lg font-medium text-gray-800 min-w-[150px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <MdChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {getCalendarDays().map((day, index) => {
                    const status = getAttendanceStatus(day);
                    return (
                        <div
                            key={index}
                            className={`
                aspect-square flex items-center justify-center text-sm rounded-lg
                ${day ? 'hover:bg-gray-50 cursor-pointer' : ''}
                ${status ? getStatusColor(status) + ' text-white font-medium' : 'text-gray-700'}
                ${!day ? 'invisible' : ''}
              `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-6 pt-4 border-t">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Hadir</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Tidak Hadir</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Terlambat</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceCalendar;
