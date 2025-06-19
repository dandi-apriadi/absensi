import React from "react";
import Card from "components/card";
import {
    MdPeople,
    MdAccessTime,
    MdCalendarToday,
    MdAssignment,
    MdTrendingUp,
    MdTrendingDown,
    MdQrCode,
    MdAnalytics,
    MdMore,
    MdCheckCircle,
    MdWarning,
    MdTimer,
} from "react-icons/md";

const CourseCard = ({ course, index, onTakeAttendance, onViewDetail }) => {
    const getColorClass = (color) => {
        const colors = {
            blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
            green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
            purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
            orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
        };
        return colors[color] || colors.blue;
    };

    const getStatusBadge = (status) => {
        const badges = {
            excellent: {
                icon: MdCheckCircle,
                text: "Excellent",
                className: "bg-green-100 text-green-800"
            },
            attention: {
                icon: MdWarning,
                text: "Perlu Perhatian",
                className: "bg-yellow-100 text-yellow-800"
            },
            active: {
                icon: MdTimer,
                text: "Aktif",
                className: "bg-blue-100 text-blue-800"
            }
        };

        const badge = badges[status] || badges.active;
        const IconComponent = badge.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                <IconComponent className="mr-1 h-3 w-3" />
                {badge.text}
            </span>
        );
    };

    const colorClass = getColorClass(course.color);

    return (
        <Card
            extra={`p-4 hover:border-${course.color}-300 hover:shadow-lg transition-all duration-300 border-l-4 border-l-${course.color}-500`}
            data-aos="fade-up"
            data-aos-delay={index * 100}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className={`text-xs font-semibold py-1 px-3 rounded-full ${colorClass.bg} ${colorClass.text} ${colorClass.border} border`}>
                    {course.code}
                </div>
                <div className="flex items-center space-x-2">
                    {getStatusBadge(course.status)}
                    <button className="p-1 rounded-full hover:bg-gray-100">
                        <MdMore className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Course Info */}
            <h3 className="text-xl font-bold text-navy-700 dark:text-white mb-2">
                {course.name}
            </h3>
            <div className="text-xs text-gray-500 mb-4">
                {course.semester}
            </div>

            {/* Course Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                    <MdPeople className="mr-2 h-4 w-4" />
                    <span className="text-sm">{course.students} Mahasiswa</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <MdCalendarToday className="mr-2 h-4 w-4" />
                    <span className="text-sm">{course.day}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <MdAccessTime className="mr-2 h-4 w-4" />
                    <span className="text-sm">{course.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <MdAssignment className="mr-2 h-4 w-4" />
                    <span className="text-sm">{course.completedSessions}/{course.sessions}</span>
                </div>
            </div>

            {/* Attendance Info */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Kehadiran</span>
                    <div className="flex items-center space-x-1">
                        <span className="text-sm font-bold text-gray-900">{course.averageAttendance}%</span>
                        {course.trend === "up" ? (
                            <MdTrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                            <MdTrendingDown className="h-4 w-4 text-red-500" />
                        )}
                    </div>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div
                        className={`h-2 rounded-full ${course.averageAttendance >= 90 ? 'bg-green-500' :
                                course.averageAttendance >= 80 ? 'bg-blue-500' :
                                    course.averageAttendance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${course.averageAttendance}%` }}
                    />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress Perkuliahan</span>
                    <span>{Math.round((course.completedSessions / course.sessions) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div
                        className={`h-2 rounded-full bg-${course.color}-500`}
                        style={{ width: `${(course.completedSessions / course.sessions) * 100}%` }}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={() => onTakeAttendance(course)}
                    className="flex-1 py-2 px-3 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors text-center flex items-center justify-center"
                >
                    <MdQrCode className="mr-1 h-4 w-4" />
                    Ambil Absensi
                </button>
                <button
                    onClick={() => onViewDetail(course)}
                    className="flex-1 py-2 px-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors text-center flex items-center justify-center"
                >
                    <MdAnalytics className="mr-1 h-4 w-4" />
                    Detail
                </button>
            </div>
        </Card>
    );
};

export default CourseCard;
