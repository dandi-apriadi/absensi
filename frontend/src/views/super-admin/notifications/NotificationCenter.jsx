import React, { useEffect, useState } from "react";
import { MdNotifications, MdMarkEmailRead, MdDelete, MdOutlineMarkEmailUnread, MdPeople, MdWarning, MdError, MdInfo, MdSecurity, MdSettings, MdAccessTime } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const NotificationCenter = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        // Load mock notifications
        setNotifications(mockNotifications);
    }, []);

    // Mock notifications data
    const mockNotifications = [
        {
            id: 1,
            type: "security",
            severity: "critical",
            title: "Failed Login Attempts",
            message: "Multiple failed login attempts detected from IP 192.168.1.45. Account has been temporarily locked.",
            timestamp: "2025-05-15T15:45:22",
            read: false,
            actionRequired: true,
        },
        {
            id: 2,
            type: "system",
            severity: "warning",
            title: "Storage Space Low",
            message: "System storage is running low (15% remaining). Consider cleaning up unused face datasets or exporting old logs.",
            timestamp: "2025-05-15T14:30:15",
            read: false,
            actionRequired: false,
        },
        {
            id: 3,
            type: "user",
            severity: "info",
            title: "Bulk User Import Complete",
            message: "Successfully imported 125 student records. 123 successful, 2 failed. View report for details.",
            timestamp: "2025-05-15T13:05:33",
            read: true,
            actionRequired: false,
        },
        {
            id: 4,
            type: "hardware",
            severity: "warning",
            title: "Camera Connection Issue",
            message: "Face recognition camera in Room 2.02 is experiencing intermittent connection issues. Maintenance recommended.",
            timestamp: "2025-05-15T10:22:18",
            read: false,
            actionRequired: true,
        },
        {
            id: 5,
            type: "security",
            severity: "warning",
            title: "Suspicious Face Recognition Attempts",
            message: "Multiple failed face recognition attempts detected at Lab Jaringan entrance. Review camera footage is recommended.",
            timestamp: "2025-05-15T09:15:47",
            read: true,
            actionRequired: true,
        },
        {
            id: 6,
            type: "system",
            severity: "error",
            title: "Backup Failed",
            message: "Scheduled system backup failed due to insufficient permissions. Check backup configuration and storage access.",
            timestamp: "2025-05-14T23:10:05",
            read: false,
            actionRequired: true,
        },
        {
            id: 7,
            type: "user",
            severity: "info",
            title: "New Lecturer Account",
            message: "New lecturer account created for Dr. Ahmad Wijaya. Pending verification and face dataset upload.",
            timestamp: "2025-05-14T16:45:12",
            read: true,
            actionRequired: false,
        },
        {
            id: 8,
            type: "system",
            severity: "info",
            title: "System Update Available",
            message: "A new system update (v2.5.4) is available with security enhancements. Schedule installation when convenient.",
            timestamp: "2025-05-14T14:22:37",
            read: true,
            actionRequired: false,
        }
    ];

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case "critical":
                return <MdError className="h-5 w-5 text-red-600" />;
            case "error":
                return <MdError className="h-5 w-5 text-red-500" />;
            case "warning":
                return <MdWarning className="h-5 w-5 text-yellow-500" />;
            case "info":
                return <MdInfo className="h-5 w-5 text-blue-500" />;
            default:
                return <MdInfo className="h-5 w-5 text-gray-500" />;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "security":
                return <MdSecurity className="h-5 w-5 text-purple-500" />;
            case "system":
                return <MdSettings className="h-5 w-5 text-blue-500" />;
            case "user":
                return <MdPeople className="h-5 w-5 text-green-500" />;
            case "hardware":
                return <MdAccessTime className="h-5 w-5 text-orange-500" />;
            default:
                return <MdInfo className="h-5 w-5 text-gray-500" />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "critical":
                return "border-red-500";
            case "error":
                return "border-red-400";
            case "warning":
                return "border-yellow-400";
            case "info":
                return "border-blue-400";
            default:
                return "border-gray-300";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Format as: 15 May 2025, 15:45
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
        if (selectedNotification && selectedNotification.id === id) {
            setSelectedNotification(null);
        }
    };

    const deleteAllNotifications = () => {
        setNotifications([]);
        setSelectedNotification(null);
    };

    const filterNotifications = (tab) => {
        if (tab === "all") return notifications;
        if (tab === "unread") return notifications.filter(n => !n.read);
        if (tab === "actionRequired") return notifications.filter(n => n.actionRequired);
        return notifications.filter(n => n.type === tab);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Notification Center</h1>
                <p className="text-gray-600">Manage system alerts and notifications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Notifications List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md h-full flex flex-col" data-aos="fade-up">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={markAllAsRead}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Mark all as read"
                                >
                                    <MdMarkEmailRead className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={deleteAllNotifications}
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete all"
                                >
                                    <MdDelete className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-100 px-4 py-2 flex overflow-x-auto hide-scrollbar">
                            <button
                                className={`px-3 py-1 text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'bg-blue-600 text-white rounded-full' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All
                            </button>
                            <button
                                className={`px-3 py-1 text-sm font-medium whitespace-nowrap ${activeTab === 'unread' ? 'bg-blue-600 text-white rounded-full' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setActiveTab('unread')}
                            >
                                Unread
                            </button>
                            <button
                                className={`px-3 py-1 text-sm font-medium whitespace-nowrap ${activeTab === 'actionRequired' ? 'bg-blue-600 text-white rounded-full' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setActiveTab('actionRequired')}
                            >
                                Action Required
                            </button>
                            <button
                                className={`px-3 py-1 text-sm font-medium whitespace-nowrap ${activeTab === 'security' ? 'bg-blue-600 text-white rounded-full' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setActiveTab('security')}
                            >
                                Security
                            </button>
                            <button
                                className={`px-3 py-1 text-sm font-medium whitespace-nowrap ${activeTab === 'system' ? 'bg-blue-600 text-white rounded-full' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setActiveTab('system')}
                            >
                                System
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto divide-y divide-gray-200">
                            {filterNotifications(activeTab).length > 0 ? (
                                filterNotifications(activeTab).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${!notification.read ? 'bg-blue-50 hover:bg-blue-100' : ''} ${selectedNotification?.id === notification.id ? 'border-l-4 border-blue-500 pl-3' : ''}`}
                                        onClick={() => {
                                            setSelectedNotification(notification);
                                            if (!notification.read) markAsRead(notification.id);
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start">
                                                <div className={`flex-shrink-0 rounded-full p-1 ${notification.severity === 'critical' || notification.severity === 'error' ? 'bg-red-100' :
                                                        notification.severity === 'warning' ? 'bg-yellow-100' :
                                                            'bg-blue-100'
                                                    }`}>
                                                    {getSeverityIcon(notification.severity)}
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className={`text-sm font-semibold ${!notification.read ? 'text-blue-800' : 'text-gray-800'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDate(notification.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                                    <MdNotifications className="h-10 w-10 text-gray-300 mb-2" />
                                    <p className="text-gray-500">No notifications found</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
                            {filterNotifications(activeTab).length} notifications - {notifications.filter(n => !n.read).length} unread
                        </div>
                    </div>
                </div>

                {/* Notification Detail */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md h-full" data-aos="fade-up" data-aos-delay="100">
                        {selectedNotification ? (
                            <div className="h-full flex flex-col">
                                <div className={`p-6 border-b ${getSeverityColor(selectedNotification.severity)} border-b-2`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-full ${selectedNotification.severity === 'critical' || selectedNotification.severity === 'error' ? 'bg-red-100' :
                                                    selectedNotification.severity === 'warning' ? 'bg-yellow-100' :
                                                        'bg-blue-100'
                                                }`}>
                                                {getSeverityIcon(selectedNotification.severity)}
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-800 ml-2">{selectedNotification.title}</h2>
                                        </div>
                                        <div className="flex space-x-2">
                                            {!selectedNotification.read && (
                                                <button
                                                    onClick={() => markAsRead(selectedNotification.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Mark as read"
                                                >
                                                    <MdMarkEmailRead className="h-5 w-5" />
                                                </button>
                                            )}
                                            {selectedNotification.read && (
                                                <button
                                                    onClick={() => {
                                                        setNotifications(notifications.map(n =>
                                                            n.id === selectedNotification.id ? { ...n, read: false } : n
                                                        ));
                                                    }}
                                                    className="text-gray-600 hover:text-gray-800"
                                                    title="Mark as unread"
                                                >
                                                    <MdOutlineMarkEmailUnread className="h-5 w-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(selectedNotification.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete"
                                            >
                                                <MdDelete className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-grow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500">Timestamp</p>
                                            <p className="text-sm font-medium">{formatDate(selectedNotification.timestamp)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Type</p>
                                            <div className="flex items-center">
                                                {getTypeIcon(selectedNotification.type)}
                                                <p className="text-sm font-medium ml-1 capitalize">{selectedNotification.type}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Severity</p>
                                            <div className="flex items-center">
                                                {getSeverityIcon(selectedNotification.severity)}
                                                <p className={`text-sm font-medium ml-1 capitalize ${selectedNotification.severity === 'critical' || selectedNotification.severity === 'error' ? 'text-red-600' :
                                                        selectedNotification.severity === 'warning' ? 'text-yellow-600' :
                                                            'text-blue-600'
                                                    }`}>
                                                    {selectedNotification.severity}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Action Required</p>
                                            <p className="text-sm font-medium">{selectedNotification.actionRequired ? "Yes" : "No"}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-sm text-gray-500 mb-2">Message</p>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm">{selectedNotification.message}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Recommended Actions</p>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            {selectedNotification.type === 'security' && selectedNotification.severity === 'critical' && (
                                                <ul className="list-disc pl-5 text-sm space-y-1">
                                                    <li>Check system logs for unauthorized access attempts</li>
                                                    <li>Investigate the source IP address</li>
                                                    <li>Consider temporarily disabling the affected account</li>
                                                    <li>Update security policies if necessary</li>
                                                </ul>
                                            )}

                                            {selectedNotification.type === 'system' && selectedNotification.severity === 'warning' && (
                                                <ul className="list-disc pl-5 text-sm space-y-1">
                                                    <li>Clean up temporary files and logs</li>
                                                    <li>Archive old attendance records</li>
                                                    <li>Check for and remove unused face datasets</li>
                                                    <li>Consider upgrading storage capacity if issues persist</li>
                                                </ul>
                                            )}

                                            {selectedNotification.type === 'hardware' && (
                                                <ul className="list-disc pl-5 text-sm space-y-1">
                                                    <li>Check physical camera connections</li>
                                                    <li>Restart the camera device</li>
                                                    <li>Verify network connectivity to the device</li>
                                                    <li>Schedule maintenance if issues persist</li>
                                                </ul>
                                            )}

                                            {selectedNotification.type === 'system' && selectedNotification.severity === 'error' && (
                                                <ul className="list-disc pl-5 text-sm space-y-1">
                                                    <li>Check backup storage permissions</li>
                                                    <li>Verify backup configuration settings</li>
                                                    <li>Ensure sufficient storage space is available</li>
                                                    <li>Manually initiate backup after resolving the issue</li>
                                                </ul>
                                            )}

                                            {selectedNotification.type === 'user' && (
                                                <ul className="list-disc pl-5 text-sm space-y-1">
                                                    <li>No immediate action required</li>
                                                    <li>Review imported user data for accuracy</li>
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-200 flex justify-end">
                                    <div className="flex space-x-3">
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                            Dismiss
                                        </button>
                                        {selectedNotification.actionRequired && (
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Take Action
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                <MdNotifications className="h-16 w-16 mb-4" />
                                <p className="text-lg">Select a notification to view details</p>
                                <p className="text-sm mt-2 text-center max-w-md">System notifications and alerts will appear here. Click on any notification from the list to view complete details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800 mb-3">Email Notifications</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">Security Alerts</label>
                                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">System Warnings</label>
                                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">User Management</label>
                                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">Hardware Status</label>
                                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800 mb-3">Push Notifications</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">Security Alerts</label>
                                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">System Warnings</label>
                                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">User Management</label>
                                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">Hardware Status</label>
                                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800 mb-3">Alert Preferences</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">Minimum Severity</label>
                                <select className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="info">Info</option>
                                    <option value="warning">Warning</option>
                                    <option value="error">Error</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-700">Auto-delete After</label>
                                <select className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="7">7 days</option>
                                    <option value="14">14 days</option>
                                    <option value="30">30 days</option>
                                    <option value="never">Never</option>
                                </select>
                            </div>
                            <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
