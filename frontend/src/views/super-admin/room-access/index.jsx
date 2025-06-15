import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdMeetingRoom, MdLock, MdHistory, MdMonitor, MdDoorbell, MdSecurity, MdWarning } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const RoomAccess = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Dummy data for room status
    const roomsData = [
        {
            id: 1,
            name: "Lab Komputer 1",
            status: "Online",
            doorStatus: "Locked",
            lastAccess: "15:32:45",
            lastAccessBy: "Ahmad Fauzi (2021010101)",
            accessCount: 42,
            warnings: 0
        },
        {
            id: 2,
            name: "Lab Komputer 2",
            status: "Online",
            doorStatus: "Unlocked",
            lastAccess: "15:45:12",
            lastAccessBy: "Dr. Budi Santoso (Dosen)",
            accessCount: 38,
            warnings: 0
        },
        {
            id: 3,
            name: "Ruang 2.01",
            status: "Online",
            doorStatus: "Locked",
            lastAccess: "14:15:33",
            lastAccessBy: "Siti Nurhaliza (2021010102)",
            accessCount: 25,
            warnings: 0
        },
        {
            id: 4,
            name: "Ruang 2.02",
            status: "Offline",
            doorStatus: "Unknown",
            lastAccess: "09:22:18",
            lastAccessBy: "System Admin",
            accessCount: 12,
            warnings: 1
        },
        {
            id: 5,
            name: "Lab Jaringan",
            status: "Warning",
            doorStatus: "Locked",
            lastAccess: "13:05:51",
            lastAccessBy: "Indah Permata (2020010101)",
            accessCount: 31,
            warnings: 2
        },
        {
            id: 6,
            name: "Ruang 3.01",
            status: "Online",
            doorStatus: "Locked",
            lastAccess: "11:47:22",
            lastAccessBy: "Dr. Ahmad Wijaya (Dosen)",
            accessCount: 18,
            warnings: 0
        }
    ];

    // Function to determine status color
    const getStatusColor = (status) => {
        switch (status) {
            case "Online":
                return "bg-green-500";
            case "Offline":
                return "bg-gray-500";
            case "Warning":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    // Function to determine door status color
    const getDoorStatusColor = (status) => {
        switch (status) {
            case "Locked":
                return "bg-red-100 text-red-800";
            case "Unlocked":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Akses Ruangan</h1>
                <p className="text-gray-600">Monitor dan kelola akses pintu ruangan</p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                    className="bg-white rounded-xl shadow-md p-6"
                    data-aos="fade-up"
                >
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-4 rounded-full mr-4">
                            <MdMeetingRoom className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Ruangan</p>
                            <h3 className="text-3xl font-bold text-gray-800">{roomsData.length}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full">
                                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">100%</span>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-md p-6"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <div className="flex items-center">
                        <div className="bg-green-100 p-4 rounded-full mr-4">
                            <MdSecurity className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Status Online</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {roomsData.filter(room => room.status === "Online").length}
                            </h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-green-500 rounded-full"
                                    style={{ width: `${(roomsData.filter(room => room.status === "Online").length / roomsData.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                            {Math.round((roomsData.filter(room => room.status === "Online").length / roomsData.length) * 100)}%
                        </span>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-md p-6"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-4 rounded-full mr-4">
                            <MdWarning className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Peringatan Aktif</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {roomsData.reduce((acc, room) => acc + room.warnings, 0)}
                            </h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-yellow-500 rounded-full"
                                    style={{ width: roomsData.reduce((acc, room) => acc + room.warnings, 0) > 0 ? '30%' : '0%' }}
                                ></div>
                            </div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                            {roomsData.reduce((acc, room) => acc + room.warnings, 0) > 0 ? 'Perlu perhatian' : 'Semua normal'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/super-admin/room-access/access-logs" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdHistory className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Log Akses</h3>
                        <p className="text-gray-600">
                            Lihat riwayat akses pintu ruangan dan lacak aktivitas masuk dan keluar.
                        </p>
                        <button className="mt-4 text-indigo-600 font-medium flex items-center">
                            Lihat Log Akses
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/room-access/access-monitoring" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdMonitor className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Monitoring Akses</h3>
                        <p className="text-gray-600">
                            Monitor akses ruangan secara real-time dan lihat status pintu saat ini.
                        </p>
                        <button className="mt-4 text-blue-600 font-medium flex items-center">
                            Monitor Akses
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>

                <Link to="/super-admin/room-access/door-settings" className="block">
                    <div
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex justify-center items-center mb-4">
                            <MdLock className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Konfigurasi Pintu</h3>
                        <p className="text-gray-600">
                            Konfigurasi pengaturan akses pintu ruangan dan jadwal pembukaan otomatis.
                        </p>
                        <button className="mt-4 text-green-600 font-medium flex items-center">
                            Konfigurasi Pintu
                            <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Link>
            </div>

            {/* Room Status Cards */}
            <div className="mb-4" data-aos="fade-up" data-aos-delay="400">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Ruangan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomsData.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <div className={`h-3 w-3 rounded-full ${getStatusColor(room.status)} mr-2`}></div>
                                        <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getDoorStatusColor(room.doorStatus)}`}>
                                        {room.doorStatus}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Last Access:</span>
                                        <span>{room.lastAccess}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Access By:</span>
                                        <span className="truncate max-w-[150px]" title={room.lastAccessBy}>{room.lastAccessBy}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Today's Count:</span>
                                        <span>{room.accessCount}</span>
                                    </div>
                                    {room.warnings > 0 && (
                                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-center">
                                            <MdWarning className="text-yellow-500 mr-2" />
                                            <span className="text-sm text-yellow-700">{room.warnings} warnings detected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <button className="bg-blue-600 text-white text-sm py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors">
                                        View Details
                                    </button>
                                    <button className="bg-gray-100 text-gray-800 text-sm py-1 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                                        Force Lock
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8" data-aos="fade-up" data-aos-delay="500">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Sistem Akses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Face Recognition</p>
                        <div className="flex items-center mb-2">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm font-medium text-gray-800">Online</span>
                        </div>
                        <p className="text-xs text-gray-500">Last Restart: 3 days ago</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Door Control System</p>
                        <div className="flex items-center mb-2">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm font-medium text-gray-800">Online</span>
                        </div>
                        <p className="text-xs text-gray-500">All doors responding</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Authentication Server</p>
                        <div className="flex items-center mb-2">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm font-medium text-gray-800">Online</span>
                        </div>
                        <p className="text-xs text-gray-500">Load: 32%</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Error Rate (24h)</p>
                        <div className="flex items-center mb-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                            <span className="text-sm font-medium text-gray-800">0.5%</span>
                        </div>
                        <p className="text-xs text-gray-500">3 errors in last 24 hours</p>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-medium text-gray-800 mb-3">Recent System Events</h4>
                    <div className="space-y-3">
                        {[
                            { time: "15:45:22", event: "Door lock system restarted for Room 2.02", type: "warning" },
                            { time: "14:32:15", event: "Face recognition service updated to v2.3.1", type: "info" },
                            { time: "09:15:03", event: "Routine system check completed successfully", type: "success" }
                        ].map((event, idx) => (
                            <div key={idx} className={`text-sm p-2 rounded-lg ${event.type === "warning" ? "bg-yellow-50 text-yellow-700" :
                                    event.type === "info" ? "bg-blue-50 text-blue-700" :
                                        "bg-green-50 text-green-700"
                                }`}>
                                <span className="font-medium">{event.time}</span> - {event.event}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomAccess;
