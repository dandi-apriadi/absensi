import React, { useEffect, useState } from "react";
import { MdLock, MdLockOpen, MdRefresh, MdWarning, MdPerson, MdDoorbell, MdDoorFront, MdDoorSliding } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const AccessMonitoring = () => {
    const [refreshInterval, setRefreshInterval] = useState(30); // seconds
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const [countdown, setCountdown] = useState(refreshInterval);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState("all");

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Countdown logic
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

    // Mock refresh function
    const refreshData = () => {
        setLastRefreshed(new Date());
        // Here you would typically fetch the latest door status data
    };

    // Dummy data for room monitoring
    const roomsData = [
        {
            id: "lab1",
            name: "Lab Komputer 1",
            status: "Locked",
            doorState: "Closed",
            lastAccess: "15:32:45",
            lastAccessBy: "Ahmad Fauzi (2021010101)",
            currentOccupancy: 23,
            maxOccupancy: 40,
            online: true,
            temperature: "24°C",
            humidity: "45%",
            warnings: 0,
            cameraStatus: "Online",
            nextScheduledAccess: "16:00 - Dr. Budi Santoso"
        },
        {
            id: "lab2",
            name: "Lab Komputer 2",
            status: "Unlocked",
            doorState: "Open",
            lastAccess: "15:45:12",
            lastAccessBy: "Dr. Budi Santoso (Dosen)",
            currentOccupancy: 18,
            maxOccupancy: 30,
            online: true,
            temperature: "23°C",
            humidity: "48%",
            warnings: 0,
            cameraStatus: "Online",
            nextScheduledAccess: "17:30 - Automatic Lock"
        },
        {
            id: "r201",
            name: "Ruang 2.01",
            status: "Locked",
            doorState: "Closed",
            lastAccess: "14:15:33",
            lastAccessBy: "Siti Nurhaliza (2021010102)",
            currentOccupancy: 0,
            maxOccupancy: 25,
            online: true,
            temperature: "25°C",
            humidity: "42%",
            warnings: 0,
            cameraStatus: "Online",
            nextScheduledAccess: "Tomorrow 08:30 - Dr. Indah Permata"
        },
        {
            id: "r202",
            name: "Ruang 2.02",
            status: "Unknown",
            doorState: "Unknown",
            lastAccess: "09:22:18",
            lastAccessBy: "System Admin",
            currentOccupancy: 0,
            maxOccupancy: 25,
            online: false,
            temperature: "Unknown",
            humidity: "Unknown",
            warnings: 1,
            cameraStatus: "Offline",
            nextScheduledAccess: "Maintenance Required"
        },
        {
            id: "labnet",
            name: "Lab Jaringan",
            status: "Locked",
            doorState: "Ajar",
            lastAccess: "13:05:51",
            lastAccessBy: "Indah Permata (2020010101)",
            currentOccupancy: 12,
            maxOccupancy: 20,
            online: true,
            temperature: "22°C",
            humidity: "50%",
            warnings: 2,
            cameraStatus: "Warning",
            nextScheduledAccess: "16:30 - Dr. Ahmad Wijaya"
        },
        {
            id: "r301",
            name: "Ruang 3.01",
            status: "Locked",
            doorState: "Closed",
            lastAccess: "11:47:22",
            lastAccessBy: "Dr. Ahmad Wijaya (Dosen)",
            currentOccupancy: 0,
            maxOccupancy: 30,
            online: true,
            temperature: "24°C",
            humidity: "46%",
            warnings: 0,
            cameraStatus: "Online",
            nextScheduledAccess: "Tomorrow 10:00 - Dr. Siti Aisyah"
        }
    ];

    // Filter rooms based on selection
    const displayRooms = selectedRoom === "all"
        ? roomsData
        : roomsData.filter(room => room.id === selectedRoom);

    const getStatusColor = (status) => {
        switch (status) {
            case "Locked":
                return "text-red-500";
            case "Unlocked":
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Locked":
                return <MdLock className="h-5 w-5" />;
            case "Unlocked":
                return <MdLockOpen className="h-5 w-5" />;
            default:
                return <MdWarning className="h-5 w-5" />;
        }
    };

    const getDoorStateColor = (state) => {
        switch (state) {
            case "Closed":
                return "bg-green-100 text-green-800";
            case "Open":
                return "bg-blue-100 text-blue-800";
            case "Ajar":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getOnlineStatusIndicator = (isOnline) => {
        return isOnline
            ? <span className="flex items-center text-green-600"><span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Online</span>
            : <span className="flex items-center text-red-600"><span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span> Offline</span>;
    };

    const getCameraStatusIndicator = (status) => {
        switch (status) {
            case "Online":
                return <span className="flex items-center text-green-600"><span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Online</span>;
            case "Offline":
                return <span className="flex items-center text-red-600"><span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span> Offline</span>;
            case "Warning":
                return <span className="flex items-center text-yellow-600"><span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span> Warning</span>;
            default:
                return <span className="flex items-center text-gray-600"><span className="h-2 w-2 rounded-full bg-gray-500 mr-1"></span> Unknown</span>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Monitoring Akses Realtime</h1>
                <p className="text-gray-600">Status pintu dan aktivitas ruangan saat ini</p>
            </div>

            {/* Controls Bar */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6" data-aos="fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-3">
                            Last Updated: {lastRefreshed.toLocaleTimeString()}
                        </span>
                        <button
                            onClick={refreshData}
                            className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200 transition-colors"
                        >
                            <MdRefresh className="h-5 w-5" />
                        </button>
                        <span className="ml-3 text-sm text-gray-500">
                            {autoRefresh ? `Auto-refresh in ${countdown}s` : 'Auto-refresh off'}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="autoRefresh"
                                checked={autoRefresh}
                                onChange={() => setAutoRefresh(!autoRefresh)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-700">
                                Auto Refresh
                            </label>
                        </div>

                        <div>
                            <select
                                value={refreshInterval}
                                onChange={(e) => {
                                    setRefreshInterval(Number(e.target.value));
                                    setCountdown(Number(e.target.value));
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="10">10s</option>
                                <option value="30">30s</option>
                                <option value="60">1min</option>
                                <option value="300">5min</option>
                            </select>
                        </div>

                        <div>
                            <select
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Rooms</option>
                                {roomsData.map(room => (
                                    <option key={room.id} value={room.id}>{room.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Monitoring Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {displayRooms.map((room) => (
                    <div
                        key={room.id}
                        className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${room.online
                                ? room.warnings > 0
                                    ? "border-yellow-500"
                                    : "border-green-500"
                                : "border-red-500"
                            }`}
                        data-aos="fade-up"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
                                    <div className="mt-1 flex items-center">
                                        {getOnlineStatusIndicator(room.online)}
                                        {room.warnings > 0 && (
                                            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                                                <MdWarning className="h-3 w-3 mr-1" /> {room.warnings} issues
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`flex items-center ${getStatusColor(room.status)}`}>
                                    {getStatusIcon(room.status)}
                                    <span className="ml-1 font-medium">{room.status}</span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Door State</p>
                                    <div className="mt-1 flex items-center">
                                        <MdDoorFront className="h-5 w-5 text-gray-400 mr-1" />
                                        <span className={`text-sm px-2 py-0.5 rounded-full ${getDoorStateColor(room.doorState)}`}>
                                            {room.doorState}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Camera</p>
                                    <div className="mt-1 text-sm">
                                        {getCameraStatusIndicator(room.cameraStatus)}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Occupancy</p>
                                    <div className="mt-1 flex items-center">
                                        <MdPerson className="h-5 w-5 text-gray-400 mr-1" />
                                        <span className="text-sm font-medium">{room.currentOccupancy} / {room.maxOccupancy}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Last Access</p>
                                    <p className="mt-1 text-sm">{room.lastAccess}</p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Last Accessed By</p>
                                    <p className="mt-1 text-sm truncate" title={room.lastAccessBy}>{room.lastAccessBy}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Temperature</p>
                                    <p className="mt-1 text-sm">{room.temperature}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Humidity</p>
                                    <p className="mt-1 text-sm">{room.humidity}</p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Next Scheduled Access</p>
                                    <p className="mt-1 text-sm">{room.nextScheduledAccess}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <button className={`px-3 py-1 text-sm rounded-lg flex items-center ${room.status === "Locked"
                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                    } transition-colors`}>
                                    {room.status === "Locked" ? <MdLockOpen className="mr-1" /> : <MdLock className="mr-1" />}
                                    {room.status === "Locked" ? "Unlock Door" : "Lock Door"}
                                </button>
                                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg flex items-center hover:bg-blue-200 transition-colors">
                                    <MdDoorbell className="mr-1" /> Door Alert Test
                                </button>
                                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg flex items-center hover:bg-gray-200 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* System Status Summary */}
            <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">System Status Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-gray-800">Total Rooms</p>
                        <p className="mt-1 text-2xl font-bold text-blue-600">{roomsData.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-gray-800">Online</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">
                            {roomsData.filter(r => r.online).length}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-gray-800">Locked</p>
                        <p className="mt-1 text-2xl font-bold text-red-600">
                            {roomsData.filter(r => r.status === "Locked").length}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-gray-800">Unlocked</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">
                            {roomsData.filter(r => r.status === "Unlocked").length}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-gray-800">Total Occupancy</p>
                        <p className="mt-1 text-2xl font-bold text-purple-600">
                            {roomsData.reduce((sum, room) => sum + room.currentOccupancy, 0)}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-gray-800">Active Warnings</p>
                        <p className="mt-1 text-2xl font-bold text-yellow-600">
                            {roomsData.reduce((sum, room) => sum + room.warnings, 0)}
                        </p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-xs text-gray-500">Live monitoring data: Updates automatically every {refreshInterval} seconds. Data is approximate and for monitoring purposes only.</p>
                </div>
            </div>
        </div>
    );
};

export default AccessMonitoring;
