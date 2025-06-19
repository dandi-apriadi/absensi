import React from "react";
import Card from "components/card";
import {
    MdTimer,
    MdHistory,
    MdEvent,
    MdQrCode,
    MdNotifications,
    MdAnalytics,
    MdCheckCircle,
    MdWarning,
    MdSchedule,
} from "react-icons/md";

const Sidebar = ({ recentActivities, upcomingClasses }) => {
    const quickActions = [
        {
            icon: MdQrCode,
            label: "Buat QR Code",
            color: "indigo",
            bgColor: "bg-indigo-50",
            hoverColor: "hover:bg-indigo-100",
            textColor: "text-indigo-700"
        },
        {
            icon: MdNotifications,
            label: "Kirim Notifikasi",
            color: "green",
            bgColor: "bg-green-50",
            hoverColor: "hover:bg-green-100",
            textColor: "text-green-700"
        },
        {
            icon: MdAnalytics,
            label: "Lihat Laporan",
            color: "blue",
            bgColor: "bg-blue-50",
            hoverColor: "hover:bg-blue-100",
            textColor: "text-blue-700"
        }
    ];

    const upcomingClassesData = [
        { code: "CS-101", time: "Senin, 08:00", label: "Besok", color: "blue" },
        { code: "CS-102", time: "Selasa, 10:00", label: "2 hari", color: "green" },
        { code: "CS-103", time: "Rabu, 13:00", label: "3 hari", color: "purple" }
    ];

    // Function to get icon based on activity type
    const getActivityIcon = (type) => {
        switch (type) {
            case "attendance":
                return MdCheckCircle;
            case "alert":
                return MdWarning;
            case "schedule":
                return MdSchedule;
            default:
                return MdHistory;
        }
    };

    return (
        <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card extra="p-4" data-aos="fade-left">
                <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4 flex items-center">
                    <MdTimer className="mr-2" />
                    Aksi Cepat
                </h3>
                <div className="space-y-3">
                    {quickActions.map((action, index) => {
                        const IconComponent = action.icon;
                        return (
                            <button
                                key={index}
                                className={`w-full flex items-center p-3 ${action.bgColor} rounded-lg ${action.hoverColor} transition-colors`}
                            >
                                <IconComponent className={`h-5 w-5 text-${action.color}-600 mr-3`} />
                                <span className={`text-sm font-medium ${action.textColor}`}>
                                    {action.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Recent Activities */}
            <Card extra="p-4" data-aos="fade-left" data-aos-delay="100">
                <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4 flex items-center">
                    <MdHistory className="mr-2" />
                    Aktivitas Terbaru
                </h3>
                <div className="space-y-3">
                    {recentActivities?.map((activity) => {
                        const IconComponent = getActivityIcon(activity.type);
                        return (
                            <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                                <div className={`p-1.5 rounded-full bg-${activity.color}-100`}>
                                    <IconComponent className={`h-4 w-4 text-${activity.color}-600`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {activity.course}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button className="block mt-4 text-sm text-indigo-600 hover:text-indigo-800 text-center font-medium w-full">
                    Lihat Semua Aktivitas
                </button>
            </Card>

            {/* Upcoming Classes */}
            <Card extra="p-4" data-aos="fade-left" data-aos-delay="200">
                <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-4 flex items-center">
                    <MdEvent className="mr-2" />
                    Kelas Mendatang
                </h3>
                <div className="space-y-3">
                    {upcomingClassesData.map((classItem, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 bg-${classItem.color}-50 rounded-lg`}>
                            <div>
                                <p className={`text-sm font-medium text-${classItem.color}-900`}>
                                    {classItem.code}
                                </p>
                                <p className={`text-xs text-${classItem.color}-700`}>
                                    {classItem.time}
                                </p>
                            </div>
                            <span className={`text-xs bg-${classItem.color}-100 text-${classItem.color}-800 px-2 py-1 rounded-full`}>
                                {classItem.label}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Sidebar;
