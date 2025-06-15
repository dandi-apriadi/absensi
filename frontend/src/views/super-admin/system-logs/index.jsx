import React, { useEffect, useState } from "react";
import { MdBugReport, MdInsights, MdSecurity, MdRefresh, MdDownload, MdFilterList, MdSearch, MdCalendarToday, MdChevronLeft, MdChevronRight } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const SystemLogs = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        // Simulate fetching log data
        fetchLogs();
    }, []);

    const fetchLogs = () => {
        // Dummy log data
        const dummyLogs = [
            { id: 1, timestamp: "2025-05-15T15:45:22", level: "error", source: "face-recognition", message: "Face recognition service failed to initialize", details: "Error connecting to GPU for acceleration" },
            { id: 2, timestamp: "2025-05-15T14:32:15", level: "warning", source: "door-controller", message: "Door controller connection timeout", details: "Reconnected after 3 attempts" },
            { id: 3, timestamp: "2025-05-15T13:21:54", level: "info", source: "system", message: "System backup completed", details: "Total size: 1.2GB" },
            { id: 4, timestamp: "2025-05-15T12:15:32", level: "info", source: "user", message: "User admin logged in", details: "IP Address: 192.168.1.45" },
            { id: 5, timestamp: "2025-05-15T11:02:41", level: "warning", source: "database", message: "High database load detected", details: "Load: 85% for 5 minutes" },
            { id: 6, timestamp: "2025-05-15T10:05:18", level: "error", source: "api", message: "API rate limit exceeded", details: "Too many requests from client application" },
            { id: 7, timestamp: "2025-05-15T09:45:29", level: "info", source: "system", message: "Daily cleanup task completed", details: "Removed 153 temporary files" },
            { id: 8, timestamp: "2025-05-15T08:30:45", level: "info", source: "user", message: "New user account created", details: "Username: lecturer_ahmad" }
        ];

        setLogs(dummyLogs);
    };

    // Filter logs based on active tab
    const filteredLogs = () => {
        if (activeTab === 'all') return logs;
        return logs.filter(log => log.level === activeTab);
    };

    // Format timestamp for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Get log level styles
    const getLevelStyle = (level) => {
        switch (level) {
            case "error":
                return "bg-red-100 text-red-800";
            case "warning":
                return "bg-yellow-100 text-yellow-800";
            case "info":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Log Sistem</h1>
                <p className="text-gray-600">Kelola dan pantau log aktivitas sistem</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8" data-aos="fade-up">
                <div className="flex p-4 border-b border-gray-200 bg-gray-50">
                    <button
                        className={`mr-4 px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        Semua Log
                    </button>
                    <button
                        className={`mr-4 px-4 py-2 rounded-lg ${activeTab === 'error' ? 'bg-red-600 text-white' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('error')}
                    >
                        Error
                    </button>
                    <button
                        className={`mr-4 px-4 py-2 rounded-lg ${activeTab === 'warning' ? 'bg-yellow-500 text-white' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('warning')}
                    >
                        Warning
                    </button>
                    <button
                        className={`mr-4 px-4 py-2 rounded-lg ${activeTab === 'info' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Info
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari log..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="all">Semua Sumber</option>
                                <option value="system">System</option>
                                <option value="user">User</option>
                                <option value="face-recognition">Face Recognition</option>
                                <option value="door-controller">Door Controller</option>
                                <option value="database">Database</option>
                                <option value="api">API</option>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs().map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(log.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelStyle(log.level)}`}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.source}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {log.message}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Showing {filteredLogs().length} logs</p>
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

export default SystemLogs;
