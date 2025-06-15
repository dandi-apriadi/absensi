import React, { useEffect, useState } from "react";
import { MdMonitor, MdSpeed, MdMemory, MdStorage, MdNetworkWifi, MdCamera, MdLock, MdWarning, MdRefresh, MdTaskAlt, MdError, MdDeviceHub, MdMeetingRoom, MdCameraAlt, MdPowerSettingsNew, MdRestartAlt, MdGpsFixed } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const HardwareMonitoring = () => {
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(30); // seconds
    const [countdown, setCountdown] = useState(refreshInterval);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [expandedRoom, setExpandedRoom] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });

        refreshData();
    }, []);

    // Countdown logic for auto refresh
    useEffect(() => {
        let timer;
        if (autoRefresh) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        refreshData();
                        return refreshInterval;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [autoRefresh, refreshInterval]);

    const refreshData = () => {
        setLastUpdated(new Date());
        setCountdown(refreshInterval);
        // In a real application, this would fetch the latest data from an API
    };

    // Dummy data for rooms and devices
    const roomsData = [
        {
            id: 1,
            name: "Lab Komputer 1",
            status: "online",
            devices: [
                {
                    id: 101,
                    name: "Door Controller",
                    type: "door",
                    status: "online",
                    lastPing: "15 seconds ago",
                    uptime: "42 days, 5 hours",
                    load: 12,
                    cpu: 8,
                    memory: 22,
                    temperature: 36.4,
                    firmware: "v3.2.1",
                    ipAddress: "192.168.1.101",
                    macAddress: "AA:BB:CC:DD:EE:FF",
                    issues: 0
                },
                {
                    id: 102,
                    name: "Face Recognition Camera",
                    type: "camera",
                    status: "online",
                    lastPing: "5 seconds ago",
                    uptime: "42 days, 5 hours",
                    load: 45,
                    cpu: 38,
                    memory: 64,
                    temperature: 42.1,
                    firmware: "v2.5.0",
                    ipAddress: "192.168.1.102",
                    macAddress: "AA:BB:CC:DD:EE:00",
                    issues: 0
                },
                {
                    id: 103,
                    name: "Edge Computing Unit",
                    type: "computer",
                    status: "online",
                    lastPing: "8 seconds ago",
                    uptime: "42 days, 5 hours",
                    load: 32,
                    cpu: 25,
                    memory: 48,
                    temperature: 45.7,
                    firmware: "v1.9.3",
                    ipAddress: "192.168.1.103",
                    macAddress: "AA:BB:CC:DD:FF:00",
                    issues: 0
                }
            ]
        },
        {
            id: 2,
            name: "Lab Komputer 2",
            status: "online",
            devices: [
                {
                    id: 201,
                    name: "Door Controller",
                    type: "door",
                    status: "online",
                    lastPing: "12 seconds ago",
                    uptime: "32 days, 2 hours",
                    load: 10,
                    cpu: 7,
                    memory: 20,
                    temperature: 35.8,
                    firmware: "v3.2.1",
                    ipAddress: "192.168.1.201",
                    macAddress: "BB:CC:DD:EE:FF:00",
                    issues: 0
                },
                {
                    id: 202,
                    name: "Face Recognition Camera",
                    type: "camera",
                    status: "warning",
                    lastPing: "45 seconds ago",
                    uptime: "16 hours",
                    load: 85,
                    cpu: 72,
                    memory: 89,
                    temperature: 58.3,
                    firmware: "v2.5.0",
                    ipAddress: "192.168.1.202",
                    macAddress: "BB:CC:DD:EE:FF:01",
                    issues: 2
                },
                {
                    id: 203,
                    name: "Edge Computing Unit",
                    type: "computer",
                    status: "online",
                    lastPing: "18 seconds ago",
                    uptime: "32 days, 2 hours",
                    load: 42,
                    cpu: 38,
                    memory: 56,
                    temperature: 47.2,
                    firmware: "v1.9.3",
                    ipAddress: "192.168.1.203",
                    macAddress: "BB:CC:DD:EE:FF:02",
                    issues: 0
                }
            ]
        },
        {
            id: 3,
            name: "Ruang 2.01",
            status: "online",
            devices: [
                {
                    id: 301,
                    name: "Door Controller",
                    type: "door",
                    status: "online",
                    lastPing: "20 seconds ago",
                    uptime: "22 days, 8 hours",
                    load: 9,
                    cpu: 6,
                    memory: 18,
                    temperature: 34.6,
                    firmware: "v3.2.1",
                    ipAddress: "192.168.1.301",
                    macAddress: "CC:DD:EE:FF:00:01",
                    issues: 0
                },
                {
                    id: 302,
                    name: "Face Recognition Camera",
                    type: "camera",
                    status: "online",
                    lastPing: "8 seconds ago",
                    uptime: "22 days, 8 hours",
                    load: 38,
                    cpu: 32,
                    memory: 54,
                    temperature: 41.5,
                    firmware: "v2.5.0",
                    ipAddress: "192.168.1.302",
                    macAddress: "CC:DD:EE:FF:00:02",
                    issues: 0
                }
            ]
        },
        {
            id: 4,
            name: "Ruang 2.02",
            status: "offline",
            devices: [
                {
                    id: 401,
                    name: "Door Controller",
                    type: "door",
                    status: "offline",
                    lastPing: "5 hours ago",
                    uptime: "0",
                    load: 0,
                    cpu: 0,
                    memory: 0,
                    temperature: 0,
                    firmware: "v3.2.1",
                    ipAddress: "192.168.1.401",
                    macAddress: "DD:EE:FF:00:01:02",
                    issues: 1
                },
                {
                    id: 402,
                    name: "Face Recognition Camera",
                    type: "camera",
                    status: "offline",
                    lastPing: "5 hours ago",
                    uptime: "0",
                    load: 0,
                    cpu: 0,
                    memory: 0,
                    temperature: 0,
                    firmware: "v2.5.0",
                    ipAddress: "192.168.1.402",
                    macAddress: "DD:EE:FF:00:01:03",
                    issues: 1
                }
            ]
        },
        {
            id: 5,
            name: "Lab Jaringan",
            status: "warning",
            devices: [
                {
                    id: 501,
                    name: "Door Controller",
                    type: "door",
                    status: "online",
                    lastPing: "25 seconds ago",
                    uptime: "12 days, 3 hours",
                    load: 15,
                    cpu: 10,
                    memory: 25,
                    temperature: 38.9,
                    firmware: "v3.2.0",
                    ipAddress: "192.168.1.501",
                    macAddress: "EE:FF:00:01:02:03",
                    issues: 0
                },
                {
                    id: 502,
                    name: "Face Recognition Camera",
                    type: "camera",
                    status: "warning",
                    lastPing: "1 minute ago",
                    uptime: "12 days, 3 hours",
                    load: 75,
                    cpu: 65,
                    memory: 82,
                    temperature: 55.2,
                    firmware: "v2.4.9",
                    ipAddress: "192.168.1.502",
                    macAddress: "EE:FF:00:01:02:04",
                    issues: 1
                },
                {
                    id: 503,
                    name: "Edge Computing Unit",
                    type: "computer",
                    status: "online",
                    lastPing: "18 seconds ago",
                    uptime: "12 days, 3 hours",
                    load: 48,
                    cpu: 42,
                    memory: 63,
                    temperature: 49.5,
                    firmware: "v1.9.2",
                    ipAddress: "192.168.1.503",
                    macAddress: "EE:FF:00:01:02:05",
                    issues: 0
                }
            ]
        },
    ];

    // Get device type icon
    const getDeviceTypeIcon = (type) => {
        switch (type) {
            case "door":
                return <MdLock className="h-5 w-5" />;
            case "camera":
                return <MdCameraAlt className="h-5 w-5" />;
            case "computer":
                return <MdMemory className="h-5 w-5" />;
            default:
                return <MdDeviceHub className="h-5 w-5" />;
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "online":
                return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center"><MdTaskAlt className="mr-1 h-3 w-3" /> Online</span>;
            case "offline":
                return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center"><MdError className="mr-1 h-3 w-3" /> Offline</span>;
            case "warning":
                return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center"><MdWarning className="mr-1 h-3 w-3" /> Warning</span>;
            default:
                return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
        }
    };

    // Toggle room expansion
    const toggleRoomExpand = (roomId) => {
        if (expandedRoom === roomId) {
            setExpandedRoom(null);
        } else {
            setExpandedRoom(roomId);
            setSelectedDevice(null);
        }
    };

    // Show device details
    const showDeviceDetails = (device) => {
        setSelectedDevice(device);
    };

    // Restart device (simulated)
    const restartDevice = (deviceId) => {
        alert(`Restarting device ID: ${deviceId}. This action would send a restart command to the physical device.`);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Hardware Monitoring</h1>
                <p className="text-gray-600">Monitor and manage all connected hardware devices</p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div
                    className="bg-white rounded-xl shadow-md p-6"
                    data-aos="fade-up"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Devices</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                {roomsData.reduce((sum, room) => sum + room.devices.length, 0)}
                            </h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <MdDeviceHub className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Across {roomsData.length} rooms</span>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-md p-6"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Online Devices</p>
                            <h3 className="text-2xl font-bold text-green-600 mt-1">
                                {roomsData.reduce((sum, room) => sum + room.devices.filter(d => d.status === "online").length, 0)}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <MdTaskAlt className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Functioning normally</span>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-md p-6"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Warning Status</p>
                            <h3 className="text-2xl font-bold text-yellow-600 mt-1">
                                {roomsData.reduce((sum, room) => sum + room.devices.filter(d => d.status === "warning").length, 0)}
                            </h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <MdWarning className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Need attention</span>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-md p-6"
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Offline Devices</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">
                                {roomsData.reduce((sum, room) => sum + room.devices.filter(d => d.status === "offline").length, 0)}
                            </h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <MdError className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Require immediate attention</span>
                    </div>
                </div>
            </div>

            {/* Refresh Controls */}
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap items-center justify-between mb-6" data-aos="fade-up" data-aos-delay="400">
                <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Last Updated: {lastUpdated.toLocaleTimeString()}</span>
                    <button
                        onClick={refreshData}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    >
                        <MdRefresh className="h-5 w-5" />
                    </button>
                    {autoRefresh && (
                        <span className="ml-2 text-xs text-gray-500">Auto-refresh in {countdown}s</span>
                    )}
                </div>

                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="auto-refresh"
                            checked={autoRefresh}
                            onChange={() => setAutoRefresh(!autoRefresh)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="auto-refresh" className="ml-2 text-sm text-gray-700">Auto Refresh</label>
                    </div>

                    <select
                        value={refreshInterval}
                        onChange={(e) => {
                            setRefreshInterval(Number(e.target.value));
                            setCountdown(Number(e.target.value));
                        }}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="10">10s</option>
                        <option value="30">30s</option>
                        <option value="60">1min</option>
                        <option value="300">5min</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rooms List */}
                <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="500">
                    <div className="bg-white rounded-xl shadow-md p-4 h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Rooms & Devices</h2>
                        <div className="space-y-4">
                            {roomsData.map((room) => (
                                <div key={room.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        className={`w-full flex items-center justify-between p-4 text-left ${room.status === "offline" ? "bg-red-50" :
                                                room.status === "warning" ? "bg-yellow-50" : "bg-green-50"
                                            }`}
                                        onClick={() => toggleRoomExpand(room.id)}
                                    >
                                        <div className="flex items-center">
                                            <MdMeetingRoom className={`h-5 w-5 mr-2 ${room.status === "offline" ? "text-red-600" :
                                                    room.status === "warning" ? "text-yellow-600" : "text-green-600"
                                                }`} />
                                            <span className="font-medium">{room.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xs mr-2">{room.devices.length} devices</span>
                                            {getStatusBadge(room.status)}
                                            <svg
                                                className={`h-5 w-5 ml-2 transform transition-transform ${expandedRoom === room.id ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    {expandedRoom === room.id && (
                                        <div className="p-4 border-t border-gray-200 divide-y divide-gray-100">
                                            {room.devices.map((device) => (
                                                <div
                                                    key={device.id}
                                                    className={`py-2 cursor-pointer hover:bg-gray-50 ${selectedDevice?.id === device.id ? 'bg-blue-50' : ''}`}
                                                    onClick={() => showDeviceDetails(device)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            {getDeviceTypeIcon(device.type)}
                                                            <span className="ml-2 text-sm">{device.name}</span>
                                                        </div>
                                                        {getStatusBadge(device.status)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Device Details */}
                <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="600">
                    <div className="bg-white rounded-xl shadow-md p-6 h-full">
                        {selectedDevice ? (
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center">
                                            {getDeviceTypeIcon(selectedDevice.type)}
                                            <h2 className="text-xl font-semibold text-gray-800 ml-2">{selectedDevice.name}</h2>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            ID: {selectedDevice.id} | Last Ping: {selectedDevice.lastPing}
                                        </p>
                                    </div>
                                    <div>
                                        {getStatusBadge(selectedDevice.status)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Performance</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-gray-500">CPU Usage</span>
                                                    <span className="text-xs font-medium">{selectedDevice.cpu}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${selectedDevice.cpu > 80 ? 'bg-red-500' :
                                                                selectedDevice.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${selectedDevice.cpu}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-gray-500">Memory Usage</span>
                                                    <span className="text-xs font-medium">{selectedDevice.memory}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${selectedDevice.memory > 80 ? 'bg-red-500' :
                                                                selectedDevice.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${selectedDevice.memory}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-gray-500">System Load</span>
                                                    <span className="text-xs font-medium">{selectedDevice.load}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${selectedDevice.load > 80 ? 'bg-red-500' :
                                                                selectedDevice.load > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${selectedDevice.load}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">System Information</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">Temperature</span>
                                                <span className={`text-xs font-medium ${selectedDevice.temperature > 55 ? 'text-red-600' :
                                                        selectedDevice.temperature > 45 ? 'text-yellow-600' : 'text-green-600'
                                                    }`}>
                                                    {selectedDevice.temperature}°C
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">Uptime</span>
                                                <span className="text-xs font-medium">{selectedDevice.uptime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">Firmware Version</span>
                                                <span className="text-xs font-medium">{selectedDevice.firmware}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">IP Address</span>
                                                <span className="text-xs font-medium">{selectedDevice.ipAddress}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">MAC Address</span>
                                                <span className="text-xs font-medium">{selectedDevice.macAddress}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">Issues</span>
                                                <span className={`text-xs font-medium ${selectedDevice.issues > 0 ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                    {selectedDevice.issues} {selectedDevice.issues === 1 ? 'issue' : 'issues'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Actions</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                                            onClick={() => { }}
                                        >
                                            <MdGpsFixed className="mr-1" /> Ping Device
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                                            onClick={() => { }}
                                        >
                                            <MdRefresh className="mr-1" /> Check Status
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center"
                                            onClick={() => restartDevice(selectedDevice.id)}
                                        >
                                            <MdRestartAlt className="mr-1" /> Restart Device
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                                            onClick={() => { }}
                                        >
                                            <MdPowerSettingsNew className="mr-1" /> Power Cycle
                                        </button>
                                    </div>
                                </div>

                                {/* Logs & History */}
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Logs</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto">
                                        <div className="text-xs space-y-2">
                                            <div className="flex">
                                                <span className="text-gray-400 w-32">2025-05-15 15:45:22</span>
                                                <span className="text-gray-700">Status check: Online</span>
                                            </div>
                                            <div className="flex">
                                                <span className="text-gray-400 w-32">2025-05-15 15:30:10</span>
                                                <span className="text-gray-700">Memory usage: 64%</span>
                                            </div>
                                            <div className="flex">
                                                <span className="text-gray-400 w-32">2025-05-15 15:15:05</span>
                                                <span className="text-gray-700">Temperature: 42.1°C</span>
                                            </div>
                                            <div className="flex">
                                                <span className="text-gray-400 w-32">2025-05-15 15:00:00</span>
                                                <span className="text-gray-700">Automatic system check completed</span>
                                            </div>
                                            <div className="flex">
                                                <span className="text-gray-400 w-32">2025-05-15 14:45:33</span>
                                                <span className="text-gray-700">CPU usage: 38%</span>
                                            </div>
                                            <div className="flex">
                                                <span className="text-gray-400 w-32">2025-05-15 14:30:22</span>
                                                <span className="text-gray-700">Network connectivity: Good</span>
                                            </div>
                                            <div className="flex">
                                                <span className="text-gray-400 w-32">2025-05-15 14:15:18</span>
                                                <span className="text-gray-700">System load: 45%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <MdDeviceHub className="h-16 w-16 mb-4" />
                                <p className="text-lg">Select a device to view details</p>
                                <p className="text-sm mt-2">Hardware status and controls will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overall System Health */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="700">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">System Health Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                        <div className="flex items-center">
                            <MdNetworkWifi className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="text-sm font-medium text-gray-800">Network Status</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-blue-600">Good</p>
                        <p className="text-xs text-gray-500 mt-1">Avg. Latency: 5ms</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                        <div className="flex items-center">
                            <MdSpeed className="h-5 w-5 text-green-600 mr-2" />
                            <h3 className="text-sm font-medium text-gray-800">System Load</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-green-600">32%</p>
                        <p className="text-xs text-gray-500 mt-1">Normal operation</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                        <div className="flex items-center">
                            <MdStorage className="h-5 w-5 text-purple-600 mr-2" />
                            <h3 className="text-sm font-medium text-gray-800">Storage</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-purple-600">43%</p>
                        <p className="text-xs text-gray-500 mt-1">248 GB free</p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
                        <div className="flex items-center">
                            <MdMemory className="h-5 w-5 text-yellow-600 mr-2" />
                            <h3 className="text-sm font-medium text-gray-800">Avg Memory</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-yellow-600">54%</p>
                        <p className="text-xs text-gray-500 mt-1">Across all devices</p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">Total system health is currently rated as <span className="font-medium text-green-600">Good</span>. Next scheduled maintenance: 2025-06-01.</p>
                </div>
            </div>
        </div>
    );
};

export default HardwareMonitoring;
