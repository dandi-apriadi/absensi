import React, { useEffect, useState } from "react";
import { MdInsights, MdRefresh, MdDownload, MdFilterList, MdSearch, MdCalendarToday, MdChevronLeft, MdChevronRight } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const ActivityLogs = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        // Simulate fetching activity data
        fetchActivityLogs();
    }, []);

    const fetchActivityLogs = () => {
        // Dummy activity log data
        const dummyActivities = [
            { id: 1, timestamp: "2025-05-15T15:45:22", user: "admin", action: "User Login", details: "Admin login successful", ip: "192.168.1.45" },
            { id: 2, timestamp: "2025-05-15T15:32:17", user: "admin", action: "System Settings Updated", details: "Face recognition threshold changed to 95%", ip: "192.168.1.45" },
            { id: 3, timestamp: "2025-05-15T14:56:03", user: "ahmad_lecturer", action: "Manual Attendance", details: "4 students marked present manually", ip: "192.168.1.58" },
            { id: 4, timestamp: "2025-05-15T14:22:45", user: "system", action: "Backup Created", details: "Automatic system backup completed", ip: "localhost" },
            { id: 5, timestamp: "2025-05-15T13:45:12", user: "budi_admin", action: "User Created", details: "New lecturer account created", ip: "192.168.1.52" },
            { id: 6, timestamp: "2025-05-15T13:15:30", user: "budi_admin", action: "Dataset Uploaded", details: "Face dataset uploaded for 5 students", ip: "192.168.1.52" },
            { id: 7, timestamp: "2025-05-15T12:30:05", user: "admin", action: "Report Generated", details: "Monthly attendance report exported", ip: "192.168.1.45" },
            { id: 8, timestamp: "2025-05-15T11:45:55", user: "system", action: "System Update", details: "Software update to version 2.1.3 completed", ip: "localhost" },
            { id: 9, timestamp: "2025-05-15T11:05:23", user: "ahmad_lecturer", action: "Attendance Export", details: "Class attendance exported to Excel", ip: "192.168.1.58" },
            { id: 10, timestamp: "2025-05-15T10:15:42", user: "admin", action: "Room Settings Updated", details: "Lab Komputer 1 access schedule modified", ip: "192.168.1.45" }
        ];

        setActivities(dummyActivities);
    };

    // Format timestamp for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Log Aktivitas</h1>
                <p className="text-gray-600">Pantau aktivitas pengguna dan sistem dalam aplikasi</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari aktivitas..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="all">Semua Pengguna</option>
                                <option value="admin">Admin</option>
                                <option value="lecturer">Dosen</option>
                                <option value="system">System</option>
                            </select>
                        </div>

                        <div className="relative">
                            <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="all">Semua Aksi</option>
                                <option value="login">Login</option>
                                <option value="update">Update</option>
                                <option value="create">Create</option>
                                <option value="export">Export</option>
                            </select>
                        </div>

                        <div className="relative">
                            <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex-grow"></div>

                        <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                            <MdRefresh className="mr-2" /> Refresh
                        </button>

                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <MdDownload className="mr-2" /> Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(activity.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {activity.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {activity.details}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {activity.ip}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Showing {activities.length} activities</p>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-md bg-gray-200">
                            <MdChevronLeft />
                        </button>
                        <span className="text-sm text-gray-600">Page 1 of 10</span>
                        <button className="p-2 rounded-md bg-gray-200">
                            <MdChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogs;
