import React, { useEffect, useState } from "react";
import { MdWarning, MdSecurity, MdRefresh, MdFilterList, MdCalendarToday, MdNotificationsActive, MdDangerous, MdBlock, MdCheck, MdMoreVert } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const SecurityAlerts = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSeverity, setSelectedSeverity] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Dummy security alerts data
    const securityAlerts = [
        {
            id: 1,
            timestamp: "2025-05-15 15:45:22",
            type: "Authentication",
            severity: "high",
            message: "Multiple failed login attempts",
            location: "Authentication Service",
            details: "5 consecutive failed login attempts for user admin from IP 192.168.1.45",
            status: "active",
            assignedTo: "",
        },
        {
            id: 2,
            timestamp: "2025-05-15 16:05:19",
            type: "Face Recognition",
            severity: "medium",
            message: "Potential spoofing attempt",
            location: "Lab Jaringan",
            details: "Liveness check failed 3 times for an unidentified person",
            status: "investigating",
            assignedTo: "Security Team",
        },
        {
            id: 3,
            timestamp: "2025-05-15 16:15:33",
            type: "System",
            severity: "medium",
            message: "Camera connection lost",
            location: "Room 2.02",
            details: "Connection to camera at Room 2.02 lost unexpectedly. Possible hardware failure or tampering.",
            status: "active",
            assignedTo: "",
        },
        {
            id: 4,
            timestamp: "2025-05-15 12:33:47",
            type: "Door Access",
            severity: "high",
            message: "Forced door opening detected",
            location: "Lab Komputer 2",
            details: "Door sensor reported forced opening without authorization. Security personnel notified.",
            status: "investigating",
            assignedTo: "Security Team",
        },
        {
            id: 5,
            timestamp: "2025-05-14 23:15:11",
            type: "Network",
            severity: "critical",
            message: "Suspicious network traffic",
            location: "System Network",
            details: "Unusual outbound traffic detected from face recognition server to unknown external IP. Possible data exfiltration attempt.",
            status: "active",
            assignedTo: "Network Admin",
        },
        {
            id: 6,
            timestamp: "2025-05-14 14:23:09",
            type: "Database",
            severity: "medium",
            message: "Unusual database query pattern",
            location: "Main Database",
            details: "High number of sequential queries detected accessing student data. Investigation recommended.",
            status: "resolved",
            assignedTo: "Database Admin",
        },
        {
            id: 7,
            timestamp: "2025-05-13 09:45:22",
            type: "Authentication",
            severity: "low",
            message: "Password policy violation",
            location: "User Management",
            details: "User attempted to set weak password. Policy enforcement prevented the action.",
            status: "resolved",
            assignedTo: "",
        },
        {
            id: 8,
            timestamp: "2025-05-13 08:33:17",
            type: "Face Recognition",
            severity: "critical",
            message: "Multiple unauthorized access attempts",
            location: "Lab Jaringan",
            details: "Same unidentified person attempted to gain access 5 times using different student IDs. Possible impersonation attempt.",
            status: "resolved",
            assignedTo: "Security Team",
        }
    ];

    // Filter alerts based on selected filters
    const filteredAlerts = securityAlerts.filter(alert => {
        // Severity filter
        if (selectedSeverity !== "all" && alert.severity !== selectedSeverity) return false;

        // Status filter
        if (selectedStatus !== "all" && alert.status !== selectedStatus) return false;

        // Would filter by date range here if using real date objects

        return true;
    });

    // Get severity badge with appropriate styling
    const getSeverityBadge = (severity) => {
        switch (severity) {
            case "critical":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center"><MdDangerous className="mr-1" /> Critical</span>;
            case "high":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center"><MdWarning className="mr-1" /> High</span>;
            case "medium":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center"><MdWarning className="mr-1" /> Medium</span>;
            case "low":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center"><MdWarning className="mr-1" /> Low</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
        }
    };

    // Get status badge with appropriate styling
    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center"><MdNotificationsActive className="mr-1" /> Active</span>;
            case "investigating":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center"><MdSecurity className="mr-1" /> Investigating</span>;
            case "resolved":
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center"><MdCheck className="mr-1" /> Resolved</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Alert Keamanan</h1>
                <p className="text-gray-600">Pantau dan respon terhadap alert keamanan sistem</p>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-aos="fade-up">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Alert</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{securityAlerts.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <MdSecurity className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Alert Aktif</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">
                                {securityAlerts.filter(a => a.status === "active").length}
                            </h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <MdNotificationsActive className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Sedang Diinvestigasi</p>
                            <h3 className="text-2xl font-bold text-yellow-600 mt-1">
                                {securityAlerts.filter(a => a.status === "investigating").length}
                            </h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <MdWarning className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Alert Critical</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">
                                {securityAlerts.filter(a => a.severity === "critical").length}
                            </h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <MdDangerous className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up" data-aos-delay="100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <button
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg flex items-center hover:bg-blue-200 transition-colors"
                            onClick={() => { }}
                        >
                            <MdRefresh className="mr-1" /> Refresh
                        </button>
                        <button
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <MdFilterList className="mr-1" /> {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                    </div>

                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Quick Filter:</span>
                        <button
                            className={`px-3 py-1 text-sm rounded-lg mr-2 ${selectedStatus === 'active' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setSelectedStatus(selectedStatus === 'active' ? 'all' : 'active')}
                        >
                            Active Alerts
                        </button>
                        <button
                            className={`px-3 py-1 text-sm rounded-lg ${selectedSeverity === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setSelectedSeverity(selectedSeverity === 'critical' ? 'all' : 'critical')}
                        >
                            Critical Only
                        </button>
                    </div>
                </div>

                {/* Detailed Filters */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg" data-aos="fade-down">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="severity" className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
                                <select
                                    id="severity"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedSeverity}
                                    onChange={(e) => setSelectedSeverity(e.target.value)}
                                >
                                    <option value="all">All Severities</option>
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    id="status"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="investigating">Investigating</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                                <div className="relative">
                                    <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        id="startDate"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                                <div className="relative">
                                    <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        id="endDate"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Alerts Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAlerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.timestamp}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alert.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getSeverityBadge(alert.severity)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm text-gray-900">{alert.message}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{alert.details}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(alert.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {alert.assignedTo || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">View</button>
                                            {alert.status !== "resolved" && (
                                                <>
                                                    <button className="text-indigo-600 hover:text-indigo-900">Assign</button>
                                                    <button className="text-green-600 hover:text-green-900">Resolve</button>
                                                </>
                                            )}
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MdMoreVert />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAlerts.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No security alerts found matching your criteria.</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAlerts.length}</span> of{" "}
                                <span className="font-medium">{filteredAlerts.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    &laquo; Previous
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50 border-blue-500">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    Next &raquo;
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Best Practices */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100" data-aos="fade-up" data-aos-delay="300">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Security Best Practices</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>Respond to critical alerts within 10 minutes</li>
                    <li>Document all investigations in the security log</li>
                    <li>For door access issues, coordinate with facility management</li>
                    <li>For suspicious network activity, isolate affected systems immediately</li>
                    <li>After resolving an alert, conduct a root cause analysis</li>
                </ul>
            </div>
        </div>
    );
};

export default SecurityAlerts;
