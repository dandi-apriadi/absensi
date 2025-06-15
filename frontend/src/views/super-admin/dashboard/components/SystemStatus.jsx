import React from "react";
import { MdCheckCircle, MdWarning, MdError, MdSpeed, MdMemory, MdStorage, MdNetworkWifi } from "react-icons/md";

const SystemStatus = () => {
    // Mock data for system components
    const systemComponents = [
        {
            name: "Face Recognition Engine",
            status: "operational",
            metric: "Response time: 350ms",
            uptime: "99.98%",
            lastIssue: "None"
        },
        {
            name: "Database Server",
            status: "operational",
            metric: "Load: 22%",
            uptime: "99.99%",
            lastIssue: "3 days ago"
        },
        {
            name: "API Gateway",
            status: "operational",
            metric: "Requests: 280/min",
            uptime: "99.95%",
            lastIssue: "None"
        },
        {
            name: "Authentication Service",
            status: "operational",
            metric: "Success rate: 99.9%",
            uptime: "99.97%",
            lastIssue: "5 days ago"
        },
        {
            name: "Storage System",
            status: "warning",
            metric: "Usage: 87%",
            uptime: "99.99%",
            lastIssue: "Current"
        },
        {
            name: "Background Workers",
            status: "operational",
            metric: "Queue depth: 12",
            uptime: "99.90%",
            lastIssue: "2 weeks ago"
        }
    ];

    const resourceMetrics = {
        cpu: 32,
        memory: 64,
        disk: 87,
        network: 28
    };

    // Get status icon based on component status
    const getStatusIcon = (status) => {
        switch (status) {
            case "operational":
                return <MdCheckCircle className="h-5 w-5 text-green-500" />;
            case "warning":
                return <MdWarning className="h-5 w-5 text-yellow-500" />;
            case "error":
                return <MdError className="h-5 w-5 text-red-500" />;
            default:
                return <MdCheckCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    // Get status text with appropriate color
    const getStatusText = (status) => {
        switch (status) {
            case "operational":
                return <span className="text-green-600">Operational</span>;
            case "warning":
                return <span className="text-yellow-600">Warning</span>;
            case "error":
                return <span className="text-red-600">Error</span>;
            default:
                return <span className="text-gray-600">Unknown</span>;
        }
    };

    // Generate resource usage bar with appropriate colors
    const getResourceBar = (value) => {
        let color = "bg-green-500";
        if (value > 80) color = "bg-red-500";
        else if (value > 60) color = "bg-yellow-500";

        return (
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }}></div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">System Health Status</h3>
            </div>

            <div className="p-6">
                {/* Overall System Status */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700">Overall System Status</h4>
                        <div className="flex items-center mt-1">
                            <MdCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-lg font-semibold text-green-700">All Systems Operational</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Last updated</p>
                        <p className="text-sm font-medium">3 minutes ago</p>
                    </div>
                </div>

                {/* Resource Usage */}
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <MdSpeed className="h-4 w-4 text-blue-500 mr-1" />
                                <span className="text-xs text-gray-600">CPU</span>
                            </div>
                            <span className="text-xs font-medium">{resourceMetrics.cpu}%</span>
                        </div>
                        {getResourceBar(resourceMetrics.cpu)}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <MdMemory className="h-4 w-4 text-purple-500 mr-1" />
                                <span className="text-xs text-gray-600">Memory</span>
                            </div>
                            <span className="text-xs font-medium">{resourceMetrics.memory}%</span>
                        </div>
                        {getResourceBar(resourceMetrics.memory)}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <MdStorage className="h-4 w-4 text-orange-500 mr-1" />
                                <span className="text-xs text-gray-600">Disk</span>
                            </div>
                            <span className="text-xs font-medium">{resourceMetrics.disk}%</span>
                        </div>
                        {getResourceBar(resourceMetrics.disk)}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <MdNetworkWifi className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-xs text-gray-600">Network</span>
                            </div>
                            <span className="text-xs font-medium">{resourceMetrics.network}%</span>
                        </div>
                        {getResourceBar(resourceMetrics.network)}
                    </div>
                </div>

                {/* Component Status Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Issue</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {systemComponents.map((component, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{component.name}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(component.status)}
                                            <span className="ml-2 text-sm">{getStatusText(component.status)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{component.metric}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{component.uptime}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{component.lastIssue}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 text-right">
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded hover:bg-blue-100 transition-colors">
                        View Detailed Status
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;
